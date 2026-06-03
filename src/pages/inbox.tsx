import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useListCampaigns, getListCampaignsQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, CheckCheck, ExternalLink } from "lucide-react";

interface InboxMessage {
  id: number;
  campaignId: number;
  platform: string;
  fromUsername: string;
  messageContent: string;
  isRead: boolean;
  receivedAt: string;
}

const PLATFORM_LABELS: Record<string, string> = {
  stripchat: "Stripchat",
  tango: "Tango",
  xenalive: "Xenalive",
};

const PLATFORM_COLORS: Record<string, string> = {
  stripchat: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  tango: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  xenalive: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

const PLATFORM_PROFILE_URL: Record<string, (u: string) => string> = {
  stripchat: u => `https://stripchat.com/${u}`,
  tango: u => `https://www.tango.me/${u}`,
  xenalive: u => `https://xenalive.com/${u}`,
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Inbox() {
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery<InboxMessage[]>({
    queryKey: ["inbox", campaignFilter, unreadOnly],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (campaignFilter !== "all") params.set("campaignId", campaignFilter);
      if (unreadOnly) params.set("unread", "true");
      const res = await fetch(`/api/inbox?${params}`);
      if (!res.ok) throw new Error("Failed to fetch inbox");
      return res.json();
    },
    refetchInterval: 5000,
  });

  const { data: campaigns } = useListCampaigns({ query: { queryKey: getListCampaignsQueryKey() } });

  const markRead = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/inbox/${id}/read`, { method: "PATCH" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inbox"] }),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      const body = campaignFilter !== "all" ? { campaignId: Number(campaignFilter) } : {};
      await fetch("/api/inbox/read-all", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      toast({ title: "All messages marked as read" });
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
    },
  });

  const unreadCount = messages?.filter(m => !m.isRead).length ?? 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Inbox
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground text-sm px-2.5">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">Replies from streamers who responded to your outreach.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className={unreadOnly ? "bg-muted" : ""}
            onClick={() => setUnreadOnly(v => !v)}
          >
            {unreadOnly ? "Show all" : "Unread only"}
          </Button>
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaigns?.map(c => (
                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
        </div>
      ) : !messages?.length ? (
        <Card>
          <CardContent className="py-20 flex flex-col items-center gap-3 text-center">
            <MessageCircle className="w-10 h-10 text-muted-foreground/40" />
            <p className="font-medium text-muted-foreground">No responses yet</p>
            <p className="text-sm text-muted-foreground/70 max-w-sm">
              When a streamer replies to your outreach message, their response will appear here automatically.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{messages.length} message{messages.length !== 1 ? "s" : ""}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-4 px-6 py-4 transition-colors ${!msg.isRead ? "bg-primary/3" : ""}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!msg.isRead ? "bg-primary" : "bg-transparent"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{msg.fromUsername}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PLATFORM_COLORS[msg.platform] ?? ""}`}>
                        {PLATFORM_LABELS[msg.platform] ?? msg.platform}
                      </span>
                      <span className="text-xs text-muted-foreground">{timeAgo(msg.receivedAt)}</span>
                    </div>
                    <p
                      className="text-sm mt-1 text-foreground/80 line-clamp-3"
                      dir={msg.messageContent.match(/[\u0600-\u06FF]/) ? "rtl" : "ltr"}
                    >
                      {msg.messageContent}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={PLATFORM_PROFILE_URL[msg.platform]?.(msg.fromUsername) ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border rounded px-2 py-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit
                    </a>
                    {!msg.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => markRead.mutate(msg.id)}
                      >
                        Mark read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
