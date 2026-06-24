import { Router } from "express";
import { db, streamers } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { platform, status, region } = req.query as Record<string, string>;
    const conditions = [];
    if (platform) conditions.push(eq(streamers.platform, platform));
    if (status) conditions.push(eq(streamers.status, status));
    if (region) conditions.push(eq(streamers.region, region));
    const rows = await db
      .select()
      .from(streamers)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(streamers.createdAt);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
