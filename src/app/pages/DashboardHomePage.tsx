import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import {
  FileText,
  Users,
  ShoppingCart,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { savedQuotations } from "../data/saved-quotations";
import { users } from "../data/users";
import { Badge } from "../components/ui/badge";

export function DashboardHomePage() {
  const { user } = useAuth();

  const getQuotationsByStatus = () => {
    const userQuotations = user?.role === "client" 
      ? savedQuotations.filter(q => q.clientId === user.id)
      : savedQuotations;

    return {
      total: userQuotations.length,
      draft: userQuotations.filter(q => q.status === "draft").length,
      sent: userQuotations.filter(q => q.status === "sent").length,
      accepted: userQuotations.filter(q => q.status === "accepted").length,
      rejected: userQuotations.filter(q => q.status === "rejected").length,
    };
  };

  const stats = getQuotationsByStatus();

  const getRecentQuotations = () => {
    const userQuotations = user?.role === "client" 
      ? savedQuotations.filter(q => q.clientId === user.id)
      : savedQuotations;

    return userQuotations
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const recentQuotations = getRecentQuotations();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary"><Clock className="size-3 mr-1" />Borrador</Badge>;
      case "sent":
        return <Badge variant="default"><FileText className="size-3 mr-1" />Enviada</Badge>;
      case "accepted":
        return <Badge variant="default" className="bg-green-600"><CheckCircle2 className="size-3 mr-1" />Aceptada</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="size-3 mr-1" />Rechazada</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Bienvenido, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === "admin" && "Panel de administración del sistema"}
          {user?.role === "seller" && "Gestiona y crea cotizaciones para tus clientes"}
          {user?.role === "client" && "Revisa tus cotizaciones y solicita nuevas"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Cotizaciones
            </CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.role === "client" ? "Tus cotizaciones" : "En el sistema"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Enviadas
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Esperando respuesta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aceptadas
            </CardTitle>
            <CheckCircle2 className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cotizaciones confirmadas
            </p>
          </CardContent>
        </Card>

        {user?.role === "admin" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Usuarios
              </CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Registrados en el sistema
              </p>
            </CardContent>
          </Card>
        )}

        {user?.role !== "admin" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Borradores
              </CardTitle>
              <Clock className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draft}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Pendientes de enviar
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Quotations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cotizaciones Recientes</CardTitle>
              <CardDescription>
                {user?.role === "client" 
                  ? "Tus últimas cotizaciones solicitadas"
                  : "Últimas cotizaciones del sistema"}
              </CardDescription>
            </div>
            <Link to={user?.role === "client" ? "/dashboard/my-quotes" : "/dashboard/quotations"}>
              <Button variant="outline" size="sm">
                Ver todas
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentQuotations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="size-12 mx-auto mb-2 opacity-50" />
              <p>No hay cotizaciones todavía</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentQuotations.map((quotation) => {
                const client = users.find(u => u.id === quotation.clientId);
                const seller = users.find(u => u.id === quotation.sellerId);
                const subtotal = quotation.items.reduce(
                  (sum, item) => sum + item.product.price * item.quantity,
                  0
                );
                const discountAmount = subtotal * (quotation.discount / 100);
                const subtotalAfterDiscount = subtotal - discountAmount;
                const taxAmount = subtotalAfterDiscount * (quotation.taxRate / 100);
                const total = subtotalAfterDiscount + taxAmount;

                return (
                  <div
                    key={quotation.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{quotation.quotationNumber}</p>
                        {getStatusBadge(quotation.status)}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        {user?.role !== "client" && (
                          <p>Cliente: {client?.name}</p>
                        )}
                        {user?.role === "admin" && (
                          <p>Vendedor: {seller?.name}</p>
                        )}
                        <p className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(quotation.createdAt).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${total.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {quotation.items.length} producto{quotation.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accede rápidamente a las funciones principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(user?.role === "seller" || user?.role === "client") && (
              <Link to="/dashboard/new-quote">
                <Button className="w-full h-20 flex flex-col gap-1" variant="outline">
                  <ShoppingCart className="size-5" />
                  <span>
                    {user?.role === "seller" ? "Nueva Cotización" : "Solicitar Cotización"}
                  </span>
                </Button>
              </Link>
            )}
            {user?.role === "admin" && (
              <>
                <Link to="/dashboard/users">
                  <Button className="w-full h-20 flex flex-col gap-1" variant="outline">
                    <Users className="size-5" />
                    <span>Gestionar Usuarios</span>
                  </Button>
                </Link>
                <Link to="/dashboard/quotations">
                  <Button className="w-full h-20 flex flex-col gap-1" variant="outline">
                    <FileText className="size-5" />
                    <span>Ver Cotizaciones</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
