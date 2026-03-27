import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Brain,
  Database,
  ChevronDown,
  ArrowLeft,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Convocatorias", path: "/admin/convocatorias", icon: Briefcase },
  { label: "Candidatos", path: "/admin/candidatos", icon: Users },
  { label: "Entrenamiento IA", path: "/admin/ia", icon: Brain },
  { label: "Catálogos", path: "/admin/catalogos", icon: Database },
];

const breadcrumbLabels: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/convocatorias": "Convocatorias",
  "/admin/convocatorias/nueva": "Nueva convocatoria",
  "/admin/candidatos": "Candidatos",
  "/admin/ia": "Entrenamiento IA",
  "/admin/catalogos": "Catálogos",
};

function getBreadcrumb(pathname: string): string {
  if (breadcrumbLabels[pathname]) return breadcrumbLabels[pathname];
  if (pathname.includes("/editar")) return "Editar convocatoria";
  return "Admin";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  recruiter: "Reclutador",
  viewer: "Visualizador",
};

function getRoleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

/**
 * Returns the first letter of the first two words in a full name.
 * e.g. "Valentina Ospina" → "VO", "Ana" → "A"
 */
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const displayName = user?.name ?? "";
  const initials = getInitials(displayName);
  // Short name for the header button: first name + first letter of last name
  const shortName = (() => {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1][0].toUpperCase()}.`;
  })();
  const roleLabel = getRoleLabel(user?.role ?? "");

  const currentLabel = getBreadcrumb(location.pathname);

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center font-heading font-bold text-white text-sm">
            CQ
          </div>
          <div>
            <p className="font-heading font-bold text-white text-sm leading-tight">
              Café Quindío
            </p>
            <Badge className="mt-0.5 bg-white/20 text-white border-0 text-[10px] px-1.5 py-0 h-4">
              Panel Admin
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/20 space-y-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver portal público
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {displayName}
            </p>
            <p className="text-white/60 text-xs truncate">
              {roleLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex flex-col w-64 h-full bg-primary">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 h-14 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1 rounded text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-primary font-medium">Admin</span>
              {currentLabel !== "Dashboard" && (
                <>
                  <span>/</span>
                  <span className="text-foreground font-medium">
                    {currentLabel}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                >
                  <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {initials}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {shortName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => navigate("/admin/configuracion")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
