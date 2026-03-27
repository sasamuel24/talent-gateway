import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { useState, useMemo } from "react";
import type { JobListItem } from "@/hooks/useConvocatorias";
import type { CatalogItem } from "@/hooks/useCatalogs";

const FILTER_LABELS = ["Ciudad", "Tipo de cargo", "Área de trabajo"];

interface FiltersPanelProps {
  jobs: JobListItem[];
  ciudades: CatalogItem[];
  tiposCargo: CatalogItem[];
  areas: CatalogItem[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (group: string, option: string) => void;
  onReset: () => void;
}

const FiltersPanel = ({ jobs, ciudades, tiposCargo, areas, selectedFilters, onFilterChange, onReset }: FiltersPanelProps) => {
  const filterGroups = useMemo(() => {
    const count = (values: (string | null)[]) =>
      values.reduce<Record<string, number>>((acc, v) => {
        if (v) acc[v] = (acc[v] ?? 0) + 1;
        return acc;
      }, {});

    const cityCount = count(jobs.map((j) => j.city?.name ?? null));
    const cargoCount = count(jobs.map((j) => j.job_type?.name ?? null));
    const areaCount = count(jobs.map((j) => j.area_catalog?.name ?? null));

    return [
      {
        label: "Ciudad",
        options: ciudades
          .filter((c) => c.is_active)
          .map((c) => ({ name: c.name, count: cityCount[c.name] ?? 0 }))
          .sort((a, b) => b.count - a.count),
      },
      {
        label: "Tipo de cargo",
        options: tiposCargo
          .filter((t) => t.is_active)
          .map((t) => ({ name: t.name, count: cargoCount[t.name] ?? 0 }))
          .sort((a, b) => b.count - a.count),
      },
      {
        label: "Área de trabajo",
        options: areas
          .filter((a) => a.is_active)
          .map((a) => ({ name: a.name, count: areaCount[a.name] ?? 0 }))
          .sort((a, b) => b.count - a.count),
      },
    ];
  }, [jobs, ciudades, tiposCargo, areas]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(FILTER_LABELS.map((l) => [l, true]))
  );

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const hasFilters = Object.values(selectedFilters).some((v) => v.length > 0);
  const totalSelected = Object.values(selectedFilters).reduce((acc, v) => acc + v.length, 0);

  return (
    <aside className="bg-filter-bg rounded-lg border border-border p-5 sticky top-20">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="font-heading font-bold text-sm uppercase tracking-brand text-foreground">
            Filtros
          </h2>
          {totalSelected > 0 && (
            <span className="text-xs bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {totalSelected}
            </span>
          )}
        </div>
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-xs text-primary hover:underline font-heading font-semibold uppercase tracking-brand"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-5">
        {filterGroups.map((group) => (
          <div key={group.label} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
            <button
              onClick={() => toggleGroup(group.label)}
              className="flex items-center justify-between w-full text-xs font-heading font-bold uppercase tracking-brand text-foreground mb-3"
            >
              {group.label}
              {openGroups[group.label] ? (
                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
            {openGroups[group.label] && (
              <div className="space-y-2.5">
                {group.options.map((opt) => {
                  const checked = selectedFilters[group.label]?.includes(opt.name) ?? false;
                  return (
                    <label key={opt.name} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onFilterChange(group.label, opt.name)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-ring accent-primary shrink-0"
                      />
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-body flex-1">
                        {opt.name}
                      </span>
                      <span className="text-xs text-muted-foreground/60 font-body">
                        {opt.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default FiltersPanel;
