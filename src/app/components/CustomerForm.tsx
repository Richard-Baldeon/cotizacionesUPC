import { CustomerInfo } from "../types/quotation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { User } from "lucide-react";

interface CustomerFormProps {
  customer: CustomerInfo | null;
  notes: string;
  onUpdateCustomer: (customer: CustomerInfo) => void;
  onUpdateNotes: (notes: string) => void;
}

export function CustomerForm({
  customer,
  notes,
  onUpdateCustomer,
  onUpdateNotes,
}: CustomerFormProps) {
  const handleChange = (field: keyof CustomerInfo, value: string) => {
    onUpdateCustomer({
      name: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      company: customer?.company || "",
      address: customer?.address || "",
      ...customer,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="size-5" />
          <CardTitle>Información del Cliente</CardTitle>
        </div>
        <CardDescription>
          Completa los datos del cliente para personalizar la cotización
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo *</Label>
            <Input
              id="name"
              value={customer?.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              value={customer?.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="cliente@empresa.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              value={customer?.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              value={customer?.company || ""}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="Nombre de la empresa"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={customer?.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Dirección completa"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notas Adicionales</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            placeholder="Agrega cualquier información adicional relevante para esta cotización..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}
