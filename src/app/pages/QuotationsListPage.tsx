import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { savedQuotations } from "../data/saved-quotations";
import { users } from "../data/users";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search, Calendar, Eye, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router";

export function QuotationsListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredQuotations = savedQuotations.filter((quotation) => {
    // Filter by user role
    if (user?.role === "client" && quotation.clientId !== user.id) {
      return false;
    }
    if (user?.role === "seller" && quotation.sellerId !== user.id) {
      return false;
    }

    // Filter by search query
    const query = searchQuery.toLowerCase();
    const client = users.find(u => u.id === quotation.clientId);
    const matchesSearch = 
      quotation.quotationNumber.toLowerCase().includes(query) ||
      client?.name.toLowerCase().includes(query) ||
      client?.company?.toLowerCase().includes(query);

    // Filter by status
    const matchesStatus = statusFilter === "all" || quotation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
      <div>
        <h1 className="text-3xl font-bold">
          {user?.role === "client" ? "Mis Cotizaciones" : "Cotizaciones"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === "client" 
            ? "Revisa el estado de tus cotizaciones solicitadas"
            : user?.role === "seller"
            ? "Gestiona las cotizaciones que has creado"
            : "Todas las cotizaciones del sistema"}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, cliente o empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="sent">Enviada</SelectItem>
                <SelectItem value="accepted">Aceptada</SelectItem>
                <SelectItem value="rejected">Rechazada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Cotizaciones</CardTitle>
          <CardDescription>
            {filteredQuotations.length} cotización{filteredQuotations.length !== 1 ? "es" : ""} encontrada{filteredQuotations.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Cotización</TableHead>
                  {user?.role !== "client" && <TableHead>Cliente</TableHead>}
                  {user?.role === "admin" && <TableHead>Vendedor</TableHead>}
                  <TableHead>Estado</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No se encontraron cotizaciones
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuotations.map((quotation) => {
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
                      <TableRow key={quotation.id}>
                        <TableCell className="font-medium">
                          {quotation.quotationNumber}
                        </TableCell>
                        {user?.role !== "client" && (
                          <TableCell>
                            <div>
                              <p className="font-medium">{client?.name}</p>
                              {client?.company && (
                                <p className="text-sm text-muted-foreground">
                                  {client.company}
                                </p>
                              )}
                            </div>
                          </TableCell>
                        )}
                        {user?.role === "admin" && (
                          <TableCell>
                            <p className="text-sm">{seller?.name}</p>
                          </TableCell>
                        )}
                        <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {quotation.items.length} producto{quotation.items.length !== 1 ? "s" : ""}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="font-bold">${total.toLocaleString()}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(quotation.createdAt).toLocaleDateString("es-ES")}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/dashboard/quotation/${quotation.id}`)}
                          >
                            <Eye className="size-4 mr-1" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}