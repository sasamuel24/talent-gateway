import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Index from "./pages/Index.tsx";
import JobDetail from "./pages/JobDetail.tsx";
import Apply from "./pages/Apply.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminConvocatorias from "./pages/admin/AdminConvocatorias";
import AdminConvocatoriaForm from "./pages/admin/AdminConvocatoriaForm";
import AdminCandidatos from "./pages/admin/AdminCandidatos";
import AdminIA from "./pages/admin/AdminIA";
import AdminCatalogos from "@/pages/admin/AdminCatalogos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/*
          AuthProvider is placed inside BrowserRouter so it can use
          useNavigate() internally (required for the logout redirect).
        */}
        <AuthProvider>
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/" element={<Index />} />
            <Route path="/vacante/:id" element={<JobDetail />} />
            <Route path="/vacante/:id/aplicar" element={<Apply />} />

            {/* ── Admin login (public) ── */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ── Protected admin routes ── */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/convocatorias" element={<AdminConvocatorias />} />
              <Route path="/admin/convocatorias/nueva" element={<AdminConvocatoriaForm />} />
              <Route path="/admin/convocatorias/:id/editar" element={<AdminConvocatoriaForm />} />
              <Route path="/admin/candidatos" element={<AdminCandidatos />} />
              <Route path="/admin/ia" element={<AdminIA />} />
              <Route path="/admin/catalogos" element={<AdminCatalogos />} />
            </Route>

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
