import { useAuth } from "@/lib/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Template Padrão", url: "/admin/template", icon: Settings },
  { title: "Propostas", url: "/admin/propostas", icon: FileText },
];

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 gradient-primary h-14 flex items-center justify-between px-4">
        <span className="font-display font-bold text-primary-foreground text-lg">Racun</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-primary-foreground">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 gradient-dark flex flex-col transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 hidden md:block">
          <h1 className="font-display text-2xl font-bold text-primary-foreground">Racun</h1>
          <p className="text-primary-foreground/60 text-xs mt-1">Painel Administrativo</p>
        </div>
        <div className="md:hidden h-14" />

        <nav className="flex-1 px-3 space-y-1 mt-4 md:mt-0">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/admin"}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-primary-foreground/70 hover:bg-primary-foreground/10 transition-colors"
              activeClassName="bg-primary-foreground/15 text-primary-foreground font-medium"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen pt-14 md:pt-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
