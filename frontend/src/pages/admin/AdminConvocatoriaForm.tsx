import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, ArrowLeft, Save, Send, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { adminJobs } from "@/data/adminData";

const formSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  area: z.string().min(1, "Selecciona un área"),
  location: z.string().min(2, "Ingresa la ciudad"),
  type: z.string().min(1, "Selecciona el tipo de contrato"),
  status: z.enum(["borrador", "activa"]),
  description: z
    .string()
    .min(50, "La descripción debe tener al menos 50 caracteres"),
  requirements: z
    .array(z.object({ value: z.string().min(3, "Mínimo 3 caracteres") }))
    .min(1, "Agrega al menos un requisito"),
  aiPrompt: z
    .string()
    .min(20, "Describe los criterios para que la IA evalúe candidatos (mín. 20 caracteres)"),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminConvocatoriaForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEditing = Boolean(id);
  const existingJob = isEditing
    ? adminJobs.find((j) => j.id === Number(id))
    : undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      area: "",
      location: "",
      type: "",
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

  useEffect(() => {
    if (existingJob) {
      form.reset({
        title: existingJob.title,
        area: existingJob.area,
        location: existingJob.location,
        type: existingJob.type,
        status: existingJob.status === "cerrada" ? "borrador" : existingJob.status,
        description: existingJob.description,
        requirements: existingJob.requirements.map((v) => ({ value: v })),
        aiPrompt: existingJob.aiPrompt ?? "",
      });
    }
  }, [existingJob, form]);

  const onSubmit = (values: FormValues, saveAsDraft = false) => {
    const finalStatus = saveAsDraft ? "borrador" : values.status;
    console.log("Guardar convocatoria:", { ...values, status: finalStatus });
    toast({
      title: saveAsDraft ? "Borrador guardado" : "Convocatoria publicada",
      description: saveAsDraft
        ? "Los cambios fueron guardados como borrador."
        : "La convocatoria fue publicada exitosamente.",
    });
    navigate("/admin/convocatorias");
  };

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
                {existingJob.refId} · {existingJob.title}
              </p>
            )}
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => onSubmit(v, false))}
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
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar área" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              "Producción",
                              "Tiendas",
                              "Logística",
                              "Marketing",
                              "Administración",
                              "Recursos Humanos",
                            ].map((a) => (
                              <SelectItem key={a} value={a}>
                                {a}
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
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Armenia, Quindío" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de contrato</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              "Término Indefinido",
                              "Término Fijo",
                              "Practicante",
                            ].map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado inicial</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
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
                </div>
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
                  Describe en lenguaje natural qué candidatos debe aprobar o descartar la IA para esta convocatoria específica.
                  Sé concreto: menciona experiencia mínima, requisitos excluyentes, habilidades clave y cualquier aspecto que la IA debe priorizar.
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
              <Button type="submit" className="w-full sm:w-auto">
                <Send className="w-4 h-4 mr-1.5" />
                {isEditing ? "Guardar cambios" : "Publicar convocatoria"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => form.handleSubmit((v) => onSubmit(v, true))()}
              >
                <Save className="w-4 h-4 mr-1.5" />
                Guardar como borrador
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-muted-foreground"
                onClick={() => navigate("/admin/convocatorias")}
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
