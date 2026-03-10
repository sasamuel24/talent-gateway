import { Search, MapPin } from "lucide-react";
import heroMosaic from "@/assets/hero-mosaic.jpg";

interface HeroSearchProps {
  keyword: string;
  location: string;
  onKeywordChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onSearch: () => void;
}

const HeroSearch = ({ keyword, location, onKeywordChange, onLocationChange, onSearch }: HeroSearchProps) => {
  return (
    <section className="relative h-[380px] md:h-[420px] overflow-hidden">
      <img
        src={heroMosaic}
        alt="Our diverse team of professionals"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-hero-overlay/75" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-hero-text mb-10 tracking-tight">
          Job Opportunities
        </h1>
        <div className="w-full max-w-3xl bg-card rounded-lg shadow-xl flex flex-col sm:flex-row overflow-hidden">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 border-b sm:border-b-0 sm:border-r border-border">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Enter a job title or keyword"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <div className="flex-1 flex items-center gap-2 px-4 py-3 border-b sm:border-b-0 sm:border-r border-border">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <button
            onClick={onSearch}
            className="bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
