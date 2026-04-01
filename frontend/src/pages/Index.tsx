import { useState, useCallback } from "react";
import Layout from "@/components/Layout";
import HeroSearch from "@/components/HeroSearch";
import FiltersPanel from "@/components/FiltersPanel";
import JobList from "@/components/JobList";
import { useConvocatorias } from "@/hooks/useConvocatorias";
import { useCiudades, useTiposCargo, useAreasAdmin } from "@/hooks/useCatalogs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

const Index = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const { data: allJobs = [] } = useConvocatorias({ status: "activa" });
  const { data: ciudades = [] } = useCiudades();
  const { data: tiposCargo = [] } = useTiposCargo();
  const { data: areas = [] } = useAreasAdmin();

  const handleFilterChange = useCallback((group: string, option: string) => {
    setFilters((prev) => {
      const current = prev[group] || [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [group]: next };
    });
  }, []);

  const handleReset = useCallback(() => setFilters({}), []);

  const handleSearch = useCallback(() => {
    // keyword and location already control the filtered list reactively
  }, []);

  return (
    <Layout>
      <HeroSearch
        keyword={keyword}
        location={location}
        onKeywordChange={setKeyword}
        onLocationChange={setLocation}
        onSearch={handleSearch}
      />

      {/* Employer branding strip */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-base text-muted-foreground text-center font-heading font-bold tracking-wide">
            <span className="text-primary">Café</span>{" "}
            <span className="text-primary">del Corazón</span>{" "}
            <span className="text-primary">de Colombia</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros desktop — oculto en móvil */}
          <div className="hidden lg:block w-64 shrink-0">
            <FiltersPanel
              jobs={allJobs}
              ciudades={ciudades}
              tiposCargo={tiposCargo}
              areas={areas}
              selectedFilters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          {/* Sheet de filtros — solo móvil */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetContent side="left" className="w-[300px] p-0 overflow-y-auto">
              <SheetHeader className="px-5 py-4 border-b border-border">
                <SheetTitle className="text-base font-heading flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  Filtros
                </SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <FiltersPanel
                  jobs={allJobs}
                  ciudades={ciudades}
                  tiposCargo={tiposCargo}
                  areas={areas}
                  selectedFilters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 min-w-0">
            {/* Botón filtrar — solo móvil */}
            <div className="lg:hidden flex items-center justify-between mb-3">
              <button
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white text-sm font-body font-medium text-foreground hover:border-primary hover:text-primary transition-all duration-200 shadow-sm"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtrar
                {Object.values(filters).flat().length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                    {Object.values(filters).flat().length}
                  </span>
                )}
              </button>
            </div>

            <JobList keyword={keyword} location={location} filters={filters} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
