import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  Bot,
  TrendingUp,
  ArrowRight,
  Eye,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiGet } from "@/lib/api";
import { useConvocatorias } from "@/hooks/useConvocatorias";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  total_jobs_activas: number;
  total_candidatos: number;
  total_aplicaciones: number;
  aplicaciones_hoy: number;
  tasa_aprobacion: number;
  candidatos_por_estado: Record<string, number>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  activa: "bg-green-100 text-green-700 border-green-200",
  borrador: "bg-yellow-100 text-yellow-700 border-yellow-200",
  cerrada: "bg-gray-100 text-gray-600 border-gray-200",
};

const STATUS_LABELS: Record<string, string> = {
  activa: "Activa",
  borrador: "Borrador",
  cerrada: "Cerrada",
};

const ESTADO_CONFIG = [
  { key: "nuevo",      label: "Nuevo",      color: "#94a3b8" },
  { key: "revisado",   label: "Revisado",   color: "#2CB6B8" },
  { key: "entrevista", label: "Entrevista", color: "#C6A46E" },
  { key: "aprobado",   label: "Aprobado",   color: "#22c55e" },
  { key: "rechazado",  label: "Rechazado",  color: "#ef4444" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { data: stats, isLoading: loadingStats } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: () => apiGet<DashboardStats>("/api/v1/dashboard/stats"),
  });

  const { data: jobs, isLoading: loadingJobs } = useConvocatorias({ limit: 5 });

  const chartData = ESTADO_CONFIG.map(({ key, label, color }) => ({
    estado: label,
    count: stats?.candidatos_por_estado?.[key] ?? 0,
    color,
  }));

  const isLoading = loadingStats || loadingJobs;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Resumen de actividad del portal de talento
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Vacantes activas
                      </p>
                      <p className="text-3xl font-heading font-bold text-foreground mt-1">
                        {stats?.total_jobs_activas ?? 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        convocatorias en curso
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Total candidatos
                      </p>
                      <p className="text-3xl font-heading font-bold text-foreground mt-1">
                        {stats?.total_candidatos ?? 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        registrados en el portal
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Aplicaciones hoy
                      </p>
                      <p className="text-3xl font-heading font-bold text-foreground mt-1">
                        {stats?.aplicaciones_hoy ?? 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stats?.total_aplicaciones ?? 0} total acumuladas
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Tasa de aprobación
                      </p>
                      <p className="text-3xl font-heading font-bold text-foreground mt-1">
                        {stats?.tasa_aprobacion ?? 0}%
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">candidatos aprobados</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" style={{ color: "#C6A46E" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts & Tables row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Candidates by status chart */}
              <Card className="xl:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-heading">
                    Candidatos por estado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="estado"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" name="Candidatos" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent jobs table */}
              <Card className="xl:col-span-2">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-heading">
                    Convocatorias recientes
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/convocatorias" className="flex items-center gap-1 text-primary">
                      Ver todas
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  {!jobs || jobs.length === 0 ? (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                      No hay convocatorias registradas aún.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cargo</TableHead>
                          <TableHead className="hidden sm:table-cell">Área</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Candidatos</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell>
                              <p className="font-medium text-sm">{job.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {job.date_posted
                                  ? new Date(job.date_posted).toLocaleDateString("es-CO")
                                  : "—"}
                              </p>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                              {job.area_catalog?.name ?? job.area ?? "—"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={STATUS_COLORS[job.status] ?? ""}
                              >
                                {STATUS_LABELS[job.status] ?? job.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Users className="w-3 h-3 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {job.candidates_count ?? 0}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Eye icon for views hint */}
        <div className="hidden">
          <Eye />
        </div>
      </div>
    </AdminLayout>
  );
}
