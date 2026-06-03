import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/dashboard";
import Campaigns from "@/pages/campaigns";
import CampaignDetail from "@/pages/campaign-detail";
import NewCampaign from "@/pages/new-campaign";
import Templates from "@/pages/templates";
import Streamers from "@/pages/streamers";
import Logs from "@/pages/logs";
import Inbox from "@/pages/inbox";
import BotAccounts from "@/pages/bot-accounts";
import "@/index.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/campaigns/new" component={NewCampaign} />
            <Route path="/campaigns/:id" component={CampaignDetail} />
            <Route path="/campaigns" component={Campaigns} />
            <Route path="/templates" component={Templates} />
            <Route path="/streamers" component={Streamers} />
            <Route path="/logs" component={Logs} />
            <Route path="/inbox" component={Inbox} />
            <Route path="/bot-accounts" component={BotAccounts} />
          </Switch>
        </AppLayout>
      </Router>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
