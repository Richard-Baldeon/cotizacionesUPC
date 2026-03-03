import { Product } from "../types/quotation";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToQuote: (product: Product) => void;
}

export function ProductCard({ product, onAddToQuote }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {product.category}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-3xl font-bold text-primary">
          ${product.price.toLocaleString()}
          <span className="text-sm text-muted-foreground ml-1">USD</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onAddToQuote(product)} 
          className="w-full"
          size="sm"
        >
          <Plus className="size-4 mr-2" />
          Agregar a Cotización
        </Button>
      </CardFooter>
    </Card>
  );
}
