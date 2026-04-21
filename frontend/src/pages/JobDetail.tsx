import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Briefcase, Share2, Bookmark, CheckCircle2, Loader2, Link2, Check } from "lucide-react";
import { useConvocatoria, useIncrementViews } from "@/hooks/useConvocatorias";
import Layout from "@/components/Layout";
import { useEffect, useRef, useState } from "react";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading, isError } = useConvocatoria(id);
  const incrementViews = useIncrementViews();
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = job?.title ?? "Vacante en Café Quindío";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or not supported — fall through to dropdown
      }
    }
    setShareOpen((prev) => !prev);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (id) incrementViews.mutate(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (isError || !job) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold uppercase tracking-brand text-foreground mb-2">
              Vacante no encontrada
            </h1>
            <Link to="/" className="text-primary hover:underline text-sm font-body">
              ← Regresar a la búsqueda
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const funciones = job.requirements.filter((r) => r.type === "funcion");
  const requisitos = job.requirements.filter((r) => r.type === "requisito");
  const perfilIdeal = job.requirements.filter((r) => r.type === "perfil_ideal");
  const cityStr = job.city?.name ?? job.location;
  const locationStr = [cityStr, job.department].filter(Boolean).join(", ");
  const areaStr = job.area_catalog?.name ?? job.area;
  const contractStr = job.contract_type?.name ?? job.type;

  return (
    <Layout>
      {/* Hero header bar */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs uppercase tracking-brand text-white/70 font-heading font-semibold mb-2">
            {[areaStr, job.ref_id].filter(Boolean).join(" · ")}
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold uppercase tracking-wide leading-tight">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-white/75 text-sm font-body">
            {locationStr && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {locationStr}
              </span>
            )}
            {contractStr && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {contractStr}
              </span>
            )}
            {job.date_posted && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Publicado el {formatDate(job.date_posted)}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => navigate(`/vacante/${job.id}/aplicar`)}
              className="inline-flex items-center px-6 py-2.5 bg-white text-primary text-xs font-heading font-bold uppercase tracking-brand rounded-full hover:bg-white/90 transition-all duration-200 active:scale-95 shadow-sm"
            >
              Postularme ahora
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in pb-20 sm:pb-0">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-8 font-heading font-semibold uppercase tracking-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Regresar a la búsqueda
        </Link>

        {/* Intro */}
        {job.description && (
          <div className="mb-8">
            <h2 className="text-base font-heading font-bold uppercase tracking-brand text-foreground mb-3">
              Nuestro Compromiso con la Calidad
            </h2>
            <div
              className="text-sm text-muted-foreground leading-relaxed font-body rich-content"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
            <p className="text-sm text-foreground font-semibold font-body mt-4">
              ¡Muchas gracias por tu interés en la posición de{" "}
              <span className="text-primary">{job.title}</span> y querer formar parte de Café Quindío!
            </p>
          </div>
        )}

        {/* Functions */}
        {funciones.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-heading font-bold uppercase tracking-brand text-primary mb-4 border-l-4 border-primary pl-3">
              Funciones
            </h3>
            <ul className="space-y-2.5">
              {funciones.map((fn) => (
                <li key={fn.id} className="flex items-start gap-2.5 text-sm text-muted-foreground font-body">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {fn.content}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {requisitos.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-heading font-bold uppercase tracking-brand text-primary mb-4 border-l-4 border-primary pl-3">
              Requisitos
            </h3>
            <ul className="space-y-2.5">
              {requisitos.map((req) => (
                <li key={req.id} className="flex items-start gap-2.5 text-sm text-muted-foreground font-body">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {req.content}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ideal candidate */}
        {perfilIdeal.length > 0 && (
          <div className="mb-8">
            <h3 className="text-base font-heading font-bold uppercase tracking-brand text-foreground mb-4">
              ¿Quién sería nuestro mejor candidato?
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {perfilIdeal.map((item) => (
                <div
                  key={item.id}
                  className="bg-muted rounded-lg p-4 border border-border hover:shadow-md hover:border-primary/30 transition-all duration-200"
                >
                  {item.label && (
                    <p className="text-xs font-heading font-bold uppercase tracking-brand text-primary mb-1">
                      {item.label}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-border">
          <button
            onClick={() => navigate(`/vacante/${job.id}/aplicar`)}
            className="inline-flex items-center px-6 py-2.5 bg-primary text-white text-xs font-heading font-bold uppercase tracking-brand rounded-full hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-sm"
          >
            Postularme ahora
          </button>
          <div className="relative" ref={shareRef}>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-border text-foreground text-xs font-heading font-semibold uppercase tracking-brand rounded-full hover:border-primary hover:text-primary transition-all duration-200 active:scale-95"
            >
              <Share2 className="h-3.5 w-3.5" /> Compartir
            </button>

            {shareOpen && (() => {
              const url = encodeURIComponent(window.location.href);
              const text = encodeURIComponent(`${job?.title ?? "Vacante"} — Café Quindío`);
              const networks = [
                { label: "WhatsApp",  color: "#25D366", href: `https://wa.me/?text=${text}%20${url}` },
                { label: "LinkedIn",  color: "#0A66C2", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
                { label: "X / Twitter", color: "#000",  href: `https://twitter.com/intent/tweet?text=${text}&url=${url}` },
                { label: "Facebook",  color: "#1877F2", href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
              ];
              return (
                <div className="absolute left-0 bottom-full mb-2 w-48 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50">
                  {networks.map((n) => (
                    <a
                      key={n.label}
                      href={n.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShareOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-heading font-semibold hover:bg-muted transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: n.color }} />
                      {n.label}
                    </a>
                  ))}
                  <button
                    onClick={copyLink}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-heading font-semibold hover:bg-muted transition-colors border-t border-border"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Link2 className="h-3.5 w-3.5" />}
                    {copied ? "¡Enlace copiado!" : "Copiar enlace"}
                  </button>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Talent community */}
        <div className="mt-10 bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 sm:p-8 text-white">
          <h3 className="text-base font-heading font-bold uppercase tracking-brand mb-2">
            Únete a nuestra comunidad de talento
          </h3>
          <p className="text-sm text-white/75 mb-5 font-body max-w-lg">
            ¿No encontraste la vacante ideal? Déjanos tu CV y te contactaremos cuando
            surjan nuevas oportunidades que se ajusten a tu perfil.
          </p>
          <button className="inline-flex items-center px-6 py-2.5 bg-white text-primary text-xs font-heading font-bold uppercase tracking-brand rounded-full hover:bg-white/90 transition-all duration-200 active:scale-95">
            Sube tu CV
          </button>
        </div>
      </div>

      {/* Sticky bottom CTA — solo móvil */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-border px-4 py-3 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-body font-semibold text-foreground truncate">{job.title}</p>
          <p className="text-[11px] font-body text-muted-foreground">{job.city?.name ?? job.location ?? "—"}</p>
        </div>
        <button
          onClick={() => navigate(`/vacante/${job.id}/aplicar`)}
          className="shrink-0 px-5 py-2.5 bg-primary text-white text-xs font-heading font-bold uppercase tracking-wide rounded-full hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-sm shadow-primary/20"
        >
          Postularme
        </button>
      </div>
    </Layout>
  );
};

export default JobDetail;
