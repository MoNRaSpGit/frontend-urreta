import { CLIENTS_STORAGE_KEY, DEFAULT_CLIENTS, DEFAULT_PRODUCTS, PRODUCTS_STORAGE_KEY } from "../data/urretaData";
import type { Client, Product } from "../types";

export function readStoredValue<T>(storageKey: string, fallbackValue: T): T {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  const rawValue = window.localStorage.getItem(storageKey);
  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallbackValue;
  }
}

export function getInitialClients() {
  const storedClients = readStoredValue<Client[]>(CLIENTS_STORAGE_KEY, []);
  const mergedClients = [...DEFAULT_CLIENTS];

  storedClients.forEach((storedClient) => {
    if (!mergedClients.some((client) => client.id === storedClient.id)) {
      mergedClients.push(storedClient);
    }
  });

  return mergedClients;
}

export function getInitialProducts() {
  const storedProducts = readStoredValue<Product[]>(PRODUCTS_STORAGE_KEY, []);
  if (storedProducts.length === 0) {
    return DEFAULT_PRODUCTS;
  }

  return DEFAULT_PRODUCTS.map((product) => storedProducts.find((item) => item.id === product.id) ?? product);
}
