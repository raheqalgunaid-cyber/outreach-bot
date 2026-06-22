import { Router } from "express";
import { db, bot_accounts } from "@workspace/db";
import { encryptSecret } from "@workspace/crypto";
import { eq } from "drizzle-orm";

const router = Router();

// Never send password ciphertext to clients — the worker process reads it directly from the DB.
function omitPassword<T extends { passwordEncrypted: string }>(row: T) {
  const { passwordEncrypted, ...rest } = row;
  return rest;
}

router.get("/", async (req, res) => {
  try {
    const { platform } = req.query as Record<string, string>;
    const rows = await db
      .select()
      .from(bot_accounts)
      .where(platform ? eq(bot_accounts.platform, platform) : undefined)
      .orderBy(bot_accounts.createdAt);
    res.json(rows.map(omitPassword));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    const { password, ...rest } = req.body as { password: string } & Record<string, unknown>;
    if (!password) {
      return res.status(400).json({ error: "password is required" });
    }
    const [row] = await db
      .insert(bot_accounts)
      .values({ ...rest, passwordEncrypted: encryptSecret(password) })
      .returning();
    res.status(201).json(omitPassword(row));
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
