import { Search, MapPin } from "lucide-react";
import heroCoffee from "@/assets/hero-coffee.jpg";

interface HeroSearchProps {
  keyword: string;
  location: string;
  onKeywordChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onSearch: () => void;
}

const HeroSearch = ({ keyword, location, onKeywordChange, onLocationChange, onSearch }: HeroSearchProps) => {
  return (
    <section className="relative h-[400px] md:h-[460px] overflow-hidden">
      <img
        src={heroCoffee}
        alt="Paisaje cafetero del Quindío"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-hero-overlay/65" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <p className="text-sm uppercase tracking-[0.3em] text-hero-text/80 mb-3 font-medium">
          Café Quindío Careers
        </p>
        <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-hero-text mb-3 tracking-tight text-center">
          Trabaja con Nosotros
        </h1>
        <p className="text-hero-text/70 text-base md:text-lg mb-10 text-center max-w-xl">
          Haz parte de un equipo que vive la pasión por el café colombiano
        </p>
        <div className="w-full max-w-3xl bg-card rounded-lg shadow-xl flex flex-col sm:flex-row overflow-hidden">
          <div className="flex-1 flex items-center gap-2 px-4 py-3.5 border-b sm:border-b-0 sm:border-r border-border">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Cargo o palabra clave"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <div className="flex-1 flex items-center gap-2 px-4 py-3.5 border-b sm:border-b-0 sm:border-r border-border">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Ubicación"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <button
            onClick={onSearch}
            className="bg-primary text-primary-foreground px-8 py-3.5 text-sm font-semibold hover:bg-primary/90 transition-colors uppercase tracking-wider"
          >
            Buscar
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
