import { Search, MapPin } from "lucide-react";
import heroCoffee from "@/assets/hero-portada.jpg";

interface HeroSearchProps {
  keyword: string;
  location: string;
  onKeywordChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onSearch: () => void;
}

const HeroSearch = ({ keyword, location, onKeywordChange, onLocationChange, onSearch }: HeroSearchProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <section className="relative h-[420px] md:h-[480px] overflow-hidden">
      <img
        src={heroCoffee}
        alt="Paisaje cafetero del Quindío"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      {/* Gradient overlay matching brand dark #1C1C1C */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/70" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Eyebrow */}
        <p className="text-xs uppercase tracking-brand text-white/75 mb-3 font-heading font-semibold drop-shadow-md">
          Café Quindío Careers
        </p>

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-3 tracking-tight text-center uppercase drop-shadow-lg">
          Trabaja con Nosotros
        </h1>

        {/* Sub-heading */}
        <p className="text-white/70 text-sm md:text-base mb-10 text-center max-w-lg font-body drop-shadow-md">
          Haz parte de un equipo que vive la pasión por el café colombiano
        </p>

        {/* Search bar */}
        <div className="w-full max-w-3xl bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row overflow-hidden border border-white/20">
          <div className="flex-1 flex items-center gap-2 px-5 py-3.5 border-b sm:border-b-0 sm:border-r border-gray-200">
            <Search className="h-4 w-4 text-primary shrink-0" />
            <input
              type="text"
              placeholder="Cargo o palabra clave"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-body focus:ring-0 transition-all duration-200"
            />
          </div>
          <div className="flex-1 flex items-center gap-2 px-5 py-3.5 border-b sm:border-b-0 sm:border-r border-gray-200">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <input
              type="text"
              placeholder="Ciudad o departamento"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-body focus:ring-0 transition-all duration-200"
            />
          </div>
          <button
            onClick={onSearch}
            className="bg-primary text-white px-8 py-4 sm:py-3.5 text-xs font-heading font-bold hover:bg-primary/90 uppercase tracking-brand rounded-b-2xl sm:rounded-none sm:rounded-r-full active:scale-95 transition-all duration-200"
          >
            Buscar
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
