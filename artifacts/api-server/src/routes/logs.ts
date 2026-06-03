import { Router } from "express";
import { db, outreach_logs } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { campaignId, platform, limit } = req.query as Record<string, string>;
    const conditions = [];
    if (campaignId) conditions.push(eq(outreach_logs.campaignId, Number(campaignId)));
    if (platform) conditions.push(eq(outreach_logs.platform, platform));
    const rows = await db
      .select()
      .from(outreach_logs)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(outreach_logs.createdAt))
      .limit(limit ? Number(limit) : 500);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
