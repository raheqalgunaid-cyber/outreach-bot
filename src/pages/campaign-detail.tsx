import React from "react";
import { useParams, Link } from "wouter";
import { 
  useGetCampaign, getGetCampaignQueryKey, 
  useStartCampaign, useStopCampaign,
  useListLogs, getListLogsQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Play, Square, Settings, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CampaignDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaign, isLoading: loadingCampaign } = useGetCampaign(id, { 
    query: { enabled: !!id, queryKey: getGetCampaignQueryKey(id) } 
  });

  const { data: logs, isLoading: loadingLogs } = useListLogs({
    query: {
      enabled: !!id,
      queryKey: [...getListLogsQueryKey(), { campaignId: id }]
    },
    request: { query: { campaignId: id, limit: 10 } } as any
  });

  const startMutation = useStartCampaign({
    mutation: {
      onSuccess: () => {
        toast({ title: "Campaign started" });
        queryClient.invalidateQueries({ queryKey: getGetCampaignQueryKey(id) });
      }
    }
  });

  const stopMutation = useStopCampaign({
    mutation: {
      onSuccess: () => {
        toast({ title: "Campaign stopped" });
        queryClient.invalidateQueries({ queryKey: getGetCampaignQueryKey(id) });
      }
    }
  });

  if (loadingCampaign || !campaign) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="col-span-2 h-64" />
          <Skeleton className="col-span-1 h-64" />
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return <Badge className="bg-green-500/10 text-green-500">Running</Badge>;
      case 'paused': return <Badge variant="secondary">Paused</Badge>;
      case 'idle': return <Badge variant="outline">Idle</Badge>;
      case 'completed': return <Badge variant="outline" className="opacity-50">Completed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/campaigns">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
              {getStatusBadge(campaign.status)}
            </div>
            <p className="text-muted-foreground mt-1 capitalize text-sm font-medium">
              Platform: {campaign.platform}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {campaign.status !== 'running' ? (
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => startMutation.mutate({ id })}
              disabled={startMutation.isPending}
            >
              <Play className="w-4 h-4 mr-2" /> Start Campaign
            </Button>
          ) : (
            <Button 
              variant="destructive"
              onClick={() => stopMutation.mutate({ id })}
              disabled={stopMutation.isPending}
            >
              <Square className="w-4 h-4 mr-2" /> Stop Campaign
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
              <div>
                <dt className="text-muted-foreground mb-1">Target Viewers</dt>
                <dd className="font-medium">{campaign.minViewers || 0} - {campaign.maxViewers || 'Unlimited'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1">Category Filter</dt>
                <dd className="font-medium">{campaign.category || 'None'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1">Rate Limit</dt>
                <dd className="font-medium">{campaign.messagesPerHour} / hour</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1">Created At</dt>
                <dd className="font-medium">{new Date(campaign.createdAt).toLocaleString()}</dd>
              </div>
              {campaign.notes && (
                <div className="col-span-2">
                  <dt className="text-muted-foreground mb-1">Notes</dt>
                  <dd className="font-medium bg-muted p-3 rounded-md">{campaign.notes}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Messages Sent</div>
              <div className="text-3xl font-bold">{campaign.totalMessagesSent}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Responses</div>
              <div className="text-3xl font-bold text-green-600">{campaign.totalResponses}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Response Rate</div>
              <div className="text-xl font-bold">
                {campaign.totalMessagesSent > 0 
                  ? ((campaign.totalResponses / campaign.totalMessagesSent) * 100).toFixed(1) + '%' 
                  : '0%'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Logs</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/logs?campaignId=${id}`}>View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingLogs ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : logs?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activity logs yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Streamer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="font-medium">{log.streamerUsername}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'responded' ? 'default' : log.status === 'failed' ? 'destructive' : 'secondary'} className="capitalize">
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-muted-foreground">
                      {log.messageSent}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
