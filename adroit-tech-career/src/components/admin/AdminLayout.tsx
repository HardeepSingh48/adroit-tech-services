import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  LogOut,
  Menu,
  ChevronRight,
  ShieldCheck,
  Home,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Employers", path: "/admin/employers", icon: Building2 },
  { name: "User Management", path: "/admin/users", icon: Users },
  { name: "Manage Jobs", path: "/admin/jobs", icon: Briefcase },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Admin Logged Out",
      description: "You have been logged out of the admin console.",
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
                <img src="/assets/logos/ATS shield icon 512.png" alt="Adroit Tech Logo" className="h-8 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold text-primary tracking-wider">
                  Adroit Tech
                </span>
                <span className="text-[10px] text-destructive font-semibold tracking-widest -mt-1">
                  ADMIN CONSOLE
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

            <div className="pt-4 mt-4 border-t border-border/10">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-secondary-foreground/80 hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
              >
                <Home className="h-5 w-5" />
                Return to Site
              </Link>
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border/10">
            <Button
              variant="ghost"
              className="w-full justify-start text-secondary-foreground/80 hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout Admin
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
                Administrator Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-destructive/10 text-destructive font-bold border border-destructive/20">
                Super Admin Mode
              </span>
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center border border-destructive/20">
                <ShieldCheck className="h-5 w-5 text-destructive" />
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

export default AdminLayout;
