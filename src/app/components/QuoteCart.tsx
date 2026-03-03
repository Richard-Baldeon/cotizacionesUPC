import { QuoteItem } from "../types/quotation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface QuoteCartProps {
  items: QuoteItem[];
  discount: number;
  taxRate: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onUpdateDiscount: (discount: number) => void;
  onUpdateTaxRate: (taxRate: number) => void;
}

export function QuoteCart({
  items,
  discount,
  taxRate,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateDiscount,
  onUpdateTaxRate,
}: QuoteCartProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = subtotal * (discount / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = subtotalAfterDiscount * (taxRate / 100);
  const total = subtotalAfterDiscount + taxAmount;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShoppingCart className="size-5" />
          <CardTitle>Cotización Actual</CardTitle>
        </div>
        <CardDescription>
          {items.length === 0
            ? "No hay productos seleccionados"
            : `${items.length} producto${items.length !== 1 ? "s" : ""} seleccionado${items.length !== 1 ? "s" : ""}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="size-12 mx-auto mb-2 opacity-50" />
            <p>Agrega productos para comenzar tu cotización</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-grow min-w-0">
                      <p className="font-medium text-sm leading-tight">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${item.product.price.toLocaleString()} c/u
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="shrink-0 h-8 w-8 p-0"
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateQuantity(
                          item.product.id,
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      className="h-8 w-16 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="size-3.5" />
                    </Button>
                    <div className="ml-auto font-medium">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Descuento (%)</label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) =>
                    onUpdateDiscount(
                      Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))
                    )
                  }
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">IGV / Impuesto (%)</label>
                <Input
                  type="number"
                  value={taxRate}
                  onChange={(e) =>
                    onUpdateTaxRate(
                      Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))
                    )
                  }
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="18"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Descuento ({discount}%)</span>
                  <span>-${discountAmount.toLocaleString()}</span>
                </div>
              )}
              {taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IGV ({taxRate}%)</span>
                  <span>${taxAmount.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold">Total</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${total.toLocaleString()}
                  </div>
                  <Badge variant="secondary" className="mt-1">
                    USD
                  </Badge>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}