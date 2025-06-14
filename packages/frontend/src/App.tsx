import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import MobileNavigation from "@/components/Layout/MobileNavigation";
import LoadingSpinner from "@/components/LoadingSpinner";

// Auth pages
import Login from "@/pages/Login";
import AdminLogin from "@/pages/AdminLogin";
import Register from "@/pages/Register";

// User pages
import UserDashboard from "@/pages/UserDashboard";
import ReportForm from "@/pages/ReportForm";
import TitheCalculator from "@/pages/TitheCalculator";
import ReportHistory from "@/pages/ReportHistory";

// Admin pages
import AdminDashboard from "@/pages/AdminDashboard";
import AdminReports from "@/pages/AdminReports";
import AdminUsers from "@/pages/AdminUsers";
import AdminStatistics from "@/pages/AdminStatistics";
import Notifications from "@/pages/Notifications";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner text="Verificando autenticación..." />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 pb-16 md:pb-0">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/register" element={<Register />} />

      {/* User routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/report" element={
        <ProtectedRoute>
          <ReportForm />
        </ProtectedRoute>
      } />
      <Route path="/calculator" element={
        <ProtectedRoute>
          <TitheCalculator />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute>
          <ReportHistory />
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute requireAdmin>
          <AdminReports />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requireAdmin>
          <AdminUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/statistics" element={
        <ProtectedRoute requireAdmin>
          <AdminStatistics />
        </ProtectedRoute>
      } />
      <Route path="/admin/notifications" element={
        <ProtectedRoute requireAdmin>
          <Notifications />
        </ProtectedRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
