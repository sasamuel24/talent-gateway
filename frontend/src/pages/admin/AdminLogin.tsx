import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo-cafe-quindio.png";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginFormValues {
  email: string;
  password: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminLogin() {
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/admin", { replace: true });
    }
  }, [user, isLoading, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError(
          "No fue posible conectar con el servidor. Verifica tu conexión e intenta de nuevo."
        );
      }
    }
  };

  // While checking stored session, show nothing to avoid flash
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">

      {/* ── Banda superior de marca ── */}
      <div className="h-1.5 w-full bg-primary shrink-0" />

      {/* ── Contenido centrado ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">

        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <img src={logo} alt="Café Quindío" className="h-10 w-auto" />
        </div>

        <Card className="w-full max-w-sm shadow-xl border-0 animate-slide-up">

          {/* ── Header ── */}
          <CardHeader className="text-center pb-2 pt-8 space-y-2">
            <div className="flex justify-center mb-1">
              <div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
            </div>
            <h1 className="text-lg font-heading font-bold text-foreground">Panel Administrativo</h1>
            <p className="text-xs font-body text-muted-foreground">Ingresa tus credenciales para continuar</p>
          </CardHeader>

          {/* ── Form ── */}
          <CardContent className="pt-6 pb-8 px-6 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-body font-semibold text-foreground/80 uppercase tracking-wide">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@cafequindio.com"
                  autoComplete="email"
                  className="h-11 text-sm"
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email", {
                    required: "El correo es requerido.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Ingresa un correo válido.",
                    },
                  })}
                />
                {errors.email && (
                  <p id="email-error" className="text-xs text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-body font-semibold text-foreground/80 uppercase tracking-wide">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-11 text-sm pr-10"
                    aria-describedby={errors.password ? "password-error" : undefined}
                    {...register("password", {
                      required: "La contraseña es requerida.",
                      minLength: {
                        value: 4,
                        message: "La contraseña debe tener al menos 4 caracteres.",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-xs text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <Alert variant="destructive">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 text-sm font-heading font-bold uppercase tracking-wide mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión…
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-[11px] font-body text-muted-foreground/50 tracking-wide animate-fade-in">
          © {new Date().getFullYear()} Café Quindío — Uso exclusivo del equipo interno
        </p>
      </div>
    </div>
  );
}
