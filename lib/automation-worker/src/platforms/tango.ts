import type { PlatformAdapter } from "./types.js";

// PLACEHOLDER ADAPTER — none of these selectors have been verified against
// the live tango.me site. Open the real login/DM pages in a browser, inspect
// the DOM with devtools, and replace every selector below before relying on
// this for anything. Tango is mobile-app-first; its web client may not even
// expose a usable DM flow, so check that first.
export const tangoAdapter: PlatformAdapter = {
  platform: "tango",

  async login(page, creds) {
    await page.goto("https://www.tango.me/login", { waitUntil: "networkidle2" });
    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', creds.email);
    await page.type('input[name="password"]', creds.password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {});
  },

  async isLoggedIn(page) {
    return page.$('[data-testid="user-avatar"]').then((el) => el !== null);
  },

  async sendMessage(page, toUsername, message) {
    await page.goto(`https://www.tango.me/channel/${toUsername}`, { waitUntil: "networkidle2" });
    await page.waitForSelector('[data-testid="chat-input"]');
    await page.type('[data-testid="chat-input"]', message);
    await page.keyboard.press("Enter");
  },

  async pollReplies(page) {
    await page.goto("https://www.tango.me/messages", { waitUntil: "networkidle2" });
    const replies = await page.$$eval('[data-testid="conversation-row"]', (rows) =>
      rows.map((row) => ({
        fromUsername: row.querySelector(".sender-name")?.textContent?.trim() ?? "",
        messageContent: row.querySelector(".last-message")?.textContent?.trim() ?? "",
      })),
    );
    return replies.filter((r) => r.fromUsername);
  },
};
