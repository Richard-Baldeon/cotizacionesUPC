import { useParams, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { savedQuotations } from "../data/saved-quotations";
import { users } from "../data/users";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export function QuotationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const quotation = savedQuotations.find((q) => q.id === id);

  if (!quotation) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4 mr-2" />
          Volver
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="size-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-semibold mb-2">Cotización no encontrada</h2>
            <p className="text-muted-foreground">
              La cotización que buscas no existe o no tienes acceso a ella.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check permissions
  if (
    user?.role === "client" &&
    quotation.clientId !== user.id
  ) {
    navigate("/dashboard");
    return null;
  }

  if (
    user?.role === "seller" &&
    quotation.sellerId !== user.id
  ) {
    navigate("/dashboard");
    return null;
  }

  const client = users.find((u) => u.id === quotation.clientId);
  const seller = users.find((u) => u.id === quotation.sellerId);

  const subtotal = quotation.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = subtotal * (quotation.discount / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = subtotalAfterDiscount * (quotation.taxRate / 100);
  const total = subtotalAfterDiscount + taxAmount;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="secondary" className="text-base py-1 px-3">
            <Clock className="size-4 mr-1" />
            Borrador
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="default" className="text-base py-1 px-3">
            <FileText className="size-4 mr-1" />
            Enviada
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="default" className="bg-green-600 text-base py-1 px-3">
            <CheckCircle2 className="size-4 mr-1" />
            Aceptada
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="text-base py-1 px-3">
            <XCircle className="size-4 mr-1" />
            Rechazada
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleDownload = () => {
    toast.info("Descarga de PDF", {
      description: "En una implementación real, esto generaría un PDF descargable",
    });
  };

  const handleSendEmail = () => {
    toast.info("Enviar por email", {
      description: "En una implementación real, esto enviaría la cotización por correo",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{quotation.quotationNumber}</h1>
            <p className="text-muted-foreground">Detalle de cotización</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <FileText className="size-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="size-4 mr-2" />
            Descargar PDF
          </Button>
          {user?.role !== "client" && (
            <Button onClick={handleSendEmail}>
              <Send className="size-4 mr-2" />
              Enviar al Cliente
            </Button>
          )}
        </div>
      </div>

      {/* Status and Date */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Estado:</span>
              {getStatusBadge(quotation.status)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <span>
                Creada el{" "}
                {new Date(quotation.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Información del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {client && (
              <>
                <div className="flex items-start gap-3">
                  <User className="size-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre</p>
                    <p className="font-medium">{client.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="size-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Correo</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
                {client.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="size-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{client.phone}</p>
                    </div>
                  </div>
                )}
                {client.company && (
                  <div className="flex items-start gap-3">
                    <Building className="size-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Empresa</p>
                      <p className="font-medium">{client.company}</p>
                    </div>
                  </div>
                )}
                {quotation.customer?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="size-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{quotation.customer.address}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Seller Information */}
        {user?.role === "admin" && seller && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Vendedor Asignado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="size-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{seller.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="size-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Correo</p>
                  <p className="font-medium">{seller.email}</p>
                </div>
              </div>
              {seller.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="size-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{seller.phone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Products/Services */}
      <Card>
        <CardHeader>
          <CardTitle>Productos y Servicios</CardTitle>
          <CardDescription>
            {quotation.items.length} producto{quotation.items.length !== 1 ? "s" : ""}{" "}
            incluido{quotation.items.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotation.items.map((item, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-grow">
                    <h4 className="font-semibold">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.product.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">
                        Cantidad: <span className="font-medium">{item.quantity}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Precio unitario:{" "}
                        <span className="font-medium">
                          ${item.product.price.toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right sm:text-left">
                    <p className="text-sm text-muted-foreground">Subtotal</p>
                    <p className="text-xl font-bold">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Financiero</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${subtotal.toLocaleString()}</span>
            </div>
            {quotation.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Descuento ({quotation.discount}%):</span>
                <span className="font-medium">-${discountAmount.toLocaleString()}</span>
              </div>
            )}
            {quotation.taxRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  IGV ({quotation.taxRate}%):
                </span>
                <span className="font-medium">${taxAmount.toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-3xl font-bold text-primary">
                ${total.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-right">USD</p>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {quotation.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{quotation.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Terms and Conditions */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Términos y Condiciones</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1">
          <p>• Esta cotización es válida por 30 días desde la fecha de emisión.</p>
          <p>• Los precios están expresados en dólares estadounidenses (USD).</p>
          <p>• El tiempo de entrega será acordado al confirmar el pedido.</p>
          <p>• Se requiere un anticipo del 50% para iniciar el proyecto.</p>
        </CardContent>
      </Card>
    </div>
  );
}