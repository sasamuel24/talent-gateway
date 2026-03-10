import JobCard from "./JobCard";
import { allJobs } from "@/data/jobs";

interface JobListProps {
  keyword: string;
  location: string;
  filters: Record<string, string[]>;
}

const JobList = ({ keyword, location, filters }: JobListProps) => {
  const filtered = allJobs.filter((job) => {
    const kw = keyword.toLowerCase();
    const loc = location.toLowerCase();
    const matchesKeyword = !kw || job.title.toLowerCase().includes(kw) || job.area.toLowerCase().includes(kw);
    const matchesLocation = !loc || job.location.toLowerCase().includes(loc) || job.department.toLowerCase().includes(loc);
    const matchesDept = !filters["Departamento"]?.length || filters["Departamento"].includes(job.department);
    const matchesArea = !filters["Área"]?.length || filters["Área"].includes(job.area);
    const matchesType = !filters["Tipo de Contrato"]?.length || filters["Tipo de Contrato"].includes(job.type);
    return matchesKeyword && matchesLocation && matchesDept && matchesArea && matchesType;
  });

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-4">
        Vacantes Disponibles
        <span className="text-sm font-normal text-muted-foreground ml-2">
          ({filtered.length} {filtered.length === 1 ? "posición" : "posiciones"})
        </span>
      </h2>
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No se encontraron vacantes</p>
          <p className="text-sm mt-1">Intenta ajustar tu búsqueda o filtros</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
