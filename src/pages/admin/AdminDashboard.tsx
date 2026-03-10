import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  Bot,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import AdminLayout from "@/components/admin/AdminLayout";
import { adminJobs, candidates, aiMetrics } from "@/data/adminData";
import type { JobStatus, CandidateStatus } from "@/data/adminData";

const statusColors: Record<JobStatus, string> = {
  activa: "bg-green-100 text-green-700 border-green-200",
  borrador: "bg-yellow-100 text-yellow-700 border-yellow-200",
  cerrada: "bg-gray-100 text-gray-600 border-gray-200",
};

const statusLabels: Record<JobStatus, string> = {
  activa: "Activa",
  borrador: "Borrador",
  cerrada: "Cerrada",
};

const candidateStatusCounts = candidates.reduce(
  (acc, c) => {
    acc[c.humanDecision] = (acc[c.humanDecision] || 0) + 1;
    return acc;
  },
  {} as Record<CandidateStatus, number>
);

const chartData = [
  { estado: "Nuevo", count: candidateStatusCounts.nuevo || 0, color: "#94a3b8" },
  { estado: "Revisado", count: candidateStatusCounts.revisado || 0, color: "#2CB6B8" },
  { estado: "Entrevista", count: candidateStatusCounts.entrevista || 0, color: "#C6A46E" },
  { estado: "Aprobado", count: candidateStatusCounts.aprobado || 0, color: "#22c55e" },
  { estado: "Rechazado", count: candidateStatusCounts.rechazado || 0, color: "#ef4444" },
];

const recentJobs = adminJobs.slice(0, 5);

const activeJobs = adminJobs.filter((j) => j.status === "activa").length;
const thisMonthCandidates = candidates.filter((c) =>
  c.appliedDate.includes("03/2026")
).length;
const aiProcessed = candidates.filter(
  (c) => c.aiDecision !== "pendiente"
).length;
const aiProcessedPct = Math.round((aiProcessed / candidates.length) * 100);

const lastDecisions = candidates
  .filter((c) => c.aiDecision !== "pendiente")
  .slice(0, 5);

function AIDecisionIcon({ decision }: { decision: string }) {
  if (decision === "aprobado")
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (decision === "rechazado")
    return <XCircle className="w-4 h-4 text-red-500" />;
  return <Clock className="w-4 h-4 text-yellow-500" />;
}

export default function AdminDashboard() {
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
                    {activeJobs}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">+2 vs mes anterior</span>
                  </div>
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
                    Candidatos este mes
                  </p>
                  <p className="text-3xl font-heading font-bold text-foreground mt-1">
                    {thisMonthCandidates}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">+18% vs mes anterior</span>
                  </div>
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
                    Procesados por IA
                  </p>
                  <p className="text-3xl font-heading font-bold text-foreground mt-1">
                    {aiProcessedPct}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {aiProcessed} de {candidates.length} candidatos
                    </span>
                  </div>
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
                    Precisión del modelo
                  </p>
                  <p className="text-3xl font-heading font-bold text-foreground mt-1">
                    {aiMetrics.precision}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">+2.8% vs último entrenamiento</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent-foreground" style={{ color: "#C6A46E" }} />
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
                  {recentJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{job.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.date}
                        </p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {job.area}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColors[job.status]}
                        >
                          {statusLabels[job.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {job.candidatesCount}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* AI Last decisions */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-heading">
                IA — Últimas decisiones
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Decisiones recientes del motor de filtrado automático
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/ia" className="flex items-center gap-1 text-primary">
                Revisar todas
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead className="hidden md:table-cell">Vacante</TableHead>
                  <TableHead>Score IA</TableHead>
                  <TableHead>Decisión IA</TableHead>
                  <TableHead className="hidden sm:table-cell">Acción humana</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lastDecisions.map((candidate) => {
                  const job = adminJobs.find((j) => j.id === candidate.jobId);
                  return (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground hidden sm:block">
                          {candidate.email}
                        </p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {job?.title ?? "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[80px]">
                          <Progress
                            value={candidate.aiScore}
                            className="h-1.5 w-14"
                          />
                          <span className="text-xs font-medium tabular-nums">
                            {candidate.aiScore}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <AIDecisionIcon decision={candidate.aiDecision} />
                          <span className="text-xs capitalize">
                            {candidate.aiDecision}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className={
                            candidate.humanDecision === "aprobado"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : candidate.humanDecision === "rechazado"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : candidate.humanDecision === "entrevista"
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          }
                        >
                          {candidate.humanDecision}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Eye icon for views hint */}
        <div className="hidden">
          <Eye />
        </div>
      </div>
    </AdminLayout>
  );
}
