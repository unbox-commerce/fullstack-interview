import { date, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  organizationId: uuid("organization_id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  userId: uuid("user_id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.organizationId),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const creators = pgTable("creators", {
  creatorId: uuid("creator_id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.organizationId),
  username: text("username").notNull(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const videoStatus = pgEnum("video_status", ["live", "under_review", "removed"]);

export const videos = pgTable("videos", {
  videoId: uuid("video_id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.organizationId),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => creators.creatorId),
  title: text("title").notNull(),
  status: videoStatus("status").notNull().default("live"),
  thumbnailKey: text("thumbnail_key").notNull(),
  postedAt: timestamp("posted_at").notNull(),
});

export const videoDayMetrics = pgTable("video_day_metrics", {
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.videoId),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.organizationId),
  date: date("date").notNull(),
  views: integer("views").notNull().default(0),
});

export type Organization = typeof organizations.$inferSelect;
export type User = typeof users.$inferSelect;
export type Creator = typeof creators.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type VideoStatus = Video["status"];
