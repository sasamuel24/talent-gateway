import { useState, useEffect } from "react";
import { Brain, Pencil, Save, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { useConvocatorias, useUpdateConvocatoria } from "@/hooks/useConvocatorias";

export default function AdminIA() {
  const { toast } = useToast();

  const { data: jobs, isLoading } = useConvocatorias();
  const updateConvocatoria = useUpdateConvocatoria();

  const [promptValues, setPromptValues] = useState<Record<string, string>>({});
  const [promptsInitialized, setPromptsInitialized] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  useEffect(() => {
    if (jobs && !promptsInitialized) {
      setPromptValues(
        Object.fromEntries(jobs.map((j) => [j.id, j.ai_prompt ?? ""]))
      );
      setPromptsInitialized(true);
    }
  }, [jobs, promptsInitialized]);

  const activeJobs = jobs?.filter((j) => j.status === "activa") ?? [];
  const draftJobs = jobs?.filter(
    (j) => j.status === "borrador" && !j.ai_prompt?.trim()
  ) ?? [];
  const nonActiveJobs = jobs?.filter((j) => j.status !== "activa") ?? [];

  const savePrompt = (jobId: string) => {
    updateConvocatoria.mutate(
      { id: jobId, payload: { ai_prompt: promptValues[jobId] } },
      {
        onSuccess: () => {
          setEditingJobId(null);
          toast({
            title: "Criterios actualizados",
            description: "La IA usará estos criterios para evaluar nuevos candidatos.",
          });
        },
        onError: (err) => {
          toast({
            title: "Error al guardar",
            description: err.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const renderJobCard = (job: NonNullable<typeof jobs>[0], dimmed = false) => {
    const isEditing = editingJobId === job.id;
    const hasPrompt = Boolean(job.ai_prompt?.trim());

    return (
      <Card
        key={job.id}
        className={[
          !hasPrompt ? "border-dashed" : "",
          dimmed ? "opacity-60" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-sm truncate">{job.title}</p>
                {job.area && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    {dimmed ? job.status : job.area}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {job.location}
                {!dimmed && ` · ${job.candidates_count} candidatos`}
              </p>
            </div>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-xs"
                onClick={() => {
                  setPromptValues((prev) => ({
                    ...prev,
                    [job.id]: job.ai_prompt ?? "",
                  }));
                  setEditingJobId(job.id);
                }}
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
                value={promptValues[job.id] ?? ""}
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
                  disabled={
                    !promptValues[job.id]?.trim() ||
                    updateConvocatoria.isPending
                  }
                >
                  {updateConvocatoria.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5 mr-1" />
                  )}
                  Guardar criterios
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingJobId(null)}
                  disabled={updateConvocatoria.isPending}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : hasPrompt ? (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {job.ai_prompt}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Sin criterios definidos — la IA usará scoring genérico.
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Entrenamiento IA</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona el motor de filtrado inteligente por convocatoria
          </p>
        </div>

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
                {draftJobs.length} convocatoria
                {draftJobs.length > 1 ? "s" : ""} sin criterios de IA definidos
              </p>
              <p className="text-xs text-yellow-700 mt-0.5">
                Edítalas para agregar los criterios antes de publicarlas.
              </p>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {activeJobs.map((job) => renderJobCard(job))}
            </div>

            {nonActiveJobs.length > 0 && (
              <details className="group">
                <summary className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
                  Ver borradores y convocatorias cerradas
                </summary>
                <div className="mt-3 space-y-3">
                  {nonActiveJobs.map((job) => renderJobCard(job, true))}
                </div>
              </details>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
