import { runCampaign } from "./runCampaign.js";

const campaignId = Number(process.argv[2]);
if (!campaignId) {
  console.error("Usage: tsx src/index.ts <campaignId>");
  process.exit(1);
}

runCampaign(campaignId)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
