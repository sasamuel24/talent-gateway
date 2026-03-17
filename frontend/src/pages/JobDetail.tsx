import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Briefcase, Share2, Bookmark, CheckCircle2 } from "lucide-react";
import { allJobs } from "@/data/jobs";
import Layout from "@/components/Layout";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = allJobs.find((j) => j.id === Number(id));

  if (!job) {
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

  return (
    <Layout>
      {/* Hero header bar */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs uppercase tracking-brand text-white/70 font-heading font-semibold mb-2">
            {job.area} · {job.refId}
          </p>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold uppercase tracking-wide leading-tight">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-white/75 text-sm font-body">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {job.location}, {job.department}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {job.type}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Publicado el {job.date}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => navigate(`/vacante/${job.id}/aplicar`)}
              className="inline-flex items-center px-6 py-2.5 bg-white text-primary text-xs font-heading font-bold uppercase tracking-brand rounded-full hover:bg-white/90 transition-all duration-200 active:scale-95 shadow-sm"
            >
              Postularme ahora
            </button>
            <button className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-white/40 text-white text-xs font-heading font-semibold uppercase tracking-brand rounded-full hover:bg-white/10 transition-all duration-200 active:scale-95">
              <Share2 className="h-3.5 w-3.5" /> Compartir
            </button>
            <button className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-white/40 text-white text-xs font-heading font-semibold uppercase tracking-brand rounded-full hover:bg-white/10 transition-all duration-200 active:scale-95">
              <Bookmark className="h-3.5 w-3.5" /> Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-8 font-heading font-semibold uppercase tracking-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Regresar a la búsqueda
        </Link>

        {/* Intro */}
        <div className="mb-8">
          <h2 className="text-base font-heading font-bold uppercase tracking-brand text-foreground mb-3">
            Nuestro Compromiso con la Calidad
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-body">{job.description}</p>
          <p className="text-sm text-foreground font-semibold font-body mt-4">
            ¡Muchas gracias por tu interés en la posición de{" "}
            <span className="text-primary">{job.title}</span> y querer formar parte de Café Quindío!
          </p>
        </div>

        {/* Functions */}
        <div className="mb-8">
          <h3 className="text-xs font-heading font-bold uppercase tracking-brand text-primary mb-4 border-l-4 border-primary pl-3">
            Funciones
          </h3>
          <ul className="space-y-2.5">
            {job.functions.map((fn, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground font-body">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {fn}
              </li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div className="mb-8">
          <h3 className="text-xs font-heading font-bold uppercase tracking-brand text-primary mb-4 border-l-4 border-primary pl-3">
            Requisitos
          </h3>
          <ul className="space-y-2.5">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground font-body">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Ideal candidate */}
        <div className="mb-8">
          <h3 className="text-base font-heading font-bold uppercase tracking-brand text-foreground mb-4">
            ¿Quién sería nuestro mejor candidato?
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {job.idealCandidate.map((item, i) => (
              <div
                key={i}
                className="bg-muted rounded-lg p-4 border border-border hover:shadow-md hover:border-primary/30 transition-all duration-200"
              >
                <p className="text-xs font-heading font-bold uppercase tracking-brand text-primary mb-1">
                  {item.label}
                </p>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notice */}
        <p className="text-xs text-muted-foreground italic font-body mb-8 bg-muted rounded-lg p-4 border-l-4 border-gold hover:bg-amber-50/50 transition-colors duration-200">
          "Recuerda que en Café Quindío no realizamos ningún cobro por aplicar a nuestras
          oportunidades. No te dejes engañar y aplica solo por los medios oficiales."
        </p>

        {/* Bottom CTA */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-border">
          <button
            onClick={() => navigate(`/vacante/${job.id}/aplicar`)}
            className="inline-flex items-center px-6 py-2.5 bg-primary text-white text-xs font-heading font-bold uppercase tracking-brand rounded-full hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-sm"
          >
            Postularme ahora
          </button>
          <button className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-border text-foreground text-xs font-heading font-semibold uppercase tracking-brand rounded-full hover:border-primary hover:text-primary transition-all duration-200 active:scale-95">
            <Share2 className="h-3.5 w-3.5" /> Compartir
          </button>
          <button className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-border text-foreground text-xs font-heading font-semibold uppercase tracking-brand rounded-full hover:border-primary hover:text-primary transition-all duration-200 active:scale-95">
            <Bookmark className="h-3.5 w-3.5" /> Guardar vacante
          </button>
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
    </Layout>
  );
};

export default JobDetail;
