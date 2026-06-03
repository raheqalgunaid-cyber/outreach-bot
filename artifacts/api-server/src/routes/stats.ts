import { Router } from "express";
import { db, campaigns, outreach_logs } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const allCampaigns = await db.select().from(campaigns);
    const totalCampaigns = allCampaigns.length;
    const activeCampaigns = allCampaigns.filter(c => c.status === "running").length;
    const totalMessagesSent = allCampaigns.reduce((s, c) => s + c.totalMessagesSent, 0);
    const totalResponses = allCampaigns.reduce((s, c) => s + c.totalResponses, 0);
    const responseRate = totalMessagesSent > 0 ? (totalResponses / totalMessagesSent) * 100 : 0;

    const distinctStreamers = await db
      .select({ count: sql<number>`count(distinct ${outreach_logs.streamerUsername})` })
      .from(outreach_logs);
    const totalStreamersContacted = Number(distinctStreamers[0]?.count ?? 0);

    const platformRows = await db
      .select({
        platform: outreach_logs.platform,
        messagesSent: sql<number>`count(*)`,
        responses: sql<number>`count(case when ${outreach_logs.status} = 'responded' then 1 end)`,
      })
      .from(outreach_logs)
      .groupBy(outreach_logs.platform);

    const platformBreakdown = platformRows.map(r => ({
      platform: r.platform,
      messagesSent: Number(r.messagesSent),
      responses: Number(r.responses),
    }));

    const recentActivity = await db
      .select()
      .from(outreach_logs)
      .orderBy(desc(outreach_logs.createdAt))
      .limit(10);

    res.json({
      totalCampaigns,
      activeCampaigns,
      totalMessagesSent,
      totalResponses,
      totalStreamersContacted,
      responseRate,
      platformBreakdown,
      recentActivity,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
