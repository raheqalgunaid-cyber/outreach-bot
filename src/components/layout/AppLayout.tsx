import React from "react";
import { Link, useLocation } from "wouter";
import { Activity, Bot, Inbox, LayoutDashboard, Megaphone, MessageSquareText, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Templates", href: "/templates", icon: MessageSquareText },
  { name: "Streamers", href: "/streamers", icon: Users },
  { name: "Logs", href: "/logs", icon: Activity },
  { name: "Inbox", href: "/inbox", icon: Inbox, badge: true },
  { name: "Bot Accounts", href: "/bot-accounts", icon: Bot },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const { data: unreadData } = useQuery<{ count: number }>({
    queryKey: ["inbox-unread-count"],
    queryFn: async () => {
      const res = await fetch("/api/inbox/unread-count");
      if (!res.ok) return { count: 0 };
      return res.json();
    },
    refetchInterval: 10000,
  });

  const unreadCount = unreadData?.count ?? 0;

  return (
    <div className="flex min-h-[100dvh] bg-background text-foreground">
      <aside className="w-64 border-r border-sidebar-border bg-sidebar flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Megaphone className="w-4 h-4" />
            </div>
            SuperLive Ops
          </Link>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4",
                  isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
                )} />
                <span className="flex-1">{item.name}</span>
                {item.badge && unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
