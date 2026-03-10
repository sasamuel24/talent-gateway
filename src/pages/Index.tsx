import { useState, useCallback } from "react";

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
  const handleSearch = useCallback(() => {}, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSearch
        keyword={keyword}
        location={location}
        onKeywordChange={setKeyword}
        onLocationChange={setLocation}
        onSearch={handleSearch}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 shrink-0">
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
    </div>
  );
};

export default Index;
