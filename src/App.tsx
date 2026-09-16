import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SiteSettingsProvider, useSiteSettings } from "@/hooks/useSiteSettings";
import SplashScreen from "@/components/SplashScreen";
import TechBlogPage from './pages/TechBlogPage';
import TechBlogSectionPage from './pages/TechBlogSectionPage';
import TechBlogPostPage from './pages/TechBlogPostPage';
import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";
import AboutPage from "@/pages/AboutPage";
import BookingPage from "@/pages/BookingPage";
import ContactPage from "@/pages/ContactPage";
import AssistantPage from "@/pages/AssistantPage";
import ServicePage from "@/pages/ServicePage";
import PortfolioPage from "@/pages/PortfolioPage";
import PortfolioDetailPage from "@/pages/PortfolioDetailPage";
import AdminDashboard from "@/pages/AdminDashboard";
import ProfilePage from "@/pages/ProfilePage";
import MessagesPage from "@/pages/MessagesPage";
import PackagesPage from "@/pages/PackagesPage";
import AppsStorePage from "@/pages/AppsStorePage";
import AppDetailPage from "@/pages/AppDetailPage";
import LiveStreamPage from "@/pages/LiveStreamPage";
import WifiNetworksPage from "@/pages/WifiNetworksPage";
import WifiSystemPage from "@/pages/WifiSystemPage";
import WifiPurchasePage from "@/pages/WifiPurchasePage";
import AIToolsPage from "@/pages/AIToolsPage";
import GuestBlockedPage from "@/pages/GuestBlockedPage";
import NotFound from "./pages/NotFound";
import { GuestActionProvider } from "@/contexts/GuestActionContext";
import { pageKeyFor } from "@/lib/guestAccess";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

/** Route available to registered members only — guests see a registration invite. */
/** Route open to guests too — content is visible, service actions ask for registration. */
const MemberRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

/** Route requiring a real account (personal areas) — guests get the invite page. */
/** بوابة محتوى الزائر — يتحكم بها المدير من قسم "التحكم بمحتوى المنصة" */
const GuestPageRoute: React.FC<{ pageKey: string; children: React.ReactNode }> = ({ pageKey, children }) => {
  const { isAuthenticated, isGuest } = useAuth();
  const { getBool, getSetting } = useSiteSettings();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!isGuest) return <>{children}</>;
  if (!getBool('guest_mode_enabled')) return <Navigate to="/auth" replace />;
  if (getBool('guest_full_access')) return <>{children}</>;
  if (getSetting(pageKeyFor(pageKey)) === 'true') return <>{children}</>;
  return <GuestBlockedPage />;
};

const AccountRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isGuest } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (isGuest) return <GuestBlockedPage />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const hasAccount = !!user;
  const { isLoading: settingsLoading, getBool } = useSiteSettings();

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (showSplash && getBool('splash_enabled')) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <GuestActionProvider>
    <Routes>
      <Route path="/auth" element={hasAccount ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/" element={<GuestPageRoute pageKey="home"><HomePage /></GuestPageRoute>} />
      <Route path="/about" element={<GuestPageRoute pageKey="about"><AboutPage /></GuestPageRoute>} />
      <Route path="/booking" element={<GuestPageRoute pageKey="booking"><BookingPage /></GuestPageRoute>} />
      <Route path="/contact" element={<GuestPageRoute pageKey="contact"><ContactPage /></GuestPageRoute>} />
      <Route path="/assistant" element={<GuestPageRoute pageKey="assistant"><AssistantPage /></GuestPageRoute>} />
      <Route path="/services/:serviceId" element={<GuestPageRoute pageKey="services"><ServicePage /></GuestPageRoute>} />
      <Route path="/portfolio" element={<GuestPageRoute pageKey="portfolio"><PortfolioPage /></GuestPageRoute>} />
      <Route path="/portfolio/:itemId" element={<GuestPageRoute pageKey="portfolio"><PortfolioDetailPage /></GuestPageRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<AccountRoute><ProfilePage /></AccountRoute>} />
      <Route path="/messages" element={<AccountRoute><MessagesPage /></AccountRoute>} />
      <Route path="/packages" element={<GuestPageRoute pageKey="packages"><PackagesPage /></GuestPageRoute>} />
      <Route path="/apps-store" element={<GuestPageRoute pageKey="apps"><AppsStorePage /></GuestPageRoute>} />
      <Route path="/apps-store/:appId" element={<GuestPageRoute pageKey="apps"><AppDetailPage /></GuestPageRoute>} />
      <Route path="/live-stream" element={<GuestPageRoute pageKey="livestream"><LiveStreamPage /></GuestPageRoute>} />
      <Route path="/wifi-networks" element={<GuestPageRoute pageKey="wifi"><WifiNetworksPage /></GuestPageRoute>} />
      <Route path="/wifi-networks/:productId" element={<GuestPageRoute pageKey="wifi"><WifiSystemPage /></GuestPageRoute>} />
      <Route path="/wifi-networks/:productId/purchase" element={<GuestPageRoute pageKey="wifi"><WifiPurchasePage /></GuestPageRoute>} />
      <Route path="/ai-tools" element={<GuestPageRoute pageKey="ai_tools"><AIToolsPage /></GuestPageRoute>} />
      <Route path="/tech-blog" element={<GuestPageRoute pageKey="tech_blog"><TechBlogPage /></GuestPageRoute>} />
      <Route path="/tech-blog/post/:id" element={<GuestPageRoute pageKey="tech_blog"><TechBlogPostPage /></GuestPageRoute>} />
      <Route path="/tech-blog/:slug" element={<GuestPageRoute pageKey="tech_blog"><TechBlogSectionPage /></GuestPageRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </GuestActionProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <SiteSettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
