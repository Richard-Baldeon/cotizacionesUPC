export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export interface QuoteItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
}

export interface QuotationData {
  items: QuoteItem[];
  customer: CustomerInfo | null;
  discount: number;
  taxRate: number;
  notes: string;
}
