import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull().default("idle"),
  messageTemplateId: integer("message_template_id"),
  minViewers: integer("min_viewers"),
  maxViewers: integer("max_viewers"),
  category: text("category"),
  messagesPerHour: integer("messages_per_hour").notNull().default(30),
  totalMessagesSent: integer("total_messages_sent").notNull().default(0),
  totalResponses: integer("total_responses").notNull().default(0),
  credentials: text("credentials"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const message_templates = pgTable("message_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  platform: text("platform"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const streamers = pgTable("streamers", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  platform: text("platform").notNull(),
  displayName: text("display_name"),
  viewers: integer("viewers"),
  category: text("category"),
  profileUrl: text("profile_url"),
  status: text("status").notNull().default("pending"),
  lastContactedAt: timestamp("last_contacted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const outreach_logs = pgTable("outreach_logs", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  campaignName: text("campaign_name"),
  platform: text("platform").notNull(),
  streamerUsername: text("streamer_username").notNull(),
  messageSent: text("message_sent").notNull(),
  status: text("status").notNull().default("sent"),
  responseText: text("response_text"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bot_accounts = pgTable("bot_accounts", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  platform: text("platform").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  status: text("status").notNull().default("active"),
  bannedAt: timestamp("banned_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const inbox_messages = pgTable("inbox_messages", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  platform: text("platform").notNull(),
  fromUsername: text("from_username").notNull(),
  messageContent: text("message_content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  receivedAt: timestamp("received_at").notNull().defaultNow(),
});
