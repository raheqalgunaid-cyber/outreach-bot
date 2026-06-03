import React from "react";
import { Link } from "wouter";
import { useListCampaigns, getListCampaignsQueryKey, useStartCampaign, useStopCampaign, useDeleteCampaign } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Square, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Campaigns() {
  const { data: campaigns, isLoading } = useListCampaigns({ query: { queryKey: getListCampaignsQueryKey() } });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor your automated outreach campaigns.</p>
        </div>
        <Button asChild>
          <Link href="/campaigns/new">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      ) : campaigns?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No campaigns yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">Create your first campaign to start recruiting streamers automatically.</p>
            <Button asChild>
              <Link href="/campaigns/new">Create Campaign</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns?.map(campaign => (
            <CampaignRow key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}

function CampaignRow({ campaign }: { campaign: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const startMutation = useStartCampaign({
    mutation: {
      onSuccess: () => {
        toast({ title: "Campaign started" });
        queryClient.invalidateQueries({ queryKey: getListCampaignsQueryKey() });
      }
    }
  });

  const stopMutation = useStopCampaign({
    mutation: {
      onSuccess: () => {
        toast({ title: "Campaign stopped" });
        queryClient.invalidateQueries({ queryKey: getListCampaignsQueryKey() });
      }
    }
  });

  const deleteMutation = useDeleteCampaign({
    mutation: {
      onSuccess: () => {
        toast({ title: "Campaign deleted" });
        queryClient.invalidateQueries({ queryKey: getListCampaignsQueryKey() });
      }
    }
  });

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'stripchat': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'tango': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'xenalive': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Running</Badge>;
      case 'paused': return <Badge variant="secondary">Paused</Badge>;
      case 'idle': return <Badge variant="outline">Idle</Badge>;
      case 'completed': return <Badge variant="outline" className="opacity-50">Completed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-6">
          <div className="flex-1 flex items-center gap-6">
            <div>
              <Link href={`/campaigns/${campaign.id}`} className="text-lg font-semibold hover:underline">
                {campaign.name}
              </Link>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(campaign.platform)} capitalize`}>
                  {campaign.platform}
                </span>
                <span>{campaign.totalMessagesSent} messages sent</span>
                <span>{campaign.totalResponses} responses</span>
              </div>
            </div>
            <div>{getStatusBadge(campaign.status)}</div>
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {campaign.status !== 'running' ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => startMutation.mutate({ id: campaign.id })}
                disabled={startMutation.isPending}
              >
                <Play className="w-4 h-4 mr-2" /> Start
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={() => stopMutation.mutate({ id: campaign.id })}
                disabled={stopMutation.isPending}
              >
                <Square className="w-4 h-4 mr-2" /> Stop
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                if (confirm('Delete this campaign?')) {
                  deleteMutation.mutate({ id: campaign.id });
                }
              }}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
