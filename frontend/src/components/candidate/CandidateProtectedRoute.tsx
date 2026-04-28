import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCandidateAuth } from "@/contexts/CandidateAuthContext";

export default function CandidateProtectedRoute() {
  const { candidate, token, isLoading } = useCandidateAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!candidate || !token) {
    return <Navigate to="/candidato/login" replace />;
  }

  return <Outlet />;
}
