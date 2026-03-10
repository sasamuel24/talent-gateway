import JobCard, { type Job } from "./JobCard";

const allJobs: Job[] = [
  { id: 1, title: "Barista – Tienda Parque del Café", location: "Montenegro", department: "Quindío", area: "Tiendas", type: "Término Indefinido", date: "08/03/2026" },
  { id: 2, title: "Coordinador de Producción", location: "Armenia", department: "Quindío", area: "Producción", type: "Término Indefinido", date: "06/03/2026" },
  { id: 3, title: "Analista de Marketing Digital", location: "Bogotá", department: "Bogotá D.C.", area: "Marketing", type: "Término Indefinido", date: "05/03/2026" },
  { id: 4, title: "Supervisor de Logística", location: "Cali", department: "Valle del Cauca", area: "Logística", type: "Término Indefinido", date: "04/03/2026" },
  { id: 5, title: "Ingeniero de Procesos", location: "Armenia", department: "Quindío", area: "Producción", type: "Término Indefinido", date: "03/03/2026" },
  { id: 6, title: "Auxiliar Administrativo", location: "Bogotá", department: "Bogotá D.C.", area: "Administración", type: "Término Fijo", date: "01/03/2026" },
  { id: 7, title: "Practicante de Recursos Humanos", location: "Armenia", department: "Quindío", area: "Recursos Humanos", type: "Practicante", date: "28/02/2026" },
  { id: 8, title: "Barista – Tienda Centro Comercial", location: "Medellín", department: "Antioquia", area: "Tiendas", type: "Término Indefinido", date: "26/02/2026" },
  { id: 9, title: "Analista de Calidad", location: "Armenia", department: "Quindío", area: "Producción", type: "Término Indefinido", date: "24/02/2026" },
  { id: 10, title: "Jefe de Tienda", location: "Bogotá", department: "Bogotá D.C.", area: "Tiendas", type: "Término Indefinido", date: "22/02/2026" },
  { id: 11, title: "Conductor de Distribución", location: "Cali", department: "Valle del Cauca", area: "Logística", type: "Término Indefinido", date: "20/02/2026" },
  { id: 12, title: "Community Manager", location: "Bogotá", department: "Bogotá D.C.", area: "Marketing", type: "Término Fijo", date: "18/02/2026" },
  { id: 13, title: "Operario de Tostión", location: "Armenia", department: "Quindío", area: "Producción", type: "Término Indefinido", date: "15/02/2026" },
  { id: 14, title: "Practicante de Logística", location: "Armenia", department: "Quindío", area: "Logística", type: "Practicante", date: "12/02/2026" },
  { id: 15, title: "Ejecutivo Comercial", location: "Medellín", department: "Antioquia", area: "Administración", type: "Término Indefinido", date: "10/02/2026" },
];

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
