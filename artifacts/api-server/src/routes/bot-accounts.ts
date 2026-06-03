import { Router } from "express";
import { db, bot_accounts } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { platform } = req.query as Record<string, string>;
    const rows = await db
      .select()
      .from(bot_accounts)
      .where(platform ? eq(bot_accounts.platform, platform) : undefined)
      .orderBy(bot_accounts.createdAt);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    const [row] = await db.insert(bot_accounts).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(bot_accounts).where(eq(bot_accounts.id, Number(req.params.id)));
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
