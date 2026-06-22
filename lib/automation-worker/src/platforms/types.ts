import type { Page } from "puppeteer";

export interface BotCredentials {
  username: string;
  password: string;
  email: string;
}

export interface IncomingReply {
  fromUsername: string;
  messageContent: string;
}

/**
 * One adapter per outreach platform. Every selector here is a best-guess
 * placeholder — none of it has been run against the live site. Expect to
 * open devtools, inspect the real DOM, and rewrite the selectors before
 * this does anything useful.
 */
export interface PlatformAdapter {
  platform: string;
  login(page: Page, creds: BotCredentials): Promise<void>;
  isLoggedIn(page: Page): Promise<boolean>;
  sendMessage(page: Page, toUsername: string, message: string): Promise<void>;
  /** Scrape the inbox/DM list for messages not yet seen. */
  pollReplies(page: Page): Promise<IncomingReply[]>;
}
