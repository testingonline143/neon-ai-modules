import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";

function AppRoutes() {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#00FFD1] text-xl">Loading...</div>
      </div>
    );
  }
  
  return currentUser ? <Dashboard /> : <Index />;
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
