import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FilterGroup {
  label: string;
  options: { name: string; count: number }[];
}

const filterGroups: FilterGroup[] = [
  {
    label: "País",
    options: [
      { name: "Colombia", count: 34 },
      { name: "Ecuador", count: 8 },
      { name: "Estados Unidos", count: 5 },
    ],
  },
  {
    label: "Departamento",
    options: [
      { name: "Quindío", count: 18 },
      { name: "Bogotá D.C.", count: 12 },
      { name: "Valle del Cauca", count: 7 },
      { name: "Antioquia", count: 5 },
    ],
  },
  {
    label: "Área",
    options: [
      { name: "Producción", count: 14 },
      { name: "Tiendas", count: 11 },
      { name: "Logística", count: 8 },
      { name: "Marketing", count: 6 },
      { name: "Administración", count: 5 },
      { name: "Recursos Humanos", count: 3 },
    ],
  },
  {
    label: "Tipo de Contrato",
    options: [
      { name: "Término Indefinido", count: 32 },
      { name: "Término Fijo", count: 10 },
      { name: "Practicante", count: 5 },
    ],
  },
];

interface FiltersPanelProps {
  selectedFilters: Record<string, string[]>;
  onFilterChange: (group: string, option: string) => void;
  onReset: () => void;
}

const FiltersPanel = ({ selectedFilters, onFilterChange, onReset }: FiltersPanelProps) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(filterGroups.map((g) => [g.label, true]))
  );

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const hasFilters = Object.values(selectedFilters).some((v) => v.length > 0);

  return (
    <aside className="bg-filter-bg rounded-lg border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-bold text-lg text-foreground">Filtros</h2>
        {hasFilters && (
          <button onClick={onReset} className="text-sm text-primary hover:underline font-medium">
            Limpiar
          </button>
        )}
      </div>
      <div className="space-y-5">
        {filterGroups.map((group) => (
          <div key={group.label}>
            <button
              onClick={() => toggleGroup(group.label)}
              className="flex items-center justify-between w-full text-sm font-semibold text-foreground mb-2"
            >
              {group.label}
              {openGroups[group.label] ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {openGroups[group.label] && (
              <div className="space-y-2">
                {group.options.map((opt) => {
                  const checked = selectedFilters[group.label]?.includes(opt.name) ?? false;
                  return (
                    <label key={opt.name} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onFilterChange(group.label, opt.name)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-ring accent-primary"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {opt.name} ({opt.count})
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
