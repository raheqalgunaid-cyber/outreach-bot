import { useState } from "react";
import { useListLogs, useListCampaigns, getListCampaignsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollText } from "lucide-react";

const PLATFORM_COLORS: Record<string, string> = {
  stripchat: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  tango: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  xenalive: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

const STATUS_COLORS: Record<string, string> = {
  sent: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  responded: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

export default function Logs() {
  const [campaignId, setCampaignId] = useState("all");
  const [platform, setPlatform] = useState("all");

  const { data: campaigns } = useListCampaigns({ query: { queryKey: getListCampaignsQueryKey() } });

  const params: Record<string, string | number> = { limit: 50 };
  if (campaignId !== "all") params.campaignId = Number(campaignId);
  if (platform !== "all") params.platform = platform;

  const { data: logs, isLoading } = useListLogs({
    params,
    query: { refetchInterval: 5000 },
  });

  const campaignMap = Object.fromEntries((campaigns ?? []).map(c => [c.id, c.name]));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
        <p className="text-muted-foreground mt-1">Real-time outreach activity log.</p>
      </div>

      <div className="flex gap-3">
        <Select value={campaignId} onValueChange={setCampaignId}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {(campaigns ?? []).map(c => (
              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="stripchat">Stripchat</SelectItem>
            <SelectItem value="tango">Tango</SelectItem>
            <SelectItem value="xenalive">Xenalive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </div>
      ) : !logs?.length ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
            <ScrollText className="w-10 h-10 text-muted-foreground/40" />
            <p className="font-medium text-muted-foreground">No activity yet</p>
            <p className="text-sm text-muted-foreground/70 max-w-sm">
              Outreach activity will appear here once campaigns start running.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Time</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Campaign</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Platform</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Streamer</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Status</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(logs as any[]).map((log: any) => (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                        {new Date(log.createdAt ?? log.sentAt ?? log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {campaignMap[log.campaignId] ?? `Campaign #${log.campaignId}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PLATFORM_COLORS[log.platform] ?? "bg-muted text-muted-foreground"}`}>
                          {log.platform.charAt(0).toUpperCase() + log.platform.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">{log.streamerUsername ?? log.username}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[log.status] ?? "bg-muted text-muted-foreground"}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                        {log.message ?? log.messageContent ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
