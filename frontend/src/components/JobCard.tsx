import { MapPin, Calendar, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import type { JobListItem } from "@/hooks/useConvocatorias";

const contractColor: Record<string, string> = {
  "Término Indefinido": "bg-primary/10 text-primary",
  "Término Fijo": "bg-gold/15 text-amber-700",
  "Practicante": "bg-secondary text-secondary-foreground",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const JobCard = ({ job }: { job: JobListItem }) => {
  const contractLabel = job.contract_type?.name ?? job.type;
  const badgeClass = contractColor[contractLabel ?? ""] ?? "bg-muted text-muted-foreground";
  const cityStr = job.city?.name ?? job.location;
  const locationStr = [cityStr, job.department].filter(Boolean).join(", ");
  const areaStr = job.area_catalog?.name ?? job.area;

  return (
    <Link
      to={`/vacante/${job.id}`}
      className="animate-slide-up block bg-card border-l-4 border-l-transparent border border-border rounded-lg px-5 py-4 hover:bg-job-hover hover:border-l-primary hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-heading font-bold text-job-link group-hover:underline uppercase tracking-wide leading-snug">
          {job.title}
        </h3>
        {contractLabel && (
          <span className={`shrink-0 text-xs px-3 py-1 rounded-full font-body font-medium transition-colors duration-150 ${badgeClass}`}>
            {contractLabel}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-body">
        {locationStr && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-primary/60" />
            {locationStr}
          </span>
        )}
        {areaStr && (
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5 text-primary/60" />
            {areaStr}
          </span>
        )}
        {job.date_posted && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-primary/60" />
            {formatDate(job.date_posted)}
          </span>
        )}
      </div>
    </Link>
  );
};

export default JobCard;
