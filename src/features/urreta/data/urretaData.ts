import type { Client, Product } from "../types";

export const CLIENTS_STORAGE_KEY = "urreta-clients-v1";
export const ORDERS_STORAGE_KEY = "urreta-orders-v1";
export const PRODUCTS_STORAGE_KEY = "urreta-products-v1";

export const DEFAULT_CLIENTS: Client[] = [
  { id: "client-ana", name: "Ana Perez", phone: "099 111 222" },
  { id: "client-roberto", name: "Roberto Silva", phone: "098 444 555" },
  { id: "client-maria", name: "Maria Gomez", phone: "097 333 666" },
  { id: "client-lucas", name: "Lucas Fernandez", phone: "096 212 345" },
  { id: "client-paola", name: "Paola Rodriguez", phone: "094 778 901" },
  { id: "client-sergio", name: "Sergio Cabrera", phone: "095 654 210" }
];

export const DEFAULT_PRODUCTS: Product[] = [
  { id: "prod-arroz", name: "Arroz", unit: "bolsa", price: 84 },
  { id: "prod-fideos", name: "Fideos", unit: "paquete", price: 58 },
  { id: "prod-azucar", name: "Azucar", unit: "kg", price: 49 },
  { id: "prod-harina", name: "Harina", unit: "kg", price: 43 },
  { id: "prod-aceite", name: "Aceite", unit: "botella", price: 129 },
  { id: "prod-yerba", name: "Yerba", unit: "paquete", price: 196 },
  { id: "prod-sal", name: "Sal", unit: "kg", price: 31 },
  { id: "prod-lentejas", name: "Lentejas", unit: "paquete", price: 72 }
];
