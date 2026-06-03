import { useState } from "react";
import { useListStreamers } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Users } from "lucide-react";

const PLATFORM_COLORS: Record<string, string> = {
  stripchat: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  tango: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  xenalive: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  contacted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  responded: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  joined: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  ignored: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const PLATFORM_PROFILE_URL: Record<string, (u: string) => string> = {
  stripchat: u => `https://stripchat.com/${u}`,
  tango: u => `https://www.tango.me/${u}`,
  xenalive: u => `https://xenalive.com/${u}`,
};

export default function Streamers() {
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("all");

  const params: Record<string, string> = {};
  if (platform !== "all") params.platform = platform;
  if (status !== "all") params.status = status;

  const { data: streamers, isLoading } = useListStreamers({
    query: { refetchInterval: 10000 },
    ...(Object.keys(params).length ? { params } : {}),
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Streamers</h1>
          <p className="text-muted-foreground mt-1">Discovered streamers and their outreach status.</p>
        </div>
      </div>

      <div className="flex gap-3">
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
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
            <SelectItem value="joined">Joined</SelectItem>
            <SelectItem value="ignored">Ignored</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </div>
      ) : !streamers?.length ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
            <Users className="w-10 h-10 text-muted-foreground/40" />
            <p className="font-medium text-muted-foreground">No streamers found</p>
            <p className="text-sm text-muted-foreground/70 max-w-sm">
              Streamers will appear here once campaigns start discovering them.
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
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Username</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Platform</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Viewers</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Category</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Status</th>
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Last Contacted</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {streamers.map((s: any) => {
                    const profileUrl = PLATFORM_PROFILE_URL[s.platform]?.(s.username);
                    return (
                      <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <a
                            href={profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:underline inline-flex items-center gap-1"
                          >
                            {s.username}
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PLATFORM_COLORS[s.platform] ?? "bg-muted text-muted-foreground"}`}>
                            {s.platform.charAt(0).toUpperCase() + s.platform.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{s.viewers ?? "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.category ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[s.status] ?? "bg-muted text-muted-foreground"}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {s.lastContactedAt ? new Date(s.lastContactedAt).toLocaleString() : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
