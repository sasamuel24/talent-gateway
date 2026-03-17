import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import JobDetail from "./pages/JobDetail.tsx";
import Apply from "./pages/Apply.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminConvocatorias from "./pages/admin/AdminConvocatorias";
import AdminConvocatoriaForm from "./pages/admin/AdminConvocatoriaForm";
import AdminCandidatos from "./pages/admin/AdminCandidatos";
import AdminIA from "./pages/admin/AdminIA";
import AdminConfiguracion from "./pages/admin/AdminConfiguracion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vacante/:id" element={<JobDetail />} />
          <Route path="/vacante/:id/aplicar" element={<Apply />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/convocatorias" element={<AdminConvocatorias />} />
          <Route path="/admin/convocatorias/nueva" element={<AdminConvocatoriaForm />} />
          <Route path="/admin/convocatorias/:id/editar" element={<AdminConvocatoriaForm />} />
          <Route path="/admin/candidatos" element={<AdminCandidatos />} />
          <Route path="/admin/ia" element={<AdminIA />} />
          <Route path="/admin/configuracion" element={<AdminConfiguracion />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
