import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Briefcase, Share2, Bookmark } from "lucide-react";
import { allJobs } from "@/data/jobs";
import { Button } from "@/components/ui/button";

const JobDetail = () => {
  const { id } = useParams();
  const job = allJobs.find((j) => j.id === Number(id));

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Vacante no encontrada</h1>
          <Link to="/" className="text-primary hover:underline text-sm">
            ← Regresar a la búsqueda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-primary-foreground/80 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {job.location}, {job.department}
            </span>
            <span>|</span>
            <span>{job.refId}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Button size="sm" variant="secondary" className="font-semibold">
              Postularme ahora
            </Button>
            <Button size="sm" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Share2 className="h-4 w-4 mr-1" /> Compartir
            </Button>
            <Button size="sm" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Bookmark className="h-4 w-4 mr-1" /> Guardar
            </Button>
          </div>
          <p className="text-xs text-primary-foreground/60 mt-3">
            <Calendar className="h-3.5 w-3.5 inline mr-1" />
            Publicado el: {job.date}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Regresar a la búsqueda
        </Link>

        {/* Description */}
        <div className="prose prose-sm max-w-none">
          <h2 className="text-xl font-heading font-bold text-foreground mt-6 mb-3">
            NUESTRO COMPROMISO CON LA CALIDAD
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">{job.description}</p>
          <p className="text-foreground font-medium mb-2">
            ¡Muchas gracias por tu interés en la posición de{" "}
            <strong>{job.title}</strong> y querer formar parte de Café Quindío!
          </p>
          <p className="text-muted-foreground mb-6">
            Lo que esperamos de ti como un{" "}
            <strong className="text-foreground">{job.title}</strong> es:
          </p>

          {/* Functions */}
          <h3 className="text-base font-semibold text-primary mt-6 mb-2">Funciones</h3>
          <ul className="list-disc pl-6 space-y-1.5 text-muted-foreground mb-6">
            {job.functions.map((fn, i) => (
              <li key={i}>{fn}</li>
            ))}
          </ul>

          {/* Requirements */}
          <h3 className="text-base font-semibold text-primary mt-6 mb-2">Requisitos</h3>
          <ul className="list-disc pl-6 space-y-1.5 text-muted-foreground mb-6">
            {job.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>

          {/* Ideal Candidate */}
          <h3 className="text-lg font-heading font-bold text-foreground mt-8 mb-3">
            ¿Quién sería nuestro mejor candidato o candidata?
          </h3>
          <div className="space-y-2 text-muted-foreground mb-6">
            {job.idealCandidate.map((item, i) => (
              <p key={i}>
                <strong className="text-foreground">{item.label}:</strong> {item.text}
              </p>
            ))}
          </div>

          {/* CTA */}
          <p className="text-foreground font-bold text-lg mt-8 mb-4">
            ¡Únete a nuestro equipo y forma parte de la mejor experiencia cafetera de Colombia!
          </p>

          <p className="text-xs text-muted-foreground italic mb-8">
            "Recuerda que en Café Quindío no realizamos ningún cobro por aplicar a nuestras
            oportunidades. No te dejes engañar y aplica solo por los medios oficiales."
          </p>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-border">
          <Button className="font-semibold">Postularme ahora</Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-1" /> Compartir
          </Button>
          <Button variant="outline">
            <Bookmark className="h-4 w-4 mr-1" /> Guardar vacante
          </Button>
        </div>

        {/* Talent community */}
        <div className="mt-10 bg-primary rounded-lg p-6 sm:p-8 text-primary-foreground">
          <h3 className="text-lg font-heading font-bold mb-2">
            Únete a nuestra comunidad de talento
          </h3>
          <p className="text-sm text-primary-foreground/80 mb-4">
            En caso de que no encuentres la vacante que estás buscando, déjanos tu Currículum
            para tomarlo en cuenta cuando se abran nuevas oportunidades.
          </p>
          <Button variant="secondary" className="font-semibold">
            Sube tu CV ☁
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
