import { useState } from "react";
import {
  Brain,
  CheckCircle,
  XCircle,
  Upload,
  Download,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Target,
  BarChart3,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  aiWeights as initialWeights,
  aiTrainingCases as initialCases,
  aiMetrics,
  aiMetricsHistory,
  candidates,
  adminJobs,
} from "@/data/adminData";
import type { AIWeight, AITrainingCase } from "@/data/adminData";

const categoryLabels = {
  tecnico: "Técnico",
  experiencia: "Experiencia",
  cultural: "Cultural",
};

const categoryColors = {
  tecnico: "text-primary",
  experiencia: "text-accent-foreground",
  cultural: "text-purple-600",
};

function WeightSum({
  weights,
  category,
}: {
  weights: AIWeight[];
  category: "tecnico" | "experiencia" | "cultural";
}) {
  const sum = weights
    .filter((w) => w.category === category)
    .reduce((acc, w) => acc + w.weight, 0);
  const avg = Math.round(
    sum / weights.filter((w) => w.category === category).length
  );
  return (
    <div className="flex items-center gap-2 mt-2">
      <Progress value={avg} className="h-1.5 flex-1" />
      <span className="text-xs text-muted-foreground tabular-nums">
        Promedio: {avg}%
      </span>
    </div>
  );
}

const mockTrainingHistory = [
  { fecha: "05/03/2026", casos: 89, precision: 87.4, estado: "completado" },
  { fecha: "10/02/2026", casos: 72, precision: 84.6, estado: "completado" },
  { fecha: "15/01/2026", casos: 58, precision: 81.0, estado: "completado" },
  { fecha: "20/12/2025", casos: 43, precision: 78.3, estado: "completado" },
];

export default function AdminIA() {
  const { toast } = useToast();
  const [weights, setWeights] = useState<AIWeight[]>(initialWeights);
  const [cases, setCases] = useState<AITrainingCase[]>(initialCases);
  const [reviewedCount, setReviewedCount] = useState(0);

  const pendingCases = cases.filter((c) => !c.reviewedBy);
  const totalCases = cases.length;

  const updateWeight = (id: string, newWeight: number) => {
    setWeights((prev) =>
      prev.map((w) => (w.id === id ? { ...w, weight: newWeight } : w))
    );
  };

  const saveWeights = () => {
    toast({
      title: "Criterios guardados",
      description: "Los pesos del modelo fueron actualizados correctamente.",
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

  const groupedWeights = (["tecnico", "experiencia", "cultural"] as const).map(
    (cat) => ({
      category: cat,
      items: weights.filter((w) => w.category === cat),
    })
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">
            Entrenamiento IA
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona el motor de filtrado inteligente de candidatos
          </p>
        </div>

        <Tabs defaultValue="criterios">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="criterios" className="text-xs sm:text-sm">
              Criterios
            </TabsTrigger>
            <TabsTrigger value="decisiones" className="text-xs sm:text-sm">
              Revisar
            </TabsTrigger>
            <TabsTrigger value="metricas" className="text-xs sm:text-sm">
              Métricas
            </TabsTrigger>
            <TabsTrigger value="datos" className="text-xs sm:text-sm">
              Datos
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Criterios de Scoring */}
          <TabsContent value="criterios" className="mt-6 space-y-4">
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Brain className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <p>
                    Define el peso de cada criterio (0–100) para el motor de
                    filtrado. Un mayor peso significa mayor importancia en el
                    score final.
                  </p>
                </div>
              </CardContent>
            </Card>

            {groupedWeights.map(({ category, items }) => (
              <Card key={category}>
                <CardHeader className="pb-2">
                  <CardTitle
                    className={`text-sm font-heading ${categoryColors[category]}`}
                  >
                    {categoryLabels[category]}
                  </CardTitle>
                  <WeightSum weights={weights} category={category} />
                </CardHeader>
                <CardContent className="space-y-5">
                  {items.map((w) => (
                    <div key={w.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <p className="text-sm font-medium">{w.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {w.description}
                          </p>
                        </div>
                        <span className="text-sm font-semibold tabular-nums w-10 text-right">
                          {w.weight}
                        </span>
                      </div>
                      <Slider
                        value={[w.weight]}
                        onValueChange={([v]) => updateWeight(w.id, v)}
                        min={0}
                        max={100}
                        step={5}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end">
              <Button onClick={saveWeights}>
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Guardar criterios
              </Button>
            </div>
          </TabsContent>

          {/* Tab 2: Revisar Decisiones */}
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
                            <span className="text-xs text-muted-foreground">
                              Score:
                            </span>
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

          {/* Tab 3: Métricas */}
          <TabsContent value="metricas" className="mt-6 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground">Precisión</p>
                  </div>
                  <p className="text-2xl font-heading font-bold">
                    {aiMetrics.precision}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground">Recall</p>
                  </div>
                  <p className="text-2xl font-heading font-bold">
                    {aiMetrics.recall}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground">F1-Score</p>
                  </div>
                  <p className="text-2xl font-heading font-bold">
                    {aiMetrics.f1Score}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground">
                      Casos entrenados
                    </p>
                  </div>
                  <p className="text-2xl font-heading font-bold">
                    {aiMetrics.trainingCases}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-heading">
                  Evolución del modelo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
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
                    <Line
                      type="monotone"
                      dataKey="f1"
                      name="F1-Score"
                      stroke="#C6A46E"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-heading">
                  Historial de entrenamientos
                </CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        disabled={pendingCases.length < 10}
                        size="sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                        Nuevo entrenamiento
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {pendingCases.length < 10 && (
                    <TooltipContent>
                      <p className="text-xs">
                        Se necesitan al menos 10 casos nuevos revisados
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-muted-foreground">
                        Fecha
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground">
                        Casos
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground">
                        Precisión
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTrainingHistory.map((h) => (
                      <tr key={h.fecha} className="border-b last:border-0">
                        <td className="p-4">{h.fecha}</td>
                        <td className="p-4">{h.casos}</td>
                        <td className="p-4 font-medium">{h.precision}%</td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-700 border-green-200"
                          >
                            {h.estado}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Datos de Entrenamiento */}
          <TabsContent value="datos" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total candidatos
                  </p>
                  <p className="text-3xl font-heading font-bold">
                    {candidates.length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">
                    Aprobados (humano)
                  </p>
                  <p className="text-3xl font-heading font-bold text-green-600">
                    {
                      candidates.filter(
                        (c) => c.humanDecision === "aprobado"
                      ).length
                    }
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">
                    Rechazados (humano)
                  </p>
                  <p className="text-3xl font-heading font-bold text-red-600">
                    {
                      candidates.filter(
                        (c) => c.humanDecision === "rechazado"
                      ).length
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CSV Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-heading">
                  Importar dataset CSV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group">
                  <Upload className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3 group-hover:text-primary/60 transition-colors" />
                  <p className="font-medium text-sm">
                    Arrastra tu archivo CSV aquí
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    O haz clic para seleccionar un archivo
                  </p>
                  <p className="text-xs text-muted-foreground mt-3 bg-muted/50 rounded px-3 py-1.5 inline-block font-mono">
                    nombre, email, score_ia, decision_ia, decision_humana
                  </p>
                  <input type="file" className="hidden" accept=".csv" />
                </div>
              </CardContent>
            </Card>

            {/* Upload history */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-heading">
                  Uploads anteriores
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Exportar dataset
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-muted-foreground">
                        Archivo
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">
                        Registros
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "candidatos_feb_2026.csv",
                        records: 72,
                        status: "procesado",
                      },
                      {
                        name: "candidatos_ene_2026.csv",
                        records: 58,
                        status: "procesado",
                      },
                      {
                        name: "candidatos_dic_2025.csv",
                        records: 43,
                        status: "procesado",
                      },
                    ].map((upload) => (
                      <tr
                        key={upload.name}
                        className="border-b last:border-0"
                      >
                        <td className="p-4 font-mono text-xs">{upload.name}</td>
                        <td className="p-4 hidden sm:table-cell">
                          {upload.records}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-700 border-green-200"
                          >
                            {upload.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
