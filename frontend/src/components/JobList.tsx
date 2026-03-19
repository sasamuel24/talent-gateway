import JobCard from "./JobCard";
import { useConvocatorias } from "@/hooks/useConvocatorias";
import { SearchX, Loader2 } from "lucide-react";

interface JobListProps {
  keyword: string;
  location: string;
  filters: Record<string, string[]>;
}

const JobList = ({ keyword, location, filters }: JobListProps) => {
  const { data: jobs = [], isLoading, isError } = useConvocatorias({ status: 'activa' });

  const filtered = jobs.filter((job) => {
    const kw = keyword.toLowerCase();
    const loc = location.toLowerCase();
    const matchesKeyword = !kw || job.title.toLowerCase().includes(kw) || (job.area ?? "").toLowerCase().includes(kw);
    const matchesLocation = !loc || (job.location ?? "").toLowerCase().includes(loc) || (job.department ?? "").toLowerCase().includes(loc);
    const matchesDept = !filters["Departamento"]?.length || filters["Departamento"].includes(job.department ?? "");
    const matchesArea = !filters["Área"]?.length || filters["Área"].includes(job.area ?? "");
    const matchesType = !filters["Tipo de Contrato"]?.length || filters["Tipo de Contrato"].includes(job.type ?? "");
    return matchesKeyword && matchesLocation && matchesDept && matchesArea && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span className="text-sm font-body">Cargando vacantes...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-destructive border border-dashed border-destructive/30 rounded-lg">
        <p className="text-sm font-heading font-bold uppercase tracking-brand">Error al cargar las vacantes</p>
        <p className="text-xs mt-1 font-body text-muted-foreground">Intenta recargar la página</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading font-bold text-base uppercase tracking-brand text-foreground">
          Vacantes Disponibles
        </h2>
        <span className="text-xs font-body text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {filtered.length} {filtered.length === 1 ? "posición" : "posiciones"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-lg">
          <SearchX className="h-10 w-10 mx-auto mb-3 text-primary/30" />
          <p className="text-sm font-heading font-bold uppercase tracking-brand">No se encontraron vacantes</p>
          <p className="text-xs mt-1 font-body">Intenta ajustar tu búsqueda o filtros</p>
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
