import { useState, useCallback } from "react";
import Layout from "@/components/Layout";
import HeroSearch from "@/components/HeroSearch";
import FiltersPanel from "@/components/FiltersPanel";
import JobList from "@/components/JobList";

const Index = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});

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
          <p className="text-xs text-muted-foreground text-center font-body">
            <span className="text-primary font-semibold">33 tiendas</span> en Colombia •{" "}
            <span className="text-primary font-semibold">+30 años</span> de tradición cafetera •{" "}
            <span className="text-primary font-semibold">Presencia internacional</span> en Arabia Saudita
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 shrink-0">
            <FiltersPanel
              selectedFilters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
          <div className="flex-1 min-w-0">
            <JobList keyword={keyword} location={location} filters={filters} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
