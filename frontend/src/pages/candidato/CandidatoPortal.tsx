import { Link } from "react-router-dom";
import { Briefcase, Calendar, ChevronRight, Loader2, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCandidateAuth } from "@/contexts/CandidateAuthContext";
import { useCandidateApplications } from "@/hooks/useCandidatePortal";
import logo from "@/assets/logo-cafe-quindio.png";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  nuevo:       { bg: "bg-gray-100",   text: "text-gray-600",   dot: "bg-gray-400" },
  revisado:    { bg: "bg-yellow-50",  text: "text-yellow-700", dot: "bg-yellow-400" },
  entrevista:  { bg: "bg-blue-50",    text: "text-blue-700",   dot: "bg-blue-400" },
  aprobado:    { bg: "bg-green-50",   text: "text-green-700",  dot: "bg-green-500" },
  rechazado:   { bg: "bg-red-50",     text: "text-red-600",    dot: "bg-red-400" },
};

function StatusBadge({ statusKey, statusLabel }: { statusKey: string; statusLabel: string }) {
  const style = STATUS_STYLES[statusKey] ?? STATUS_STYLES.nuevo;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-semibold ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {statusLabel}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CandidatoPortal() {
  const { candidate, logout } = useCandidateAuth();
  const { data: applications, isLoading, isError } = useCandidateApplications(!!candidate);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <div className="h-1.5 w-full bg-primary shrink-0" />

      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/">
            <img src={logo} alt="Café Quindío" className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-body text-muted-foreground hidden sm:block">
              {candidate?.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-xs text-muted-foreground hover:text-destructive gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-xl font-heading font-bold text-foreground">
            Hola, {candidate?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm font-body text-muted-foreground mt-0.5">
            Aquí puedes ver el estado de todas tus postulaciones
          </p>
        </div>

        {/* Applications list */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        )}

        {isError && (
          <div className="text-center py-16">
            <p className="text-sm font-body text-destructive">
              No se pudieron cargar las postulaciones. Intenta de nuevo.
            </p>
          </div>
        )}

        {!isLoading && !isError && applications?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-base font-heading font-semibold text-foreground mb-1">
              Aún no tienes postulaciones
            </h2>
            <p className="text-sm font-body text-muted-foreground mb-5">
              Explora las vacantes disponibles y aplica a la que más te interese
            </p>
            <Button asChild>
              <Link to="/" className="gap-2">
                <Search className="w-4 h-4" />
                Ver vacantes
              </Link>
            </Button>
          </div>
        )}

        {!isLoading && !isError && applications && applications.length > 0 && (
          <div className="space-y-3">
            {applications.map((app) => (
              <Card key={app.id} className="border border-border hover:border-primary/40 transition-colors duration-200 shadow-sm">
                <CardContent className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-heading font-bold text-foreground truncate">
                        {app.job_title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        {app.job_location && (
                          <span className="text-xs font-body text-muted-foreground">
                            {app.job_location}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs font-body text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(app.applied_date)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge statusKey={app.status_key} statusLabel={app.status_label} />
                      <Link
                        to={`/vacante/${app.job_id}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title="Ver vacante"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {!isLoading && applications && applications.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link to="/" className="gap-2 text-sm">
                <Search className="w-4 h-4" />
                Explorar más vacantes
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
