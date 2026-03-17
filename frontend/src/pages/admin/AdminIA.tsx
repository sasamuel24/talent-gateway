import { useState } from "react";
import {
  Brain,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  Target,
  Pencil,
  Save,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  aiTrainingCases as initialCases,
  aiMetrics,
  aiMetricsHistory,
  candidates,
  adminJobs,
} from "@/data/adminData";
import type { AITrainingCase } from "@/data/adminData";

export default function AdminIA() {
  const { toast } = useToast();
  const [cases, setCases] = useState<AITrainingCase[]>(initialCases);
  const [reviewedCount, setReviewedCount] = useState(0);

  // Estado para edición de prompts por convocatoria
  const [promptValues, setPromptValues] = useState<Record<number, string>>(
    Object.fromEntries(adminJobs.map((j) => [j.id, j.aiPrompt ?? ""]))
  );
  const [editingJobId, setEditingJobId] = useState<number | null>(null);

  const pendingCases = cases.filter((c) => !c.reviewedBy);
  const totalCases = cases.length;

  const savePrompt = (jobId: number) => {
    setEditingJobId(null);
    toast({
      title: "Criterios actualizados",
      description: "La IA usará estos criterios para evaluar nuevos candidatos.",
    });
  };

  const markCase = (
    id: number,
    correct: boolean,
    correction?: "aprobado" | "rechazado"
  ) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              isCorrect: correct,
              reviewedBy: "Valentina Ospina",
              reviewedDate: new Date().toLocaleDateString("es-CO"),
              humanDecision: correction ?? c.humanDecision,
            }
          : c
      )
    );
    setReviewedCount((p) => p + 1);
  };

  const activeJobs = adminJobs.filter((j) => j.status === "activa");
  const draftJobs = adminJobs.filter(
    (j) => j.status === "borrador" && !promptValues[j.id]
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Entrenamiento IA</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona el motor de filtrado inteligente por convocatoria
          </p>
        </div>

        <Tabs defaultValue="convocatorias">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="convocatorias" className="text-xs sm:text-sm">
              Por convocatoria
            </TabsTrigger>
            <TabsTrigger value="decisiones" className="text-xs sm:text-sm">
              Revisar
              {pendingCases.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4">
                  {pendingCases.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="metricas" className="text-xs sm:text-sm">
              Métricas
            </TabsTrigger>
          </TabsList>

          {/* ── Tab 1: Criterios por convocatoria ── */}
          <TabsContent value="convocatorias" className="mt-6 space-y-4">
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Brain className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <p>
                    Cada convocatoria tiene sus propios criterios de IA. La IA usará
                    estas instrucciones para puntuar y filtrar candidatos únicamente
                    para esa vacante.
                  </p>
                </div>
              </CardContent>
            </Card>

            {draftJobs.length > 0 && (
              <Card className="border-yellow-300 bg-yellow-50">
                <CardContent className="pt-4 pb-3">
                  <p className="text-sm font-medium text-yellow-800">
                    {draftJobs.length} convocatoria{draftJobs.length > 1 ? "s" : ""} sin criterios de IA definidos
                  </p>
                  <p className="text-xs text-yellow-700 mt-0.5">
                    Edítalas para agregar los criterios antes de publicarlas.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {activeJobs.map((job) => {
                const isEditing = editingJobId === job.id;
                const prompt = promptValues[job.id];
                const hasPrompt = Boolean(prompt?.trim());

                return (
                  <Card key={job.id} className={!hasPrompt ? "border-dashed" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-sm truncate">{job.title}</p>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {job.area}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {job.location} · {job.candidatesCount} candidatos
                          </p>
                        </div>
                        {!isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0 text-xs"
                            onClick={() => setEditingJobId(job.id)}
                          >
                            <Pencil className="w-3.5 h-3.5 mr-1" />
                            {hasPrompt ? "Editar" : "Agregar"}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Textarea
                            value={promptValues[job.id]}
                            onChange={(e) =>
                              setPromptValues((prev) => ({
                                ...prev,
                                [job.id]: e.target.value,
                              }))
                            }
                            placeholder={`Describe qué candidatos debe aprobar o descartar la IA para "${job.title}"...`}
                            className="min-h-[120px] text-sm"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => savePrompt(job.id)}
                              disabled={!promptValues[job.id]?.trim()}
                            >
                              <Save className="w-3.5 h-3.5 mr-1" />
                              Guardar criterios
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingJobId(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : hasPrompt ? (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {prompt}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Sin criterios definidos — la IA usará scoring genérico.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {adminJobs.filter((j) => j.status !== "activa").length > 0 && (
              <details className="group">
                <summary className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
                  Ver borradores y convocatorias cerradas
                </summary>
                <div className="mt-3 space-y-3">
                  {adminJobs
                    .filter((j) => j.status !== "activa")
                    .map((job) => {
                      const isEditing = editingJobId === job.id;
                      const prompt = promptValues[job.id];
                      const hasPrompt = Boolean(prompt?.trim());

                      return (
                        <Card key={job.id} className="opacity-60 border-dashed">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium text-sm truncate">{job.title}</p>
                                  <Badge variant="outline" className="text-xs shrink-0">
                                    {job.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {job.location}
                                </p>
                              </div>
                              {!isEditing && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="shrink-0 text-xs"
                                  onClick={() => setEditingJobId(job.id)}
                                >
                                  <Pencil className="w-3.5 h-3.5 mr-1" />
                                  {hasPrompt ? "Editar" : "Agregar"}
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            {isEditing ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={promptValues[job.id]}
                                  onChange={(e) =>
                                    setPromptValues((prev) => ({
                                      ...prev,
                                      [job.id]: e.target.value,
                                    }))
                                  }
                                  className="min-h-[100px] text-sm"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => savePrompt(job.id)}>
                                    <Save className="w-3.5 h-3.5 mr-1" />
                                    Guardar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingJobId(null)}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            ) : hasPrompt ? (
                              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                {prompt}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                Sin criterios definidos.
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </details>
            )}
          </TabsContent>

          {/* ── Tab 2: Revisar decisiones ── */}
          <TabsContent value="decisiones" className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Corrige las decisiones del modelo para mejorar su precisión.
                </p>
                <p className="text-sm font-medium mt-1">
                  {pendingCases.length} casos pendientes de revisión
                </p>
              </div>
              {totalCases > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Progress
                    value={(reviewedCount / totalCases) * 100}
                    className="h-2 w-32"
                  />
                  <span>
                    {reviewedCount}/{totalCases}
                  </span>
                </div>
              )}
            </div>

            {cases.map((trainingCase) => {
              const candidate = candidates.find(
                (c) => c.id === trainingCase.candidateId
              );
              const job = adminJobs.find((j) => j.id === trainingCase.jobId);
              const isReviewed = Boolean(trainingCase.reviewedBy);

              return (
                <Card
                  key={trainingCase.id}
                  className={isReviewed ? "opacity-60" : ""}
                >
                  <CardContent className="pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">
                          {candidate?.name ?? "Candidato desconocido"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {job?.title ?? "Vacante no encontrada"}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">Score:</span>
                            <span className="text-xs font-semibold">
                              {trainingCase.aiScore}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              trainingCase.aiDecision === "aprobado"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : trainingCase.aiDecision === "rechazado"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                            }
                          >
                            IA: {trainingCase.aiDecision}
                          </Badge>
                        </div>
                      </div>

                      {isReviewed ? (
                        <div className="flex items-center gap-2">
                          {trainingCase.isCorrect ? (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-700 border-green-200"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Correcto
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-700 border-red-200"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Corregido
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {trainingCase.reviewedDate}
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-300 text-green-700 hover:bg-green-50"
                            onClick={() => markCase(trainingCase.id, true)}
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Correcta
                          </Button>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-50 text-xs px-2"
                              onClick={() =>
                                markCase(trainingCase.id, false, "aprobado")
                              }
                            >
                              Debe aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-50 text-xs px-2"
                              onClick={() =>
                                markCase(trainingCase.id, false, "rechazado")
                              }
                            >
                              Debe rechazar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* ── Tab 3: Métricas ── */}
          <TabsContent value="metricas" className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground">Precisión del modelo</p>
                  </div>
                  <p className="text-3xl font-heading font-bold">{aiMetrics.precision}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {aiMetrics.correctDecisions} de {aiMetrics.totalDecisions} decisiones correctas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground">Casos revisados</p>
                  </div>
                  <p className="text-3xl font-heading font-bold">
                    {aiMetrics.trainingCases}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Último entrenamiento: {aiMetrics.lastTraining}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-heading">
                  Evolución de la precisión
                </CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button disabled={pendingCases.length < 10} size="sm">
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                        Nuevo entrenamiento
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {pendingCases.length < 10 && (
                    <TooltipContent>
                      <p className="text-xs">
                        Se necesitan al menos 10 casos revisados para entrenar
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={aiMetricsHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="fecha"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[60, 100]}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <RechartTooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Line
                      type="monotone"
                      dataKey="precision"
                      name="Precisión"
                      stroke="#2CB6B8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
