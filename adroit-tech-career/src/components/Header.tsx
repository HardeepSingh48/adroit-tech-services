import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Phone, Shield, ChevronDown, User, Briefcase, LogIn } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Main Website", path: "/", isExternal: true },
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-secondary shadow-lg">
      <div className="container flex h-16 md:h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <div className="relative">
            <Shield className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg md:text-2xl font-bold text-primary-foreground tracking-wider">
              Adroit Tech
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground -mt-1">
              Services
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => 
            link.isExternal ? (
              <a
                key={link.name}
                href={link.path}
                className="font-medium transition-colors hover:text-primary text-secondary-foreground"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-primary ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-secondary-foreground"
                }`}
              >
                {link.name}
              </Link>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:+911234567890"
            className="flex items-center gap-2 text-secondary-foreground hover:text-primary transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">+91 1234567890</span>
          </a>
          
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-secondary-foreground hover:text-primary">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="cta" size="lg">
                Register Now
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <DropdownMenuItem asChild>
                <Link to="/register/jobseeker" className="flex items-center cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Register as Job Seeker
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/register/employer" className="flex items-center cursor-pointer">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Register as Employer
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-secondary-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-border/20 animate-slide-up">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => 
              link.isExternal ? (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 px-4 rounded-lg font-medium transition-colors text-secondary-foreground hover:bg-secondary/80"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
            <div className="pt-4 border-t border-border/20 mt-2 space-y-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="lg" className="w-full text-secondary-foreground border-secondary-foreground/30">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link to="/register/jobseeker" onClick={() => setIsMenuOpen(false)}>
                <Button variant="cta" size="lg" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Register as Job Seeker
                </Button>
              </Link>
              <Link to="/register/employer" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ctaSecondary" size="lg" className="w-full">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Register as Employer
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
