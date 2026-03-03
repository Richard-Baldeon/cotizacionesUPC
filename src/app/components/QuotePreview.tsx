import { QuotationData } from "../types/quotation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { FileText, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

interface QuotePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotation: QuotationData;
  onSuccess?: () => void;
}

export function QuotePreview({ open, onOpenChange, quotation, onSuccess }: QuotePreviewProps) {
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);

  const subtotal = quotation.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = subtotal * (quotation.discount / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = subtotalAfterDiscount * (quotation.taxRate / 100);
  const total = subtotalAfterDiscount + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // En una implementación real, aquí generarías un PDF
    toast.success("PDF generado", {
      description: "En una implementación real, esto descargaría el PDF de la cotización",
    });
  };

  const handleEmailClick = () => {
    setShowEmailConfirm(true);
  };

  const handleEmailConfirm = () => {
    setShowEmailConfirm(false);
    toast.success("Correo enviado con éxito", {
      description: `La cotización ha sido enviada a ${quotation.customer?.email}`,
    });
    onOpenChange(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Vista Previa de Cotización
            </DialogTitle>
            <DialogDescription>
              Revisa los detalles antes de enviar o descargar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">COTIZACIÓN</h2>
              <p className="text-sm text-muted-foreground">
                Fecha: {new Date().toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                Cotización N°: COT-{Date.now().toString().slice(-6)}
              </p>
            </div>

            <Separator />

            {/* Customer Info */}
            {quotation.customer && (
              <div className="space-y-2">
                <h3 className="font-semibold">Cliente</h3>
                <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Nombre:</span> {quotation.customer.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {quotation.customer.email}
                  </p>
                  <p>
                    <span className="font-medium">Teléfono:</span> {quotation.customer.phone}
                  </p>
                  {quotation.customer.company && (
                    <p>
                      <span className="font-medium">Empresa:</span>{" "}
                      {quotation.customer.company}
                    </p>
                  )}
                  {quotation.customer.address && (
                    <p>
                      <span className="font-medium">Dirección:</span>{" "}
                      {quotation.customer.address}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Items */}
            <div className="space-y-2">
              <h3 className="font-semibold">Productos/Servicios</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-medium">Descripción</th>
                      <th className="text-center p-3 font-medium">Cantidad</th>
                      <th className="text-right p-3 font-medium">Precio Unit.</th>
                      <th className="text-right p-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.items.map((item) => (
                      <tr key={item.product.id} className="border-t">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.product.description}
                            </p>
                          </div>
                        </td>
                        <td className="text-center p-3">{item.quantity}</td>
                        <td className="text-right p-3">
                          ${item.product.price.toLocaleString()}
                        </td>
                        <td className="text-right p-3">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="ml-auto max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                {quotation.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento ({quotation.discount}%):</span>
                    <span>-${discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {quotation.taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      IGV ({quotation.taxRate}%):
                    </span>
                    <span>${taxAmount.toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">${total.toLocaleString()} USD</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {quotation.notes && (
              <div className="space-y-2">
                <h3 className="font-semibold">Notas</h3>
                <div className="bg-muted p-4 rounded-lg text-sm">
                  <p className="whitespace-pre-wrap">{quotation.notes}</p>
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
              <p className="font-medium">Términos y Condiciones:</p>
              <p>• Esta cotización es válida por 30 días desde la fecha de emisión.</p>
              <p>• Los precios están expresados en dólares estadounidenses (USD).</p>
              <p>• El tiempo de entrega será acordado al confirmar el pedido.</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button onClick={handlePrint} variant="outline" className="flex-1">
                <Download className="size-4 mr-2" />
                Imprimir
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <FileText className="size-4 mr-2" />
                Descargar PDF
              </Button>
              <Button onClick={handleEmailClick} className="flex-1">
                <Mail className="size-4 mr-2" />
                Enviar por Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Confirmation */}
      <ConfirmDialog
        open={showEmailConfirm}
        onOpenChange={setShowEmailConfirm}
        onConfirm={handleEmailConfirm}
        title="¿Enviar cotización?"
        description={`¿Estás seguro que deseas enviar esta cotización a ${quotation.customer?.email}?`}
        confirmText="Sí, enviar"
        cancelText="Cancelar"
      />
    </>
  );
}