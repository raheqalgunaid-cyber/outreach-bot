import { Router } from "express";
import { db, inbox_messages } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";

const router = Router();

router.get("/unread-count", async (_req, res) => {
  try {
    const [row] = await db
      .select({ count: sql<number>`count(*)` })
      .from(inbox_messages)
      .where(eq(inbox_messages.isRead, false));
    res.json({ count: Number(row?.count ?? 0) });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get("/", async (req, res) => {
  try {
    const { campaignId, unread } = req.query as Record<string, string>;
    const conditions = [];
    if (campaignId) conditions.push(eq(inbox_messages.campaignId, Number(campaignId)));
    if (unread === "true") conditions.push(eq(inbox_messages.isRead, false));
    const rows = await db
      .select()
      .from(inbox_messages)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(inbox_messages.receivedAt);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.patch("/read-all", async (req, res) => {
  try {
    const { campaignId } = req.body ?? {};
    await db
      .update(inbox_messages)
      .set({ isRead: true })
      .where(campaignId ? eq(inbox_messages.campaignId, Number(campaignId)) : undefined);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const [row] = await db
      .update(inbox_messages)
      .set({ isRead: true })
      .where(eq(inbox_messages.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
