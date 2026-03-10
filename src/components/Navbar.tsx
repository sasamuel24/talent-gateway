import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="font-heading font-bold text-xl text-foreground italic tracking-tight">
              Café Quindío
            </span>
            <div className="hidden md:flex items-center gap-6">
              {["Inicio", "Nosotros", "Vida en CQ", "Beneficios", "Tiendas"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border px-4 py-4 space-y-3 bg-card">
          {["Inicio", "Nosotros", "Vida en CQ", "Beneficios", "Tiendas"].map((item) => (
            <a key={item} href="#" className="block text-sm text-muted-foreground hover:text-foreground">
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
