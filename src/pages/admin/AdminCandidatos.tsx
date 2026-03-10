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
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { candidates as initialCandidates, adminJobs } from "@/data/adminData";
import type { Candidate, CandidateStatus, AIDecision } from "@/data/adminData";

const aiDecisionColors: Record<AIDecision, string> = {
  aprobado: "bg-green-100 text-green-700 border-green-200",
  rechazado: "bg-red-100 text-red-700 border-red-200",
  pendiente: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const humanStatusColors: Record<CandidateStatus, string> = {
  nuevo: "bg-gray-100 text-gray-600 border-gray-200",
  revisado: "bg-blue-100 text-blue-700 border-blue-200",
  entrevista: "bg-purple-100 text-purple-700 border-purple-200",
  aprobado: "bg-green-100 text-green-700 border-green-200",
  rechazado: "bg-red-100 text-red-700 border-red-200",
};

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

export default function AdminCandidatos() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [candidates, setCandidates] =
    useState<Candidate[]>(initialCandidates);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState(searchParams.get("job") ?? "todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [minScore, setMinScore] = useState(0);
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    const jobParam = searchParams.get("job");
    if (jobParam) setJobFilter(jobParam);
  }, [searchParams]);

  const filtered = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchJob = jobFilter === "todos" || c.jobId === Number(jobFilter);
    const matchStatus =
      statusFilter === "todos" || c.humanDecision === statusFilter;
    const matchScore = c.aiScore >= minScore;
    return matchSearch && matchJob && matchStatus && matchScore;
  });

  const updateHumanDecision = (id: number, decision: CandidateStatus) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, humanDecision: decision } : c
      )
    );
    toast({
      title: "Estado actualizado",
      description: `El candidato fue marcado como "${decision}".`,
    });
    if (selectedCandidate?.id === id) {
      setSelectedCandidate((prev) =>
        prev ? { ...prev, humanDecision: decision } : null
      );
    }
  };

  const saveNote = (id: number) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, notes: noteText } : c))
    );
    toast({ title: "Nota guardada" });
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
                {adminJobs
                  .filter((j) => j.status === "activa")
                  .map((j) => (
                    <SelectItem key={j.id} value={String(j.id)}>
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
                {filtered.map((candidate) => {
                  const job = adminJobs.find((j) => j.id === candidate.jobId);
                  return (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {candidate.email}
                        </p>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[180px]">
                        <p className="truncate">{job?.title ?? "—"}</p>
                      </TableCell>
                      <TableCell>
                        <ScoreBar score={candidate.aiScore} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className={aiDecisionColors[candidate.aiDecision]}
                        >
                          {candidate.aiDecision}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={humanStatusColors[candidate.humanDecision]}
                        >
                          {candidate.humanDecision}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {candidate.appliedDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Ver perfil"
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setNoteText(candidate.notes ?? "");
                            }}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:text-green-700"
                            title="Aprobar"
                            onClick={() =>
                              updateHumanDecision(candidate.id, "aprobado")
                            }
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            title="Rechazar"
                            onClick={() =>
                              updateHumanDecision(candidate.id, "rechazado")
                            }
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-purple-600 hover:text-purple-700"
                            title="Marcar para entrevista"
                            onClick={() =>
                              updateHumanDecision(candidate.id, "entrevista")
                            }
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
      </div>

      {/* Candidate Detail Sheet */}
      <Sheet
        open={!!selectedCandidate}
        onOpenChange={(open) => !open && setSelectedCandidate(null)}
      >
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedCandidate && (
            <>
              <SheetHeader className="mb-4">
                <SheetTitle className="font-heading">
                  {selectedCandidate.name}
                </SheetTitle>
                <SheetDescription>{selectedCandidate.email}</SheetDescription>
              </SheetHeader>

              <div className="space-y-5">
                {/* Score & decisions */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Score IA
                    </p>
                    <p className="text-2xl font-heading font-bold">
                      {selectedCandidate.aiScore}
                    </p>
                    <Progress
                      value={selectedCandidate.aiScore}
                      className="h-1.5 mt-1"
                    />
                  </div>
                  <div className="bg-muted/40 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Decisión IA
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        aiDecisionColors[selectedCandidate.aiDecision]
                      }
                    >
                      {selectedCandidate.aiDecision}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Contact & info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Teléfono</span>
                    <span>{selectedCandidate.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ubicación</span>
                    <span>{selectedCandidate.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experiencia</span>
                    <span>
                      {selectedCandidate.experience === 0
                        ? "Sin experiencia"
                        : `${selectedCandidate.experience} años`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Educación</span>
                    <span className="text-right max-w-[200px]">
                      {selectedCandidate.education}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aplicó</span>
                    <span>{selectedCandidate.appliedDate}</span>
                  </div>
                </div>

                <Separator />

                {/* Skills */}
                <div>
                  <p className="text-sm font-medium mb-2">Habilidades</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

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
                  >
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
                      onClick={() =>
                        updateHumanDecision(selectedCandidate.id, "aprobado")
                      }
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() =>
                        updateHumanDecision(selectedCandidate.id, "rechazado")
                      }
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      Rechazar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      onClick={() =>
                        updateHumanDecision(selectedCandidate.id, "entrevista")
                      }
                    >
                      <CalendarCheck className="w-3.5 h-3.5 mr-1" />
                      Entrevista
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() =>
                        updateHumanDecision(selectedCandidate.id, "revisado")
                      }
                    >
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      Revisado
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
