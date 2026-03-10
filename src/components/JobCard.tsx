import { MapPin, Calendar, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import type { Job } from "@/data/jobs";

const contractColor: Record<string, string> = {
  "Término Indefinido": "bg-primary/10 text-primary",
  "Término Fijo": "bg-gold/15 text-amber-700",
  "Practicante": "bg-secondary text-secondary-foreground",
};

const JobCard = ({ job }: { job: Job }) => {
  const badgeClass = contractColor[job.type] ?? "bg-muted text-muted-foreground";

  return (
    <Link
      to={`/vacante/${job.id}`}
      className="animate-slide-up block bg-card border-l-4 border-l-transparent border border-border rounded-lg px-5 py-4 hover:bg-job-hover hover:border-l-primary hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-heading font-bold text-job-link group-hover:underline uppercase tracking-wide leading-snug">
          {job.title}
        </h3>
        <span className={`shrink-0 text-xs px-3 py-1 rounded-full font-body font-medium transition-colors duration-150 ${badgeClass}`}>
          {job.type}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-body">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-primary/60" />
          {job.location}, {job.department}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5 text-primary/60" />
          {job.area}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-primary/60" />
          {job.date}
        </span>
      </div>
    </Link>
  );
};

export default JobCard;
