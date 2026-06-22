import { tangoAdapter } from "./tango.js";
import { stripchatAdapter } from "./stripchat.js";
import type { PlatformAdapter } from "./types.js";

export const adapters: Record<string, PlatformAdapter> = {
  tango: tangoAdapter,
  stripchat: stripchatAdapter,
};

export function getAdapter(platform: string): PlatformAdapter {
  const adapter = adapters[platform];
  if (!adapter) {
    throw new Error(
      `No automation adapter for platform "${platform}". Available: ${Object.keys(adapters).join(", ")}`,
    );
  }
  return adapter;
}

export type { PlatformAdapter, BotCredentials, IncomingReply } from "./types.js";
