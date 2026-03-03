import { QuotationData } from "./quotation";

export interface SavedQuotation extends QuotationData {
  id: string;
  clientId: string;
  sellerId: string;
  createdAt: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  quotationNumber: string;
}
