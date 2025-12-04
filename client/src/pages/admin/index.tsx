import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Music,
  Users,
  Calendar,
  FileText,
  Radio,
  ListMusic,
  Video,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Eye,
  UserPlus,
  Play,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { MetricsChart } from "@/components/metrics-chart";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { Release, Event, Post, RadioShow, Artist } from "@shared/schema";
import { useAuth } from "@/lib/auth-context";

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/releases", icon: Music, label: "Releases" },
  { href: "/admin/artists", icon: Users, label: "Artists" },
  { href: "/admin/events", icon: Calendar, label: "Events" },
  { href: "/admin/posts", icon: FileText, label: "Blog / News" },
  { href: "/admin/radio", icon: Radio, label: "Radio Shows" },
  { href: "/admin/playlists", icon: ListMusic, label: "Playlists" },
  { href: "/admin/videos", icon: Video, label: "Videos" },
  { href: "/admin/contacts", icon: Mail, label: "Messages" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];



export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, username } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b flex items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          data-testid="button-admin-menu"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <span className="font-bold">
          GROUP<span className="text-primary">THERAPY</span> Admin
        </span>
        <ThemeToggle />
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-card border-r transform transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b">
            <Link href="/" className="font-bold text-lg">
              GROUP<span className="text-primary">THERAPY</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <div className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = location === link.href || 
                  (link.href !== "/admin" && location.startsWith(link.href));
                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive && "bg-primary/10 text-primary"
                      )}
                      onClick={() => setSidebarOpen(false)}
                      data-testid={`link-admin-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start gap-3" data-testid="link-admin-view-site">
                <Eye className="h-4 w-4" />
                View Site
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-destructive" 
              data-testid="button-admin-logout"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="hidden lg:flex h-16 items-center justify-between px-6 border-b bg-card">
          <div className="text-sm text-muted-foreground">
            Welcome back, {username || "Admin"}
          </div>
          <ThemeToggle />
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: releases = [] } = useQuery<Release[]>({
    queryKey: ["/api/releases"],
  });

  const { data: artists = [] } = useQuery<Artist[]>({
    queryKey: ["/api/artists"],
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: radioShows = [] } = useQuery<RadioShow[]>({
    queryKey: ["/api/radio/shows"],
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics/overview"],
  });

  const publishedReleases = releases.filter(r => r.published);
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date());

  const stats = [
    { label: "Total Releases", value: releases.length.toString(), change: `${publishedReleases.length} published`, icon: Music },
    { label: "Active Artists", value: artists.length.toString(), change: "All time", icon: Users },
    { label: "Monthly Listeners", value: analytics?.totalListeners?.toLocaleString() || "0", change: `${analytics?.activeUsers?.toLocaleString() || "0"} active`, icon: TrendingUp },
    { label: "Upcoming Events", value: upcomingEvents.length.toString(), change: `${events.length} total`, icon: Calendar },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-admin-title">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your record label performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-primary">{stat.change} from last month</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks at your fingertips</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Link href="/admin/releases/new">
                <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-quick-new-release">
                  <Music className="h-4 w-4" />
                  New Release
                </Button>
              </Link>
              <Link href="/admin/events/new">
                <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-quick-new-event">
                  <Calendar className="h-4 w-4" />
                  New Event
                </Button>
              </Link>
              <Link href="/admin/posts/new">
                <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-quick-new-post">
                  <FileText className="h-4 w-4" />
                  New Post
                </Button>
              </Link>
              <Link href="/admin/radio/new">
                <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-quick-new-show">
                  <Radio className="h-4 w-4" />
                  New Show
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publishedReleases.slice(0, 2).map((release) => (
                  <div
                    key={release.id}
                    className="flex items-start justify-between gap-4 pb-4 border-b"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Release published</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {release.title} - {release.artistName}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(release.releaseDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {upcomingEvents.slice(0, 1).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between gap-4 pb-4 border-b"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Event scheduled</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {event.title}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {posts.slice(0, 1).map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start justify-between gap-4 pb-4 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Blog post {post.published ? 'published' : 'drafted'}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {post.title}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {releases.length === 0 && events.length === 0 && posts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Metrics */}
        <div className="grid lg:grid-cols-2 gap-6">
          <MetricsChart
            title="Top Releases This Month"
            description="Most recent releases"
            data={
              analytics?.engagement?.releases?.map((release: any) => ({
                label: release.title,
                value: release.streams || 0,
                previousValue: Math.floor((release.streams || 0) * 0.85),
              })) || 
              publishedReleases.slice(0, 5).map((release) => ({
                label: release.title,
                value: Math.floor(Math.random() * 50000),
                previousValue: Math.floor(Math.random() * 40000),
              }))
            }
          />

          <MetricsChart
            title="Radio Show Performance"
            description="Average listeners per show"
            data={
              analytics?.engagement?.radioShows?.map((show: any) => ({
                label: show.title,
                value: show.avgListeners || 0,
                previousValue: Math.floor((show.avgListeners || 0) * 0.9),
              })) || 
              radioShows.slice(0, 4).map((show) => ({
                label: show.title,
                value: Math.floor(Math.random() * 1500),
                previousValue: Math.floor(Math.random() * 1200),
              }))
            }
          />
        </div>

        {/* Content Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
            <CardDescription>Manage your content across all sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Releases", count: releases.length, href: "/admin/releases", icon: Music },
                { label: "Events", count: events.length, href: "/admin/events", icon: Calendar },
                { label: "Blog Posts", count: posts.length, href: "/admin/posts", icon: FileText },
                { label: "Radio Shows", count: radioShows.length, href: "/admin/radio", icon: Radio },
              ].map((item) => (
                <Link key={item.label} href={item.href}>
                  <div className="flex items-center justify-between p-4 rounded-md border hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.count} items</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
