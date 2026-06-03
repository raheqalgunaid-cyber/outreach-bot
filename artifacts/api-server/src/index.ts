import express from "express";
import cors from "cors";
import campaignsRouter from "./routes/campaigns.js";
import templatesRouter from "./routes/templates.js";
import streamersRouter from "./routes/streamers.js";
import logsRouter from "./routes/logs.js";
import statsRouter from "./routes/stats.js";
import botAccountsRouter from "./routes/bot-accounts.js";
import inboxRouter from "./routes/inbox.js";

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());

app.get("/api/healthz", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/campaigns", campaignsRouter);
app.use("/api/templates", templatesRouter);
app.use("/api/streamers", streamersRouter);
app.use("/api/logs", logsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/bot-accounts", botAccountsRouter);
app.use("/api/inbox", inboxRouter);

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
