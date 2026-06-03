import { Router } from "express";
import { db, campaigns } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(campaigns).orderBy(campaigns.createdAt);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/", async (req, res) => {
  try {
    const [row] = await db.insert(campaigns).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(campaigns).where(eq(campaigns.id, Number(req.params.id)));
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const [row] = await db
      .update(campaigns)
      .set(req.body)
      .where(eq(campaigns.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(campaigns).where(eq(campaigns.id, Number(req.params.id)));
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/:id/start", async (req, res) => {
  try {
    const [row] = await db
      .update(campaigns)
      .set({ status: "running" })
      .where(eq(campaigns.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/:id/stop", async (req, res) => {
  try {
    const [row] = await db
      .update(campaigns)
      .set({ status: "idle" })
      .where(eq(campaigns.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
