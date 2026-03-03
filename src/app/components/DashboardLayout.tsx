import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import {
  Calculator,
  LogOut,
  User,
  FileText,
  Users,
  BarChart3,
  Home,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.info("Sesión cerrada", {
      description: "Has cerrado sesión correctamente",
    });
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">Administrador</Badge>;
      case "seller":
        return <Badge variant="default">Vendedor</Badge>;
      case "client":
        return <Badge variant="secondary">Cliente</Badge>;
      default:
        return null;
    }
  };

  const getNavItems = () => {
    const items = [
      { path: "/dashboard", label: "Inicio", icon: Home, roles: ["admin", "seller", "client"] },
    ];

    if (user?.role === "admin") {
      items.push(
        { path: "/dashboard/users", label: "Usuarios", icon: Users, roles: ["admin"] },
        { path: "/dashboard/quotations", label: "Cotizaciones", icon: FileText, roles: ["admin"] },
        { path: "/dashboard/reports", label: "Reportes", icon: BarChart3, roles: ["admin"] }
      );
    }

    if (user?.role === "seller") {
      items.push(
        { path: "/dashboard/quotations", label: "Cotizaciones", icon: FileText, roles: ["seller"] },
        { path: "/dashboard/new-quote", label: "Nueva Cotización", icon: ShoppingCart, roles: ["seller"] }
      );
    }

    if (user?.role === "client") {
      items.push(
        { path: "/dashboard/my-quotes", label: "Mis Cotizaciones", icon: FileText, roles: ["client"] },
        { path: "/dashboard/new-quote", label: "Solicitar Cotización", icon: ShoppingCart, roles: ["client"] }
      );
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <Calculator className="size-5" />
                </div>
                <span className="font-bold text-lg hidden sm:inline">
                  Sistema de Cotizaciones
                </span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className="gap-2"
                      >
                        <Icon className="size-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="size-8">
                    <AvatarFallback>
                      {user ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-2">
                    <span>Mi Cuenta</span>
                    {user && getRoleBadge(user.role)}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="size-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="size-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center gap-1 mt-3 overflow-x-auto pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2 whitespace-nowrap"
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
