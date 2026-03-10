import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo-cafe-quindio.png";

const navLinks = [
  { label: "Inicio", href: "/", internal: true },
  { label: "Nosotros", href: "https://www.cafequindio.com.co/pages/nosotros", internal: false },
  { label: "Vida en CQ", href: "https://www.cafequindio.com.co/pages/trabaja-con-nosotros", internal: false },
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
        <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-md px-4 py-4 space-y-3">
          {navLinks.map((item) =>
            item.internal ? (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-heading uppercase tracking-brand text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-heading uppercase tracking-brand text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            )
          )}
          <a
            href="https://www.cafequindio.com.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2 bg-primary text-white text-xs font-heading font-bold uppercase tracking-brand rounded-full hover:bg-primary/90 transition-colors mt-2"
          >
            Tienda Online
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
