import { useState } from "react";
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
  const [sortBy, setSortBy] = useState<'reciente' | 'az'>('reciente');

  const filtered = jobs.filter((job) => {
    const kw = keyword.toLowerCase();
    const loc = location.toLowerCase();
    const cityName = job.city?.name ?? "";
    const matchesKeyword = !kw || job.title.toLowerCase().includes(kw) || (job.area_catalog?.name ?? job.area ?? "").toLowerCase().includes(kw);
    const matchesLocation = !loc || cityName.toLowerCase().includes(loc);
    const matchesCity = !filters["Ciudad"]?.length || filters["Ciudad"].includes(cityName);
    const matchesCargo = !filters["Tipo de cargo"]?.length || filters["Tipo de cargo"].includes(job.job_type?.name ?? "");
    const matchesArea = !filters["Área de trabajo"]?.length || filters["Área de trabajo"].includes(job.area_catalog?.name ?? "");
    return matchesKeyword && matchesLocation && matchesCity && matchesCargo && matchesArea;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'az') return a.title.localeCompare(b.title);
    // reciente: por date_posted desc
    return new Date(b.date_posted ?? 0).getTime() - new Date(a.date_posted ?? 0).getTime();
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
        <div className="flex items-center gap-2">
          <span className="text-xs font-body text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {sorted.length} {sorted.length === 1 ? "posición" : "posiciones"}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'reciente' | 'az')}
            className="text-xs font-body border border-border rounded-md px-2 py-1.5 bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="reciente">Más reciente</option>
            <option value="az">A → Z</option>
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <SearchX className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-body font-medium text-foreground mb-1">Sin resultados</p>
          <p className="text-xs font-body text-muted-foreground max-w-[200px]">
            Intenta con otros términos o ajusta los filtros
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
