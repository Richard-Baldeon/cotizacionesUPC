import { SavedQuotation } from "../types/saved-quotation";

export const savedQuotations: SavedQuotation[] = [
  {
    id: "q1",
    clientId: "3",
    sellerId: "2",
    quotationNumber: "COT-001234",
    status: "sent",
    createdAt: "2026-02-10T14:30:00Z",
    discount: 10,
    taxRate: 16,
    notes: "Cotización para desarrollo de sitio web corporativo con sistema de gestión de contenidos.",
    customer: {
      name: "Juan Cliente",
      email: "cliente@empresa.com",
      phone: "+1 (555) 300-0003",
      company: "Empresa Demo S.A.",
      address: "Av. Principal 123, Ciudad",
    },
    items: [
      {
        product: {
          id: "1",
          name: "Desarrollo Web Profesional",
          description: "Sitio web responsivo con diseño moderno y optimizado para SEO",
          price: 1500,
          category: "Desarrollo Web",
        },
        quantity: 1,
      },
      {
        product: {
          id: "5",
          name: "Diseño de Identidad Corporativa",
          description: "Logo, paleta de colores, tipografía y manual de marca",
          price: 800,
          category: "Diseño",
        },
        quantity: 1,
      },
    ],
  },
  {
    id: "q2",
    clientId: "5",
    sellerId: "2",
    quotationNumber: "COT-001235",
    status: "accepted",
    createdAt: "2026-02-12T10:15:00Z",
    discount: 5,
    taxRate: 16,
    notes: "Desarrollo de aplicación móvil para gestión de inventario.",
    customer: {
      name: "Ana Martínez",
      email: "cliente2@empresa.com",
      phone: "+1 (555) 300-0005",
      company: "Tech Solutions Inc.",
    },
    items: [
      {
        product: {
          id: "2",
          name: "Aplicación Móvil iOS/Android",
          description: "App nativa con interfaz intuitiva y funcionalidades avanzadas",
          price: 3500,
          category: "Desarrollo Móvil",
        },
        quantity: 1,
      },
    ],
  },
  {
    id: "q3",
    clientId: "3",
    sellerId: "4",
    quotationNumber: "COT-001236",
    status: "draft",
    createdAt: "2026-02-14T16:45:00Z",
    discount: 0,
    taxRate: 16,
    notes: "",
    customer: {
      name: "Juan Cliente",
      email: "cliente@empresa.com",
      phone: "+1 (555) 300-0003",
      company: "Empresa Demo S.A.",
    },
    items: [
      {
        product: {
          id: "8",
          name: "Mantenimiento Mensual",
          description: "Soporte técnico, actualizaciones y monitoreo continuo",
          price: 350,
          category: "Servicios",
        },
        quantity: 12,
      },
    ],
  },
];
