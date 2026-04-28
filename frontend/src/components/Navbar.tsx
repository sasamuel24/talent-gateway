import { Menu, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo-cafe-quindio.png";
import { useCandidateAuth } from "@/contexts/CandidateAuthContext";

const navLinks = [
  { label: "Inicio", href: "/", internal: true },
  { label: "Nosotros", href: "https://www.cafequindio.com.co/pages/nosotros", internal: false },
  { label: "Beneficios", href: "https://www.cafequindio.com.co/collections/productos-de-cafe", internal: false },
  { label: "Tiendas", href: "https://www.cafequindio.com.co/pages/tiendas-cafe-quindio", internal: false },
];

const linkCls =
  "relative text-xs font-heading font-700 uppercase tracking-brand transition-colors " +
  "after:absolute after:bottom-[-2px] after:left-0 after:block after:h-0.5 after:w-full " +
  "after:bg-primary after:scale-x-0 hover:after:scale-x-100 " +
  "after:transition-transform after:duration-300 after:origin-left";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { candidate } = useCandidateAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`bg-white/95 backdrop-blur-md border-b-2 border-primary sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={logo}
              alt="Café Quindío"
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((item) =>
              item.internal ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`${linkCls} ${
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkCls} text-muted-foreground hover:text-primary`}
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            {/* Candidate portal button */}
            {candidate ? (
              <Link
                to="/candidato/portal"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 border border-primary text-primary text-xs font-heading font-bold uppercase tracking-brand rounded-full hover:bg-primary hover:text-white transition-all duration-200 active:scale-95"
              >
                <User className="h-3.5 w-3.5" />
                Mi Portal
              </Link>
            ) : (
              <Link
                to="/candidato/login"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 border border-border text-foreground/70 text-xs font-heading font-bold uppercase tracking-brand rounded-full hover:border-primary hover:text-primary transition-all duration-200 active:scale-95"
              >
                <User className="h-3.5 w-3.5" />
                Ingresar
              </Link>
            )}
            <a
              href="https://www.cafequindio.com.co"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center px-5 py-2 bg-primary text-white text-xs font-heading font-bold uppercase tracking-brand rounded-full hover:bg-primary/90 transition-colors active:scale-95 transition-all duration-200"
            >
              Tienda Online
            </a>
            <button
              className="md:hidden text-foreground p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-primary/20 bg-white animate-slide-up">
          {/* Nav links */}
          <div className="px-6 pt-2 pb-4">
            {navLinks.map((item, i) => {
              const isActive = item.internal && location.pathname === item.href;
              const cls =
                `flex items-center justify-between py-4 font-heading text-sm uppercase tracking-brand transition-colors duration-200 border-b border-border/40 last:border-0 ` +
                (isActive ? "text-primary" : "text-foreground/70 hover:text-primary");
              return item.internal ? (
                <Link key={item.label} to={item.href} onClick={() => setMobileOpen(false)} className={cls}>
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </Link>
              ) : (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  <span>{item.label}</span>
                  <svg className="h-3 w-3 text-muted-foreground/50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </a>
              );
            })}
          </div>

          {/* CTA */}
          <div className="px-6 pb-6 space-y-3">
            {candidate ? (
              <Link
                to="/candidato/portal"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 border border-primary text-primary text-xs font-heading font-bold uppercase tracking-brand rounded-xl hover:bg-primary hover:text-white active:scale-95 transition-all duration-200"
              >
                <User className="h-4 w-4" />
                Mi Portal
              </Link>
            ) : (
              <Link
                to="/candidato/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 border border-border text-foreground/70 text-xs font-heading font-bold uppercase tracking-brand rounded-xl hover:border-primary hover:text-primary active:scale-95 transition-all duration-200"
              >
                <User className="h-4 w-4" />
                Ingresar al portal
              </Link>
            )}
            <a
              href="https://www.cafequindio.com.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white text-xs font-heading font-bold uppercase tracking-brand rounded-xl hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-sm shadow-primary/20"
            >
              Tienda Online
            </a>
            <p className="text-center text-[10px] font-body text-muted-foreground/50 mt-4 tracking-wide">
              Café Quindío — Portal de Talento
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
