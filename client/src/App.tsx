
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { RadioProvider } from "@/lib/radio-context";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { PerformanceMonitor } from "@/components/performance-monitor";
import { Navigation } from "@/components/navigation";
import { GlobalRadioPlayer } from "@/components/radio-player";
import { Footer } from "@/components/footer";

import HomePage from "@/pages/home";
import RadioPage from "@/pages/radio";
import ReleasesPage from "@/pages/releases";
import EventsPage from "@/pages/events";
import ArtistsPage from "@/pages/artists";
import VideosPage from "@/pages/videos";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import NewsPage from "@/pages/news";
import PressPage from "@/pages/press";

import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/index";
import AdminReleases from "@/pages/admin/releases";
import AdminEvents from "@/pages/admin/events";
import AdminPosts from "@/pages/admin/posts";
import AdminContacts from "@/pages/admin/contacts";
import AdminSettings from "@/pages/admin/settings";
import AdminVideos from "@/pages/admin/videos";
import AdminPlaylists from "@/pages/admin/playlists";
import AdminRadioShows from "@/pages/admin/radio-shows";
import AdminArtists from "@/pages/admin/artists";

import NotFound from "@/pages/not-found";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <GlobalRadioPlayer />
    </>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        <PublicLayout>
          <HomePage />
        </PublicLayout>
      </Route>
      <Route path="/radio">
        <PublicLayout>
          <RadioPage />
        </PublicLayout>
      </Route>
      <Route path="/releases">
        <PublicLayout>
          <ReleasesPage />
        </PublicLayout>
      </Route>
      <Route path="/releases/:slug">
        <PublicLayout>
          <ReleasesPage />
        </PublicLayout>
      </Route>
      <Route path="/events">
        <PublicLayout>
          <EventsPage />
        </PublicLayout>
      </Route>
      <Route path="/events/:slug">
        <PublicLayout>
          <EventsPage />
        </PublicLayout>
      </Route>
      <Route path="/artists">
        <PublicLayout>
          <ArtistsPage />
        </PublicLayout>
      </Route>
      <Route path="/artists/:slug">
        <PublicLayout>
          <ArtistsPage />
        </PublicLayout>
      </Route>
      <Route path="/videos">
        <PublicLayout>
          <VideosPage />
        </PublicLayout>
      </Route>
      <Route path="/about">
        <PublicLayout>
          <AboutPage />
        </PublicLayout>
      </Route>
      <Route path="/contact">
        <PublicLayout>
          <ContactPage />
        </PublicLayout>
      </Route>
      <Route path="/news">
        <PublicLayout>
          <NewsPage />
        </PublicLayout>
      </Route>
      <Route path="/news/:slug">
        <PublicLayout>
          <NewsPage />
        </PublicLayout>
      </Route>
      <Route path="/press">
        <PublicLayout>
          <PressPage />
        </PublicLayout>
      </Route>

      {/* Admin Login Route */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* Protected Admin Routes */}
      <Route path="/admin">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/releases">
        <ProtectedRoute>
          <AdminReleases />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/releases/:id">
        <ProtectedRoute>
          <AdminReleases />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/events">
        <ProtectedRoute>
          <AdminEvents />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/events/:id">
        <ProtectedRoute>
          <AdminEvents />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/posts">
        <ProtectedRoute>
          <AdminPosts />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/posts/:id">
        <ProtectedRoute>
          <AdminPosts />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/contacts">
        <ProtectedRoute>
          <AdminContacts />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute>
          <AdminSettings />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/videos">
        <ProtectedRoute>
          <AdminVideos />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/playlists">
        <ProtectedRoute>
          <AdminPlaylists />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/radio">
        <ProtectedRoute>
          <AdminRadioShows />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/artists">
        <ProtectedRoute>
          <AdminArtists />
        </ProtectedRoute>
      </Route>

      {/* 404 */}
      <Route>
        <PublicLayout>
          <NotFound />
        </PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="grouptherapy-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RadioProvider>
            <TooltipProvider>
              <PerformanceMonitor />
              <Router />
              <Toaster />
            </TooltipProvider>
          </RadioProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
