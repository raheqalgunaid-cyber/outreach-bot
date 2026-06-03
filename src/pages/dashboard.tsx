import React from "react";
import { useGetStats, getGetStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Megaphone, MessageSquareText, Reply, Users } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of your recruitment operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Campaigns"
          value={stats.activeCampaigns}
          subtitle={`Out of ${stats.totalCampaigns} total`}
          icon={<Activity className="w-4 h-4 text-primary" />}
        />
        <StatCard
          title="Messages Sent"
          value={stats.totalMessagesSent}
          icon={<MessageSquareText className="w-4 h-4 text-blue-500" />}
        />
        <StatCard
          title="Responses"
          value={stats.totalResponses}
          subtitle={`${stats.responseRate.toFixed(1)}% response rate`}
          icon={<Reply className="w-4 h-4 text-green-500" />}
        />
        <StatCard
          title="Streamers Contacted"
          value={stats.totalStreamersContacted}
          icon={<Users className="w-4 h-4 text-orange-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">No recent activity</div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 text-sm">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Megaphone className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {log.streamerUsername} <span className="text-muted-foreground font-normal">on {log.platform}</span>
                      </p>
                      <p className="text-muted-foreground truncate">{log.messageSent}</p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.platformBreakdown.map((platform) => (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{platform.platform}</span>
                    <span className="text-muted-foreground">{platform.responses} / {platform.messagesSent} ({((platform.responses / (platform.messagesSent || 1)) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${(platform.messagesSent / stats.totalMessagesSent) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {stats.platformBreakdown.length === 0 && (
                <div className="py-4 text-center text-muted-foreground text-sm">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: { title: string; value: number | string; subtitle?: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
