import { Globe, User, UserPlus } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="font-heading font-bold text-xl text-foreground tracking-tight">
              TalentHub
            </span>
            <div className="hidden md:flex items-center gap-6">
              {["Home", "About Us", "Life Here", "Benefits"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </a>
            <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Profile</span>
            </a>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">EN</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
