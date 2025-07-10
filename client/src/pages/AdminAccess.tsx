
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function AdminAccess() {
  const [, navigate] = useLocation();
  const { currentUser } = useAuth();

  const handleAdminAccess = () => {
    // In a real app, you'd check if the user has admin privileges
    // For now, we'll allow any logged-in user to access admin
    if (currentUser) {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <Card className="bg-gray-900 border-gray-800 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Access the admin dashboard to manage content and users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleAdminAccess}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            disabled={!currentUser}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Enter Admin Dashboard
          </Button>
          {!currentUser && (
            <p className="text-sm text-gray-400 text-center">
              You must be logged in to access the admin dashboard
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
