import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAccess from "./pages/AdminAccess";
import ModuleView from "./pages/ModuleView";
import LessonView from "./pages/LessonView";
import NotFound from "./pages/NotFound";
import { Switch, Route, Redirect } from "wouter";

function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#00FFD1] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/">
        {currentUser ? <Redirect to="/dashboard" /> : <Index />}
      </Route>
      <Route path="/dashboard">
        {currentUser ? <Dashboard /> : <Redirect to="/" />}
      </Route>
      <Route path="/admin-access">
        <AdminAccess />
      </Route>
      <Route path="/admin">
        {currentUser ? <AdminDashboard /> : <Redirect to="/" />}
      </Route>
      <Route path="/module/:id">
        {currentUser ? <ModuleView /> : <Redirect to="/" />}
      </Route>
      <Route path="/lesson/:id">
        {currentUser ? <LessonView /> : <Redirect to="/" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;