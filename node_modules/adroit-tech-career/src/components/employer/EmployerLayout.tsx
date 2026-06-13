import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Plus,
  Briefcase,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EmployerLayoutProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  { name: "Dashboard", path: "/employer/dashboard", icon: LayoutDashboard },
  { name: "Post Job", path: "/employer/post-job", icon: Plus },
  { name: "Active Jobs", path: "/employer/jobs", icon: Briefcase },
  { name: "Applications", path: "/employer/applications", icon: Users },
  { name: "Settings", path: "/employer/settings", icon: Settings },
];

const EmployerLayout = ({ children }: EmployerLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-secondary/80 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-secondary text-secondary-foreground transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border/10">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-primary tracking-wider">
                  Adroit Tech Services
                </span>
                <span className="text-[10px] text-muted-foreground -mt-1">
                  EMPLOYER PORTAL
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "text-secondary-foreground/80 hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.name}
                {isActive(link.path) && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border/10">
            <Button
              variant="ghost"
              className="w-full justify-start text-secondary-foreground/80 hover:text-primary hover:bg-primary/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <button
              className="lg:hidden p-2 text-foreground hover:bg-muted rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 lg:hidden" />

            <div className="hidden lg:block">
              <h1 className="font-display text-lg font-bold text-foreground">
                Employer Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/employer/post-job">
                <Button variant="cta" size="sm" className="hidden sm:flex">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Button>
              </Link>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default EmployerLayout;
