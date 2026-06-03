import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useListCampaigns, getListCampaignsQueryKey } from "@workspace/api-client-react";
import { ShieldCheck, ShieldBan, Bot, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BotAccount {
  id: number;
  campaignId: number;
  platform: string;
  username: string;
  email: string;
  status: string;
  bannedAt: string | null;
  createdAt: string;
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

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0 flex items-center gap-1 w-fit">
        <ShieldCheck className="w-3 h-3" /> Active
      </Badge>
    );
  }
  if (status === "banned") {
    return (
      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-0 flex items-center gap-1 w-fit">
        <ShieldBan className="w-3 h-3" /> Banned
      </Badge>
    );
  }
  if (status === "provisioning") {
    return (
      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0 flex items-center gap-1 w-fit">
        <Loader2 className="w-3 h-3 animate-spin" /> Provisioning
      </Badge>
    );
  }
  if (status === "failed") {
    return (
      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-0 flex items-center gap-1 w-fit">
        <AlertCircle className="w-3 h-3" /> Failed
      </Badge>
    );
  }
  return <Badge variant="secondary">{status}</Badge>;
}

function AddAccountDialog({
  open,
  onClose,
  campaigns,
}: {
  open: boolean;
  onClose: () => void;
  campaigns: Array<{ id: number; name: string }>;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    campaignId: campaigns[0]?.id ? String(campaigns[0].id) : "",
    platform: "stripchat",
    username: "",
    password: "",
    email: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch("/api/bot-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          campaignId: Number(data.campaignId),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to add account");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Account added" });
      queryClient.invalidateQueries({ queryKey: ["bot-accounts"] });
      onClose();
      setForm({ campaignId: campaigns[0]?.id ? String(campaigns[0].id) : "", platform: "stripchat", username: "", password: "", email: "" });
    },
    onError: (err) => {
      toast({ title: String(err), variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Account Manually</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Campaign</Label>
              <Select value={form.campaignId} onValueChange={v => setForm(f => ({ ...f, campaignId: v }))}>
                <SelectTrigger><SelectValue placeholder="Pick campaign" /></SelectTrigger>
                <SelectContent>
                  {campaigns.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Platform</Label>
              <Select value={form.platform} onValueChange={v => setForm(f => ({ ...f, platform: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripchat">Stripchat</SelectItem>
                  <SelectItem value="tango">Tango</SelectItem>
                  <SelectItem value="xenalive">Xenalive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Username</Label>
            <Input
              placeholder="e.g. cooluser123"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Account password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              placeholder="e.g. user@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.campaignId || !form.username || !form.password || !form.email}
          >
            {mutation.isPending ? "Adding..." : "Add Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function BotAccounts() {
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: accounts, isLoading } = useQuery<BotAccount[]>({
    queryKey: ["bot-accounts", platformFilter],
    queryFn: async () => {
      const res = await fetch(`/api/bot-accounts${platformFilter !== 'all' ? `?platform=${platformFilter}` : ''}`);
      if (!res.ok) throw new Error("Failed to fetch bot accounts");
      return res.json();
    },
    refetchInterval: 3000,
  });

  const { data: campaigns } = useListCampaigns({ query: { queryKey: getListCampaignsQueryKey() } });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/bot-accounts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      toast({ title: "Account removed" });
      queryClient.invalidateQueries({ queryKey: ["bot-accounts"] });
    },
    onError: () => toast({ title: "Failed to remove account", variant: "destructive" }),
  });

  const filtered = accounts?.filter(a =>
    platformFilter === "all" ? true : a.platform === platformFilter,
  ) ?? [];

  const activeCount = accounts?.filter(a => a.status === "active").length ?? 0;
  const bannedCount = accounts?.filter(a => a.status === "banned").length ?? 0;
  const provisioningCount = accounts?.filter(a => a.status === "provisioning").length ?? 0;

  const campaignList = (campaigns ?? []).map(c => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bot Accounts</h1>
          <p className="text-muted-foreground mt-1">Accounts used by running campaigns — auto-created or added manually.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="stripchat">Stripchat</SelectItem>
              <SelectItem value="tango">Tango</SelectItem>
              <SelectItem value="xenalive">Xenalive</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Account
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-3xl font-bold mt-1">{accounts?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-3xl font-bold mt-1 text-green-600">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Provisioning</p>
            <p className="text-3xl font-bold mt-1 text-blue-500">{provisioningCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Banned</p>
            <p className="text-3xl font-bold mt-1 text-red-500">{bannedCount}</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
            <Bot className="w-10 h-10 text-muted-foreground/40" />
            <p className="font-medium text-muted-foreground">No bot accounts yet</p>
            <p className="text-sm text-muted-foreground/70 max-w-sm">
              Start a campaign to auto-create accounts, or click <strong>Add Account</strong> to add an existing one manually.
            </p>
            <Button variant="outline" size="sm" className="mt-2 gap-2" onClick={() => setAddOpen(true)}>
              <Plus className="w-4 h-4" /> Add Account Manually
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Pool</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filtered.map(account => (
                <div
                  key={account.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{account.username}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{account.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${PLATFORM_COLORS[account.platform] ?? ""}`}>
                      {PLATFORM_LABELS[account.platform] ?? account.platform}
                    </span>
                    <StatusBadge status={account.status} />
                    <span className="text-xs text-muted-foreground w-32 text-right">
                      {account.bannedAt
                        ? `Banned ${new Date(account.bannedAt).toLocaleDateString()}`
                        : `Created ${new Date(account.createdAt).toLocaleDateString()}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMutation.mutate(account.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <AddAccountDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        campaigns={campaignList}
      />
    </div>
  );
}
