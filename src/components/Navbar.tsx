import { User, UserPlus, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="bg-primary text-primary-foreground text-center text-xs tracking-widest py-2 font-medium uppercase">
        Trabaja con nosotros — Café Quindío
      </div>
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
            <div className="flex items-center gap-4">
              <a href="#" className="hidden sm:flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors items-center gap-1.5">
                <User className="h-4 w-4" />
                Ingresar
              </a>
              <a href="#" className="hidden sm:flex text-sm font-medium text-primary hover:text-primary/80 transition-colors items-center gap-1.5">
                <UserPlus className="h-4 w-4" />
                Crear Perfil
              </a>
              <button
                className="md:hidden text-foreground"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-border px-4 py-4 space-y-3 bg-card">
            {["Inicio", "Nosotros", "Vida en CQ", "Beneficios", "Tiendas"].map((item) => (
              <a key={item} href="#" className="block text-sm text-muted-foreground hover:text-foreground">
                {item}
              </a>
            ))}
            <div className="flex gap-4 pt-2 border-t border-border">
              <a href="#" className="text-sm text-muted-foreground">Ingresar</a>
              <a href="#" className="text-sm text-primary">Crear Perfil</a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
