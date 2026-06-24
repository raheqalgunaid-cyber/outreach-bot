import puppeteer from "puppeteer";
import { eq, and } from "drizzle-orm";
import {
  db,
  campaigns,
  bot_accounts,
  streamers,
  outreach_logs,
  inbox_messages,
  message_templates,
} from "@workspace/db";
import { decryptSecret } from "@workspace/crypto";
import { getAdapter } from "./platforms/index.js";

function renderTemplate(content: string, streamerName: string): string {
  return content.replaceAll("{streamer_name}", streamerName);
}

export async function runCampaign(campaignId: number) {
  const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, campaignId));
  if (!campaign) throw new Error(`Campaign ${campaignId} not found`);

  const adapter = getAdapter(campaign.platform);

  const [botAccount] = await db
    .select()
    .from(bot_accounts)
    .where(and(eq(bot_accounts.campaignId, campaignId), eq(bot_accounts.status, "active")));
  if (!botAccount) throw new Error(`No active bot account for campaign ${campaignId}`);

  let template: { content: string } | undefined;
  if (campaign.messageTemplateId) {
    [template] = await db
      .select()
      .from(message_templates)
      .where(eq(message_templates.id, campaign.messageTemplateId));
  }
  if (!template) throw new Error(`Campaign ${campaignId} has no message template`);

  const conditions = [eq(streamers.platform, campaign.platform), eq(streamers.status, "pending")];
  if (campaign.region) conditions.push(eq(streamers.region, campaign.region));
  if (campaign.category) conditions.push(eq(streamers.category, campaign.category));
  const targets = await db
    .select()
    .from(streamers)
    .where(and(...conditions));

  if (targets.length === 0) {
    console.log("No pending streamers match this campaign's targeting — nothing to do.");
    return;
  }

  // headless: false on purpose for the first run on any new platform/account —
  // headless Chrome is far more likely to get flagged by bot detection.
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const creds = {
      username: botAccount.username,
      email: botAccount.email,
      password: decryptSecret(botAccount.passwordEncrypted),
    };
    await adapter.login(page, creds);
    if (!(await adapter.isLoggedIn(page))) {
      throw new Error("Login did not succeed — selectors are likely stale, inspect the page manually.");
    }

    const delayMs = Math.max(1, Math.floor(3_600_000 / campaign.messagesPerHour));

    for (const streamer of targets) {
      const message = renderTemplate(template.content, streamer.displayName ?? streamer.username);
      try {
        await adapter.sendMessage(page, streamer.username, message);
        await db.insert(outreach_logs).values({
          campaignId: campaign.id,
          campaignName: campaign.name,
          platform: campaign.platform,
          streamerUsername: streamer.username,
          messageSent: message,
          status: "sent",
        });
        await db
          .update(streamers)
          .set({ status: "contacted", lastContactedAt: new Date() })
          .where(eq(streamers.id, streamer.id));
        await db
          .update(campaigns)
          .set({ totalMessagesSent: campaign.totalMessagesSent + 1 })
          .where(eq(campaigns.id, campaign.id));
      } catch (err) {
        await db.insert(outreach_logs).values({
          campaignId: campaign.id,
          campaignName: campaign.name,
          platform: campaign.platform,
          streamerUsername: streamer.username,
          messageSent: message,
          status: "failed",
        });
        console.error(`Failed to message ${streamer.username}:`, err);
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const replies = await adapter.pollReplies(page);
    for (const reply of replies) {
      await db.insert(inbox_messages).values({
        campaignId: campaign.id,
        platform: campaign.platform,
        fromUsername: reply.fromUsername,
        messageContent: reply.messageContent,
      });
      await db
        .update(streamers)
        .set({ status: "responded" })
        .where(and(eq(streamers.username, reply.fromUsername), eq(streamers.platform, campaign.platform)));
    }
  } finally {
    await browser.close();
  }
}
