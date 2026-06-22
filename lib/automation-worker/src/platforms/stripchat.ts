import type { PlatformAdapter } from "./types.js";

// PLACEHOLDER ADAPTER — same caveat as tango.ts: unverified against the live
// site. Stripchat is known to use Cloudflare-style bot detection on login;
// expect captchas and IP/device fingerprint checks to block headless runs.
// You will likely need a real residential-ish browser profile and to run
// headful (not headless) at least for the first login per account.
export const stripchatAdapter: PlatformAdapter = {
  platform: "stripchat",

  async login(page, creds) {
    await page.goto("https://stripchat.com/login", { waitUntil: "networkidle2" });
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', creds.username);
    await page.type('input[name="password"]', creds.password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {});
  },

  async isLoggedIn(page) {
    return page.$(".header-user-avatar").then((el) => el !== null);
  },

  async sendMessage(page, toUsername, message) {
    await page.goto(`https://stripchat.com/${toUsername}`, { waitUntil: "networkidle2" });
    await page.waitForSelector(".chat-message-input");
    await page.type(".chat-message-input", message);
    await page.keyboard.press("Enter");
  },

  async pollReplies(page) {
    await page.goto("https://stripchat.com/messenger", { waitUntil: "networkidle2" });
    const replies = await page.$$eval(".conversation-list-item", (rows) =>
      rows.map((row) => ({
        fromUsername: row.querySelector(".conversation-username")?.textContent?.trim() ?? "",
        messageContent: row.querySelector(".conversation-preview")?.textContent?.trim() ?? "",
      })),
    );
    return replies.filter((r) => r.fromUsername);
  },
};
