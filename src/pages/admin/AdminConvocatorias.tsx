import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Users,
  Eye,
  Pencil,
  MoreHorizontal,
  Briefcase,
  Copy,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminJobs as initialJobs } from "@/data/adminData";
import type { AdminJob, JobStatus } from "@/data/adminData";

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

const areas = [
  "Todas",
  "Tiendas",
  "Producción",
  "Logística",
  "Marketing",
  "Administración",
  "Recursos Humanos",
];

export default function AdminConvocatorias() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<AdminJob[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [areaFilter, setAreaFilter] = useState("Todas");

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.refId.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "todas" || j.status === statusFilter;
    const matchArea = areaFilter === "Todas" || j.area === areaFilter;
    return matchSearch && matchStatus && matchArea;
  });

  const toggleStatus = (id: number, current: JobStatus) => {
    const next: JobStatus = current === "activa" ? "cerrada" : "activa";
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: next } : j))
    );
    toast({
      title: `Convocatoria ${next === "activa" ? "activada" : "cerrada"}`,
      description: `La vacante fue ${next === "activa" ? "publicada" : "cerrada"} exitosamente.`,
    });
  };

  const duplicateJob = (job: AdminJob) => {
    const newJob: AdminJob = {
      ...job,
      id: Date.now(),
      title: `${job.title} (copia)`,
      status: "borrador",
      candidatesCount: 0,
      views: 0,
      refId: `req${Date.now().toString().slice(-5)}`,
    };
    setJobs((prev) => [newJob, ...prev]);
    toast({
      title: "Convocatoria duplicada",
      description: "Se creó una copia como borrador.",
    });
  };

  const deleteJob = (id: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast({
      title: "Convocatoria eliminada",
      description: "La vacante fue eliminada del sistema.",
      variant: "destructive",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Convocatorias</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {jobs.filter((j) => j.status === "activa").length} activas ·{" "}
              {jobs.filter((j) => j.status === "borrador").length} borradores ·{" "}
              {jobs.filter((j) => j.status === "cerrada").length} cerradas
            </p>
          </div>
          <Button onClick={() => navigate("/admin/convocatorias/nueva")}>
            <Plus className="w-4 h-4 mr-1" />
            Nueva convocatoria
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cargo o referencia..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todos los estados</SelectItem>
              <SelectItem value="activa">Activa</SelectItem>
              <SelectItem value="borrador">Borrador</SelectItem>
              <SelectItem value="cerrada">Cerrada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <h3 className="font-heading font-semibold text-foreground">
              Sin resultados
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              No se encontraron convocatorias con los filtros aplicados.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setStatusFilter("todas");
                setAreaFilter("Todas");
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="hidden lg:table-cell">Área</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> Candidatos
                    </div>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Vistas
                    </div>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.refId}
                      </p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      <div>
                        <p>{job.area}</p>
                        <p className="text-xs">{job.department}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[job.status]}
                      >
                        {statusLabels[job.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium">
                          {job.candidatesCount}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{job.views}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {job.date}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Ver candidatos"
                          onClick={() =>
                            navigate(`/admin/candidatos?job=${job.id}`)
                          }
                        >
                          <Users className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Editar"
                          onClick={() =>
                            navigate(`/admin/convocatorias/${job.id}/editar`)
                          }
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                toggleStatus(job.id, job.status)
                              }
                            >
                              {job.status === "activa" ? (
                                <>
                                  <XCircle className="w-4 h-4 mr-2 text-muted-foreground" />
                                  Cerrar convocatoria
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                  Activar convocatoria
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => duplicateJob(job)}>
                              <Copy className="w-4 h-4 mr-2 text-muted-foreground" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deleteJob(job.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
