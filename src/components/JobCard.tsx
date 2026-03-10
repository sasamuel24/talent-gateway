import { MapPin, Calendar, Briefcase } from "lucide-react";

export interface Job {
  id: number;
  title: string;
  location: string;
  department: string;
  area: string;
  type: string;
  date: string;
}

const JobCard = ({ job }: { job: Job }) => {
  return (
    <div className="bg-card border border-border rounded-lg px-5 py-4 hover:bg-job-hover hover:border-primary/30 transition-all cursor-pointer group">
      <h3 className="text-base font-semibold text-job-link group-hover:underline mb-1.5">
        {job.title}
      </h3>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}, {job.department}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5" />
          {job.area}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {job.date}
        </span>
      </div>
    </div>
  );
};

export default JobCard;
