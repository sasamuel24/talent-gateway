import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Eye,
  CalendarCheck,
  SlidersHorizontal,
  FileDown,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Globe,
  FileText,
  Loader2,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  useAplicaciones,
  useUpdateDecision,
  useUpdateNotes,
} from "@/hooks/useCandidatos";
import type { ApplicationFull } from "@/hooks/useCandidatos";

// ─── Constants ────────────────────────────────────────────────────────────────

const NIVEL_COLOR: Record<string, string> = {
  "Básico": "bg-gray-100 text-gray-600",
  "Intermedio": "bg-blue-100 text-blue-700",
  "Avanzado": "bg-green-100 text-green-700",
  "Nativo / Bilingüe": "bg-primary/10 text-primary",
};

type AIDecision = ApplicationFull["ai_decision"];
type HumanDecision = ApplicationFull["human_decision"];

const aiDecisionColors: Record<AIDecision, string> = {
  aprobado: "bg-green-100 text-green-700 border-green-200",
  rechazado: "bg-red-100 text-red-700 border-red-200",
  pendiente: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const humanStatusColors: Record<HumanDecision, string> = {
  nuevo: "bg-gray-100 text-gray-600 border-gray-200",
  revisado: "bg-blue-100 text-blue-700 border-blue-200",
  entrevista: "bg-purple-100 text-purple-700 border-purple-200",
  aprobado: "bg-green-100 text-green-700 border-green-200",
  rechazado: "bg-red-100 text-red-700 border-red-200",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 76
      ? "bg-green-500"
      : score >= 51
      ? "bg-yellow-500"
      : "bg-red-500";
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums w-6 text-right">
        {score}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminCandidatos() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState(searchParams.get("job") ?? "todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [minScore, setMinScore] = useState(0);
  const [selectedCandidate, setSelectedCandidate] =
    useState<ApplicationFull | null>(null);
  const [noteText, setNoteText] = useState("");

  const { data, isLoading, isError } = useAplicaciones();
  const updateDecision = useUpdateDecision();
  const updateNotes = useUpdateNotes();

  useEffect(() => {
    const jobParam = searchParams.get("job");
    if (jobParam) setJobFilter(jobParam);
  }, [searchParams]);

  // Build unique job list from applications data
  const uniqueJobs = (() => {
    if (!data) return [];
    const seen = new Set<string>();
    return data.reduce<ApplicationFull["job"][]>((acc, app) => {
      if (app.job && !seen.has(app.job.id)) {
        seen.add(app.job.id);
        acc.push(app.job);
      }
      return acc;
    }, []);
  })();

  const filtered = (data ?? []).filter((app) => {
    if (!app.candidate || !app.job) return false;
    const name = app.candidate.name.toLowerCase();
    const email = app.candidate.email.toLowerCase();
    const term = search.toLowerCase();
    const matchSearch = name.includes(term) || email.includes(term);
    const matchJob = jobFilter === "todos" || app.job.id === jobFilter;
    const matchStatus =
      statusFilter === "todos" || app.human_decision === statusFilter;
    const score = app.ai_score ?? 0;
    const matchScore = score >= minScore;
    return matchSearch && matchJob && matchStatus && matchScore;
  });

  const updateHumanDecision = (id: string, decision: HumanDecision) => {
    updateDecision.mutate(
      { id, human_decision: decision },
      {
        onSuccess: (updated) => {
          toast({
            title: "Estado actualizado",
            description: `El candidato fue marcado como "${decision}".`,
          });
          if (selectedCandidate?.id === id) {
            setSelectedCandidate((prev) =>
              prev ? { ...prev, human_decision: decision } : null
            );
          }
          return updated;
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo actualizar el estado.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const saveNote = (id: string) => {
    updateNotes.mutate(
      { id, notes: noteText },
      {
        onSuccess: () => {
          toast({ title: "Nota guardada" });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo guardar la nota.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-bold">Candidatos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} candidato{filtered.length !== 1 ? "s" : ""} encontrado
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Loading / Error states */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {isError && (
          <Alert variant="destructive">
            <AlertDescription>
              No se pudieron cargar los candidatos. Verifica tu conexión o intenta más tarde.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && (
          <>
            {/* Filters */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o email..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={jobFilter} onValueChange={setJobFilter}>
                  <SelectTrigger className="w-full sm:w-56">
                    <SelectValue placeholder="Vacante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las vacantes</SelectItem>
                    {uniqueJobs.map((j) => (
                      <SelectItem key={j.id} value={j.id}>
                        {j.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="nuevo">Nuevo</SelectItem>
                    <SelectItem value="revisado">Revisado</SelectItem>
                    <SelectItem value="entrevista">Entrevista</SelectItem>
                    <SelectItem value="aprobado">Aprobado</SelectItem>
                    <SelectItem value="rechazado">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3 bg-muted/40 rounded-lg px-4 py-2.5">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground shrink-0">
                  Score mínimo IA:
                </span>
                <Slider
                  value={[minScore]}
                  onValueChange={([v]) => setMinScore(v)}
                  min={0}
                  max={100}
                  step={5}
                  className="flex-1 max-w-48"
                />
                <span className="text-sm font-medium w-8 tabular-nums">
                  {minScore}
                </span>
              </div>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Users className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <h3 className="font-heading font-semibold">Sin resultados</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  No se encontraron candidatos con los filtros aplicados.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidato</TableHead>
                      <TableHead className="hidden lg:table-cell">Vacante</TableHead>
                      <TableHead>Score IA</TableHead>
                      <TableHead className="hidden sm:table-cell">Decisión IA</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="hidden md:table-cell">Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((app) => {
                      const score = app.ai_score ?? 0;
                      return (
                        <TableRow key={app.id}>
                          <TableCell>
                            <p className="font-medium text-sm">{app.candidate.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {app.candidate.email}
                            </p>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[180px]">
                            <p className="truncate">{app.job.title}</p>
                          </TableCell>
                          <TableCell>
                            <ScoreBar score={score} />
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge
                              variant="outline"
                              className={aiDecisionColors[app.ai_decision]}
                            >
                              {app.ai_decision}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={humanStatusColors[app.human_decision]}
                            >
                              {app.human_decision}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                            {app.applied_date
                              ? new Date(app.applied_date).toLocaleDateString("es-CO")
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Ver perfil"
                                onClick={() => {
                                  setSelectedCandidate(app);
                                  setNoteText(app.notes ?? "");
                                }}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-600 hover:text-green-700"
                                title="Aprobar"
                                onClick={() => updateHumanDecision(app.id, "aprobado")}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700"
                                title="Rechazar"
                                onClick={() => updateHumanDecision(app.id, "rechazado")}
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-purple-600 hover:text-purple-700"
                                title="Marcar para entrevista"
                                onClick={() => updateHumanDecision(app.id, "entrevista")}
                              >
                                <CalendarCheck className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Candidate Detail Sheet */}
      <Sheet
        open={!!selectedCandidate}
        onOpenChange={(open) => !open && setSelectedCandidate(null)}
      >
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
          {selectedCandidate && (
            <>
              {/* Sticky header */}
              <div className="sticky top-0 z-10 bg-white border-b border-border px-6 pt-6 pb-4">
                <SheetHeader>
                  <SheetTitle className="font-heading text-lg leading-tight">
                    {selectedCandidate.candidate.name}
                  </SheetTitle>
                  <SheetDescription className="text-xs">
                    {selectedCandidate.candidate.email}
                  </SheetDescription>
                </SheetHeader>

                {/* Score + AI decision mini cards */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Score IA</p>
                    <p className="text-2xl font-heading font-bold">
                      {selectedCandidate.ai_score ?? "--"}
                    </p>
                    <Progress
                      value={selectedCandidate.ai_score ?? 0}
                      className="h-1.5 mt-1"
                    />
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Decisión IA</p>
                    <Badge
                      variant="outline"
                      className={aiDecisionColors[selectedCandidate.ai_decision]}
                    >
                      {selectedCandidate.ai_decision}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">Estado actual:</p>
                    <Badge
                      variant="outline"
                      className={`mt-0.5 ${humanStatusColors[selectedCandidate.human_decision]}`}
                    >
                      {selectedCandidate.human_decision}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="resumen" className="px-6 pt-4 pb-8">
                <TabsList className="w-full mb-5">
                  <TabsTrigger value="resumen" className="flex-1 text-xs">Resumen</TabsTrigger>
                  <TabsTrigger value="aplicacion" className="flex-1 text-xs">Aplicación</TabsTrigger>
                  <TabsTrigger value="cv" className="flex-1 text-xs">Hoja de Vida</TabsTrigger>
                </TabsList>

                {/* ── Tab 1: Resumen ─────────────────────────────────────────── */}
                <TabsContent value="resumen" className="space-y-5 mt-0">
                  {/* Contact info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Teléfono</span>
                      <span>{selectedCandidate.candidate.phone ?? "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ubicación</span>
                      <span>{selectedCandidate.candidate.location ?? "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Experiencia</span>
                      <span>
                        {selectedCandidate.candidate.experience.length === 0
                          ? "Sin experiencia"
                          : `${selectedCandidate.candidate.experience.length} entrada(s)`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Educación</span>
                      <span className="text-right max-w-[220px]">
                        {selectedCandidate.candidate.education[0]?.degree ?? "No especificado"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vacante</span>
                      <span className="text-right max-w-[220px] truncate">
                        {selectedCandidate.job.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aplicó</span>
                      <span>
                        {selectedCandidate.applied_date
                          ? new Date(selectedCandidate.applied_date).toLocaleDateString("es-CO")
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* AI Justification */}
                  {selectedCandidate.ai_justificacion && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                        Análisis IA
                      </p>
                      <div className="bg-muted/40 rounded-lg p-3 text-sm text-muted-foreground leading-relaxed border border-border">
                        {selectedCandidate.ai_justificacion}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Notes */}
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Notas del reclutador
                    </p>
                    <textarea
                      className="w-full text-sm border border-input rounded-md p-2.5 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                      placeholder="Escribe tus observaciones sobre este candidato..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => saveNote(selectedCandidate.id)}
                      disabled={updateNotes.isPending}
                    >
                      {updateNotes.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                      ) : null}
                      Guardar nota
                    </Button>
                  </div>

                  <Separator />

                  {/* Status actions */}
                  <div>
                    <p className="text-sm font-medium mb-2">Cambiar estado</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50"
                        onClick={() => updateHumanDecision(selectedCandidate.id, "aprobado")}
                        disabled={updateDecision.isPending}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => updateHumanDecision(selectedCandidate.id, "rechazado")}
                        disabled={updateDecision.isPending}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Rechazar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                        onClick={() => updateHumanDecision(selectedCandidate.id, "entrevista")}
                        disabled={updateDecision.isPending}
                      >
                        <CalendarCheck className="w-3.5 h-3.5 mr-1" /> Entrevista
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => updateHumanDecision(selectedCandidate.id, "revisado")}
                        disabled={updateDecision.isPending}
                      >
                        <Clock className="w-3.5 h-3.5 mr-1" /> Revisado
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* ── Tab 2: Aplicación detallada ────────────────────────────── */}
                <TabsContent value="aplicacion" className="space-y-6 mt-0">

                  {/* Experience */}
                  {selectedCandidate.candidate.experience.length > 0 && (
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1.5 mb-3">
                        <Briefcase className="w-3.5 h-3.5 text-primary" />
                        Experiencia laboral
                      </p>
                      <div className="space-y-3">
                        {selectedCandidate.candidate.experience.map((exp) => (
                          <div
                            key={exp.id}
                            className="border border-border rounded-lg p-3 bg-white"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-sm font-semibold text-foreground leading-snug">
                                {exp.position}
                              </p>
                            </div>
                            <p className="text-xs text-primary font-medium mb-1">{exp.company}</p>
                            <p className="text-xs text-muted-foreground mb-2">
                              {exp.start_date ?? "—"}
                              {exp.end_date ? ` → ${exp.end_date}` : " → Actualidad"}
                            </p>
                            {exp.details && (
                              <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-2 mt-2">
                                {exp.details}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {selectedCandidate.candidate.education.length > 0 && (
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1.5 mb-3">
                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                        Educación
                      </p>
                      <div className="space-y-3">
                        {selectedCandidate.candidate.education.map((edu) => (
                          <div
                            key={edu.id}
                            className="border border-border rounded-lg p-3 bg-white"
                          >
                            <p className="text-sm font-semibold text-foreground">
                              {edu.field_of_study ?? "—"}
                            </p>
                            <p className="text-xs text-primary font-medium mt-0.5">
                              {edu.institution ?? "—"}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              {edu.degree && (
                                <Badge variant="outline" className="text-xs px-2 py-0">
                                  {edu.degree}
                                </Badge>
                              )}
                              {edu.graduation_date && (
                                <span className="text-xs text-muted-foreground">
                                  Titulación: {edu.graduation_date}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {selectedCandidate.candidate.languages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1.5 mb-3">
                        <Globe className="w-3.5 h-3.5 text-primary" />
                        Idiomas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.candidate.languages.map((lang) => (
                          <div
                            key={lang.id}
                            className="flex items-center gap-1.5 border border-border rounded-full px-3 py-1.5 bg-white text-xs"
                          >
                            <span className="font-medium text-foreground">{lang.language}</span>
                            <span className="text-muted-foreground">·</span>
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-xs ${
                                NIVEL_COLOR[lang.level] ?? "bg-muted text-muted-foreground"
                              }`}
                            >
                              {lang.level}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state */}
                  {selectedCandidate.candidate.experience.length === 0 &&
                    selectedCandidate.candidate.education.length === 0 &&
                    selectedCandidate.candidate.languages.length === 0 && (
                      <div className="text-center py-10 text-muted-foreground">
                        <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-sm">No hay datos adicionales de la aplicación.</p>
                      </div>
                    )}
                </TabsContent>

                {/* ── Tab 3: Hoja de Vida ─────────────────────────────────────── */}
                <TabsContent value="cv" className="mt-0">
                  {selectedCandidate.candidate.cv_url ? (
                    <div className="space-y-4">
                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={selectedCandidate.candidate.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Abrir en nueva pestaña
                        </a>
                        <a
                          href={selectedCandidate.candidate.cv_url}
                          download
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border text-foreground text-xs font-medium hover:border-primary hover:text-primary transition-colors"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          Descargar CV
                        </a>
                      </div>

                      {/* Inline PDF preview */}
                      <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/60">
                          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground font-medium truncate">
                            CV – {selectedCandidate.candidate.name}
                          </span>
                        </div>
                        <iframe
                          src={selectedCandidate.candidate.cv_url}
                          title={`CV de ${selectedCandidate.candidate.name}`}
                          className="w-full"
                          style={{ height: "520px", border: "none" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                      <div className="w-16 h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center mb-4">
                        <FileText className="w-7 h-7 text-muted-foreground/40" />
                      </div>
                      <p className="text-sm font-medium">Sin hoja de vida adjunta</p>
                      <p className="text-xs mt-1">El candidato no subió un archivo CV.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
