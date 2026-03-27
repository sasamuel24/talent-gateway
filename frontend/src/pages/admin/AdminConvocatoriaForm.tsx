import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, ArrowLeft, Save, Send, Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  useConvocatoria,
  useCreateConvocatoria,
  useUpdateConvocatoria,
} from "@/hooks/useConvocatorias";
import { useAreasAdmin, useCiudades } from "@/hooks/useCatalogs";

const formSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  area_id: z.number({ required_error: "Selecciona un área" }).positive("Selecciona un área"),
  city_id: z.number({ required_error: "Selecciona una ciudad" }).positive("Selecciona una ciudad"),
  status: z.enum(["borrador", "activa"]),
  description: z
    .string()
    .min(50, "La descripción debe tener al menos 50 caracteres"),
  requirements: z
    .array(z.object({ value: z.string().min(3, "Mínimo 3 caracteres") }))
    .min(1, "Agrega al menos un requisito"),
  aiPrompt: z
    .string()
    .min(
      20,
      "Describe los criterios para que la IA evalúe candidatos (mín. 20 caracteres)"
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminConvocatoriaForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const { data: existingJob, isLoading: isLoadingJob } = useConvocatoria(id);
  const { data: areas = [] } = useAreasAdmin();
  const { data: ciudades = [] } = useCiudades();
  const createMutation = useCreateConvocatoria();
  const updateMutation = useUpdateConvocatoria();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      area_id: 0,
      city_id: 0,
      status: "borrador",
      description: "",
      requirements: [{ value: "" }],
      aiPrompt: "",
    },
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({ control: form.control, name: "requirements" });

  // Populate form when editing and data is loaded
  useEffect(() => {
    if (existingJob) {
      const reqs = existingJob.requirements
        .filter((r) => r.type === "requisito")
        .sort((a, b) => a.order - b.order)
        .map((r) => ({ value: r.content }));

      form.reset({
        title: existingJob.title,
        area_id: existingJob.area_id ?? 0,
        city_id: existingJob.city_id ?? 0,
        status:
          existingJob.status === "cerrada" ? "borrador" : existingJob.status,
        description: existingJob.description ?? "",
        requirements: reqs.length > 0 ? reqs : [{ value: "" }],
        aiPrompt: existingJob.ai_prompt ?? "",
      });
    }
  }, [existingJob, form]);

  const handleSubmit = async (values: FormValues, saveAsDraft: boolean) => {
    const finalStatus: "borrador" | "activa" = saveAsDraft
      ? "borrador"
      : values.status;

    const payload = {
      title: values.title,
      area_id: values.area_id,
      city_id: values.city_id,
      status: finalStatus,
      description: values.description,
      ai_prompt: values.aiPrompt,
    };

    const requirements = values.requirements.map((r, i) => ({
      type: "requisito" as const,
      content: r.value,
      order: i,
    }));

    if (isEditing && id) {
      updateMutation.mutate(
        { id, payload, requirements },
        {
          onSuccess: () => {
            toast({
              title: saveAsDraft ? "Borrador guardado" : "Cambios guardados",
              description: saveAsDraft
                ? "Los cambios fueron guardados como borrador."
                : "La convocatoria fue actualizada exitosamente.",
            });
            navigate("/admin/convocatorias");
          },
          onError: (err) => {
            toast({
              title: "Error al guardar",
              description:
                err instanceof Error ? err.message : "Intenta de nuevo.",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createMutation.mutate(
        { payload, requirements },
        {
          onSuccess: () => {
            toast({
              title: saveAsDraft
                ? "Borrador guardado"
                : "Convocatoria publicada",
              description: saveAsDraft
                ? "Los cambios fueron guardados como borrador."
                : "La convocatoria fue publicada exitosamente.",
            });
            navigate("/admin/convocatorias");
          },
          onError: (err) => {
            toast({
              title: "Error al crear",
              description:
                err instanceof Error ? err.message : "Intenta de nuevo.",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  // Show spinner while loading job data in edit mode
  if (isEditing && isLoadingJob) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-bold">
              {isEditing ? "Editar convocatoria" : "Nueva convocatoria"}
            </h1>
            {isEditing && existingJob && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {existingJob.ref_id} · {existingJob.title}
              </p>
            )}
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => handleSubmit(v, false))}
            className="space-y-6"
          >
            {/* Sección 1: Información básica */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-heading">
                  1. Información básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del cargo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Barista – Tienda Parque del Café"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="area_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área</FormLabel>
                        <Select
                          onValueChange={(v) => field.onChange(Number(v))}
                          value={field.value ? String(field.value) : ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar área" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {areas.filter((a) => a.is_active).map((a) => (
                              <SelectItem key={a.id} value={String(a.id)}>
                                {a.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <Select
                          onValueChange={(v) => field.onChange(Number(v))}
                          value={field.value ? String(field.value) : ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar ciudad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ciudades.filter((c) => c.is_active).map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="sm:max-w-[50%]">
                      <FormLabel>Estado inicial</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="borrador">Borrador</SelectItem>
                          <SelectItem value="activa">Activa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Sección 2: Descripción y requisitos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-heading">
                  2. Descripción y requisitos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción del cargo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe el cargo, el equipo y el rol en pocas líneas..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center">
                        <FormMessage />
                        <span className="text-xs text-muted-foreground">
                          {field.value.length} / mín. 50
                        </span>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel>Requisitos del cargo</FormLabel>
                  {requirementFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`requirements.${index}.value`}
                        render={({ field: f }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder={`Requisito ${index + 1}`}
                                {...f}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {requirementFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRequirement(index)}
                          className="text-destructive hover:text-destructive shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendRequirement({ value: "" })}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Agregar requisito
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sección 3: Criterios de IA */}
            <Card className="border-primary/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base font-heading">
                    3. Criterios para la IA
                  </CardTitle>
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  Describe en lenguaje natural qué candidatos debe aprobar o
                  descartar la IA para esta convocatoria específica. Sé
                  concreto: menciona experiencia mínima, requisitos excluyentes,
                  habilidades clave y cualquier aspecto que la IA debe
                  priorizar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="aiPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instrucciones para la IA</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`Ej: "Prioriza candidatos con mínimo 1 año de experiencia en barismo. Es excluyente no tener conocimiento de técnicas de extracción. Descarta candidatos sin disponibilidad para turnos rotativos. Valora especialmente el dominio de latte art y café de especialidad."`}
                          className="min-h-[140px] text-sm"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center mt-1">
                        <FormMessage />
                        <span className="text-xs text-muted-foreground">
                          {field.value.length} caracteres
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-1.5" />
                )}
                {isEditing ? "Guardar cambios" : "Publicar convocatoria"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={isSaving}
                onClick={() =>
                  form.handleSubmit((v) => handleSubmit(v, true))()
                }
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1.5" />
                )}
                Guardar como borrador
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-muted-foreground"
                onClick={() => navigate("/admin/convocatorias")}
                disabled={isSaving}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
