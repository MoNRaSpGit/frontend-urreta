export type Client = {
  id: string;
  name: string;
  phone: string;
};

export type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
};

export type OrderItem = {
  productId: string;
  productName: string;
  unit: string;
  unitPrice: number;
  quantity: number;
};

export type OrderRecord = {
  id: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  items: OrderItem[];
};

export type Step = "client" | "order" | "record" | "products";
