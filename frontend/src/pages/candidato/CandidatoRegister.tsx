import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCandidateAuth } from "@/contexts/CandidateAuthContext";
import logo from "@/assets/logo-cafe-quindio.png";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function CandidatoRegister() {
  const { candidate, isLoading, register: registerCandidate } = useCandidateAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!isLoading && candidate) navigate("/candidato/portal", { replace: true });
  }, [candidate, isLoading, navigate]);

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerCandidate(values.name, values.email, values.password);
      navigate("/candidato/portal", { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Error al crear la cuenta.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <div className="h-1.5 w-full bg-primary shrink-0" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="mb-8">
          <Link to="/">
            <img src={logo} alt="Café Quindío" className="h-10 w-auto" />
          </Link>
        </div>

        <Card className="w-full max-w-sm shadow-xl border-0">
          <CardHeader className="text-center pb-2 pt-8 space-y-2">
            <div className="flex justify-center mb-1">
              <div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h1 className="text-lg font-heading font-bold text-foreground">Crear cuenta</h1>
            <p className="text-xs font-body text-muted-foreground">
              Crea tu cuenta para hacer seguimiento a tus postulaciones
            </p>
          </CardHeader>

          <CardContent className="pt-6 pb-8 px-6 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-body font-semibold text-foreground/80 uppercase tracking-wide">
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  autoComplete="name"
                  className="h-11 text-sm"
                  {...register("name", { required: "El nombre es requerido." })}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-body font-semibold text-foreground/80 uppercase tracking-wide">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@email.com"
                  autoComplete="email"
                  className="h-11 text-sm"
                  {...register("email", {
                    required: "El correo es requerido.",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo no válido." },
                  })}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-body font-semibold text-foreground/80 uppercase tracking-wide">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    className="h-11 text-sm pr-10"
                    {...register("password", {
                      required: "La contraseña es requerida.",
                      minLength: { value: 8, message: "Mínimo 8 caracteres." },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-body font-semibold text-foreground/80 uppercase tracking-wide">
                  Confirmar contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  className="h-11 text-sm"
                  {...register("confirmPassword", {
                    required: "Confirma tu contraseña.",
                    validate: (val) => val === watch("password") || "Las contraseñas no coinciden.",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {serverError && (
                <Alert variant="destructive">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-sm font-heading font-bold uppercase tracking-wide mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creando cuenta…</>
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground font-body">
              ¿Ya tienes cuenta?{" "}
              <Link to="/candidato/login" className="text-primary hover:underline font-medium">
                Ingresar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
