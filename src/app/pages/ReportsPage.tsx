import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { savedQuotations } from "../data/saved-quotations";
import { users } from "../data/users";
import { BarChart3, TrendingUp, DollarSign, Users, FileText } from "lucide-react";

export function ReportsPage() {
  const getTotalRevenue = () => {
    return savedQuotations
      .filter(q => q.status === "accepted")
      .reduce((sum, quotation) => {
        const subtotal = quotation.items.reduce(
          (s, item) => s + item.product.price * item.quantity,
          0
        );
        const discountAmount = subtotal * (quotation.discount / 100);
        const subtotalAfterDiscount = subtotal - discountAmount;
        const taxAmount = subtotalAfterDiscount * (quotation.taxRate / 100);
        return sum + subtotalAfterDiscount + taxAmount;
      }, 0);
  };

  const getConversionRate = () => {
    const total = savedQuotations.filter(q => q.status !== "draft").length;
    const accepted = savedQuotations.filter(q => q.status === "accepted").length;
    return total > 0 ? ((accepted / total) * 100).toFixed(1) : "0.0";
  };

  const getTopSeller = () => {
    const sellerStats = savedQuotations
      .filter(q => q.status === "accepted")
      .reduce((acc, q) => {
        acc[q.sellerId] = (acc[q.sellerId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topSellerId = Object.entries(sellerStats)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    return users.find(u => u.id === topSellerId);
  };

  const stats = {
    totalRevenue: getTotalRevenue(),
    conversionRate: getConversionRate(),
    totalQuotations: savedQuotations.length,
    activeClients: users.filter(u => u.role === "client").length,
    topSeller: getTopSeller(),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reportes y Estadísticas</h1>
        <p className="text-muted-foreground mt-1">
          Análisis general del sistema de cotizaciones
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Aceptados
            </CardTitle>
            <DollarSign className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              De cotizaciones aceptadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Conversión
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cotizaciones aceptadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Cotizaciones
            </CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuotations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              En el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Activos
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performer */}
      {stats.topSeller && (
        <Card>
          <CardHeader>
            <CardTitle>Mejor Vendedor</CardTitle>
            <CardDescription>
              Vendedor con más cotizaciones aceptadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-primary text-primary-foreground p-3 rounded-full">
                <BarChart3 className="size-6" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.topSeller.name}</p>
                <p className="text-sm text-muted-foreground">{stats.topSeller.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen por Estado</CardTitle>
          <CardDescription>
            Distribución de cotizaciones según su estado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { status: "draft", label: "Borradores", color: "bg-gray-500" },
              { status: "sent", label: "Enviadas", color: "bg-blue-500" },
              { status: "accepted", label: "Aceptadas", color: "bg-green-600" },
              { status: "rejected", label: "Rechazadas", color: "bg-red-600" },
            ].map(({ status, label, color }) => {
              const count = savedQuotations.filter(q => q.status === status).length;
              const percentage = (count / savedQuotations.length) * 100 || 0;
              
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`${color} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
