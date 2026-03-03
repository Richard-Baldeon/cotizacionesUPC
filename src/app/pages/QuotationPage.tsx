import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Product, QuoteItem, CustomerInfo, QuotationData } from "../types/quotation";
import { products } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { QuoteCart } from "../components/QuoteCart";
import { CustomerForm } from "../components/CustomerForm";
import { QuotePreview } from "../components/QuotePreview";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Calculator,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export function QuotationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState<QuotationData>({
    items: [],
    customer: null,
    discount: 0,
    taxRate: 18, // IGV Peru
    notes: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToQuote = (product: Product) => {
    const existingItem = quotation.items.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      setQuotation({
        ...quotation,
        items: quotation.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
      toast.success(`Cantidad de "${product.name}" actualizada`, {
        description: `Ahora tienes ${existingItem.quantity + 1} unidades`,
      });
    } else {
      setQuotation({
        ...quotation,
        items: [...quotation.items, { product, quantity: 1 }],
      });
      toast.success("Producto agregado", {
        description: `"${product.name}" se ha agregado a tu cotización`,
      });
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setQuotation({
      ...quotation,
      items: quotation.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    });
  };

  const handleRemoveItem = (productId: string) => {
    setItemToRemove(productId);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      const item = quotation.items.find((item) => item.product.id === itemToRemove);
      setQuotation({
        ...quotation,
        items: quotation.items.filter((item) => item.product.id !== itemToRemove),
      });
      if (item) {
        toast.success("Producto eliminado", {
          description: `"${item.product.name}" se ha eliminado de la cotización`,
        });
      }
      setItemToRemove(null);
    }
  };

  const handleGenerateQuote = () => {
    if (quotation.items.length === 0) {
      toast.error("Error", {
        description: "Debes agregar al menos un producto a la cotización",
      });
      return;
    }

    // Auto-fill customer info for logged-in clients
    if (user?.role === "client" && !quotation.customer?.name) {
      setQuotation({
        ...quotation,
        customer: {
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          company: user.company || "",
          address: "",
        },
      });
    }

    if (!quotation.customer?.name || !quotation.customer?.email) {
      toast.error("Error", {
        description: "Por favor completa la información del cliente",
      });
      return;
    }

    setShowPreview(true);
  };

  const handleQuoteCreated = () => {
    setShowPreview(false);
    setShowSuccessDialog(true);
  };

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                ← Volver
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <Calculator className="size-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {user?.role === "client" ? "Solicitar Cotización" : "Nueva Cotización"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === "client" 
                      ? "Selecciona los productos que necesitas"
                      : "Crea cotizaciones profesionales en minutos"}
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleGenerateQuote}
              size="lg"
              disabled={quotation.items.length === 0}
            >
              <Eye className="size-4 mr-2" />
              Generar Cotización
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <FileText className="size-4" />
              Productos
              {quotation.items.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {quotation.items.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              Cliente
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Products Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos o servicios..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:w-64">
                    <Filter className="size-4 text-muted-foreground shrink-0" />
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categories
                          .filter((c) => c !== "all")
                          .map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToQuote={handleAddToQuote}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <p className="text-muted-foreground">
                        No se encontraron productos que coincidan con tu búsqueda
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Section */}
              <div className="lg:col-span-1">
                <QuoteCart
                  items={quotation.items}
                  discount={quotation.discount}
                  taxRate={quotation.taxRate}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onUpdateDiscount={(discount) =>
                    setQuotation({ ...quotation, discount })
                  }
                  onUpdateTaxRate={(taxRate) =>
                    setQuotation({ ...quotation, taxRate })
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customer" className="space-y-6">
            <CustomerForm
              customer={quotation.customer}
              notes={quotation.notes}
              onUpdateCustomer={(customer) =>
                setQuotation({ ...quotation, customer })
              }
              onUpdateNotes={(notes) => setQuotation({ ...quotation, notes })}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Dialog */}
      <QuotePreview
        open={showPreview}
        onOpenChange={setShowPreview}
        quotation={quotation}
        onSuccess={handleQuoteCreated}
      />

      {/* Success Dialog */}
      <ConfirmDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onConfirm={handleSuccessConfirm}
        title="¡Cotización creada con éxito!"
        description="La cotización ha sido generada correctamente y está lista para ser enviada al cliente."
        confirmText="Ir al Dashboard"
        cancelText="Crear otra cotización"
      />

      {/* Remove Item Confirmation */}
      <ConfirmDialog
        open={!!itemToRemove}
        onOpenChange={(open) => !open && setItemToRemove(null)}
        onConfirm={confirmRemoveItem}
        title="¿Eliminar producto?"
        description="¿Estás seguro que deseas eliminar este producto de la cotización?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}