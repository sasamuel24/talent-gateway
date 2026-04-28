import { useState, useCallback } from "react";
import Layout from "@/components/Layout";
import HeroSearch from "@/components/HeroSearch";
import FiltersPanel from "@/components/FiltersPanel";
import JobList from "@/components/JobList";
import { useConvocatorias } from "@/hooks/useConvocatorias";
import { useCiudades, useTiposCargo, useAreasAdmin } from "@/hooks/useCatalogs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { useCandidateAuth } from "@/contexts/CandidateAuthContext";
import { Link } from "react-router-dom";

const Index = () => {
  const { candidate } = useCandidateAuth();
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
      {/* Comunidad de talento — solo visible sin sesión */}
      {!candidate && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 sm:p-8 text-white">
            <h3 className="text-base font-heading font-bold uppercase tracking-brand mb-2">
              Únete a nuestra comunidad de talento
            </h3>
            <p className="text-sm text-white/75 mb-5 font-body max-w-lg">
              ¿No encontraste la vacante ideal? Crea tu cuenta y te contactaremos cuando
              surjan nuevas oportunidades que se ajusten a tu perfil.
            </p>
            <Link
              to="/candidato/registro"
              className="inline-flex items-center px-6 py-2.5 bg-white text-primary text-xs font-heading font-bold uppercase tracking-brand rounded-full hover:bg-white/90 transition-all duration-200 active:scale-95"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Index;
