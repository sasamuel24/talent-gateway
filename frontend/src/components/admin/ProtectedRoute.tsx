import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Wraps private admin routes.
 *
 * - While the auth state is being restored from localStorage → full-screen spinner
 * - No authenticated user → redirect to /admin/login
 * - Authenticated → render child routes via <Outlet />
 */
export default function ProtectedRoute() {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-muted/30"
        aria-label="Cargando…"
        role="status"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
