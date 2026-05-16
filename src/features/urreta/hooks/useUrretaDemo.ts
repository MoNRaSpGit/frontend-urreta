import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  CLIENTS_STORAGE_KEY,
  ORDERS_STORAGE_KEY,
  PRODUCTS_STORAGE_KEY
} from "../data/urretaData";
import { getInitialClients, getInitialProducts, readStoredValue } from "../lib/urretaStorage";
import type { Client, OrderItem, OrderRecord, Product, Step } from "../types";

export function useUrretaDemo() {
  const createClientFormRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState<Step | null>(null);
  const [clients, setClients] = useState<Client[]>(getInitialClients);
  const [products, setProducts] = useState<Product[]>(getInitialProducts);
  const [orders, setOrders] = useState<OrderRecord[]>(() => readStoredValue(ORDERS_STORAGE_KEY, []));
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [currentItems, setCurrentItems] = useState<OrderItem[]>([]);
  const [lastSavedOrderId, setLastSavedOrderId] = useState<string | null>(null);
  const [visibleClientCount, setVisibleClientCount] = useState(3);
  const [productCatalogSearch, setProductCatalogSearch] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProductName, setEditingProductName] = useState("");
  const [editingProductPrice, setEditingProductPrice] = useState("");

  useEffect(() => {
    window.localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (showCreateClient) {
      createClientFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showCreateClient]);

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) || null,
    [clients, selectedClientId]
  );

  const filteredClients = useMemo(() => {
    const normalizedSearch = clientSearch.trim().toLowerCase();
    if (!normalizedSearch) {
      return clients;
    }

    return clients.filter((client) => client.name.toLowerCase().includes(normalizedSearch));
  }, [clientSearch, clients]);

  const visibleClients = useMemo(() => filteredClients.slice(0, visibleClientCount), [filteredClients, visibleClientCount]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = productSearch.trim().toLowerCase();
    if (!normalizedSearch) {
      return [];
    }

    return products.filter((product) => product.name.toLowerCase().includes(normalizedSearch)).slice(0, 8);
  }, [productSearch, products]);

  const visibleCatalogProducts = useMemo(() => {
    const normalizedSearch = productCatalogSearch.trim().toLowerCase();
    const matchingProducts = normalizedSearch
      ? products.filter((product) => product.name.toLowerCase().includes(normalizedSearch))
      : products;

    return matchingProducts.slice(0, 4);
  }, [productCatalogSearch, products]);

  const editingProduct = useMemo(
    () => products.find((product) => product.id === editingProductId) ?? null,
    [editingProductId, products]
  );

  const lastSavedOrder = useMemo(
    () => orders.find((order) => order.id === lastSavedOrderId) || orders[0] || null,
    [orders, lastSavedOrderId]
  );

  const currentOrderTotal = useMemo(
    () => currentItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [currentItems]
  );

  const canGoOrder = Boolean(selectedClient);
  const canGoRecord = Boolean(lastSavedOrder);

  function handleCreateClient() {
    const normalizedName = newClientName.trim();
    if (!normalizedName) {
      toast.error("Primero escribi el nombre del cliente.");
      return;
    }

    const nextClient: Client = {
      id: `client-${Date.now()}`,
      name: normalizedName,
      phone: newClientPhone.trim()
    };

    setClients((current) => [nextClient, ...current]);
    setSelectedClientId(nextClient.id);
    setNewClientName("");
    setNewClientPhone("");
    setShowCreateClient(false);
    setActiveStep("order");
    toast.success("Cliente creado. Seguimos con el pedido.");
  }

  function handleSelectClient(clientId: string) {
    setSelectedClientId(clientId);
    setActiveStep("order");
  }

  function handleToggleVisibleClients() {
    setVisibleClientCount((current) => (current <= 3 ? 6 : 3));
  }

  function handleAddProduct(product: Product) {
    setCurrentItems((current) => {
      const existingItem = current.find((item) => item.productId === product.id);
      if (existingItem) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          productName: product.name,
          unit: product.unit,
          unitPrice: product.price,
          quantity: 1
        }
      ];
    });
    setProductSearch("");
  }

  function handleOpenEditProduct(product: Product) {
    setEditingProductId(product.id);
    setEditingProductName(product.name);
    setEditingProductPrice(String(product.price));
  }

  function handleCloseEditProduct() {
    setEditingProductId(null);
    setEditingProductName("");
    setEditingProductPrice("");
  }

  function handleSaveProduct() {
    const normalizedName = editingProductName.trim();
    const nextPrice = Number(editingProductPrice);

    if (!editingProductId || !normalizedName) {
      toast.error("Completa el nombre del producto.");
      return;
    }

    if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
      toast.error("El precio tiene que ser mayor a cero.");
      return;
    }

    setProducts((current) =>
      current.map((product) =>
        product.id === editingProductId ? { ...product, name: normalizedName, price: nextPrice } : product
      )
    );
    setCurrentItems((current) =>
      current.map((item) =>
        item.productId === editingProductId ? { ...item, productName: normalizedName, unitPrice: nextPrice } : item
      )
    );
    setOrders((current) =>
      current.map((order) => ({
        ...order,
        items: order.items.map((item) =>
          item.productId === editingProductId ? { ...item, productName: normalizedName, unitPrice: nextPrice } : item
        )
      }))
    );
    toast.success("Producto actualizado.");
    handleCloseEditProduct();
  }

  function handleChangeItemQuantity(productId: string, nextQuantity: number) {
    if (nextQuantity <= 0) {
      setCurrentItems((current) => current.filter((item) => item.productId !== productId));
      return;
    }

    setCurrentItems((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity: nextQuantity } : item))
    );
  }

  function handleSaveOrder() {
    if (!selectedClient) {
      toast.error("Primero elegi un cliente.");
      return;
    }

    if (currentItems.length === 0) {
      toast.error("Agrega al menos un producto antes de guardar.");
      return;
    }

    const nextOrder: OrderRecord = {
      id: `order-${Date.now()}`,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      createdAt: new Date().toISOString(),
      items: currentItems
    };

    setOrders((current) => [nextOrder, ...current]);
    setLastSavedOrderId(nextOrder.id);
    setCurrentItems([]);
    setProductSearch("");
    setActiveStep("record");
    toast.success("Pedido guardado.");
  }

  function handleStartNewFlow() {
    setSelectedClientId(null);
    setCurrentItems([]);
    setProductSearch("");
    setClientSearch("");
    setLastSavedOrderId(null);
    setActiveStep(null);
  }

  return {
    createClientFormRef,
    activeStep,
    setActiveStep,
    clients,
    clientSearch,
    setClientSearch,
    selectedClient,
    showCreateClient,
    setShowCreateClient,
    newClientName,
    setNewClientName,
    newClientPhone,
    setNewClientPhone,
    visibleClients,
    filteredClients,
    visibleClientCount,
    handleCreateClient,
    handleSelectClient,
    handleToggleVisibleClients,
    canGoOrder,
    canGoRecord,
    selectedClientId,
    productSearch,
    setProductSearch,
    filteredProducts,
    currentItems,
    currentOrderTotal,
    handleAddProduct,
    handleChangeItemQuantity,
    handleSaveOrder,
    lastSavedOrder,
    handleStartNewFlow,
    productCatalogSearch,
    setProductCatalogSearch,
    visibleCatalogProducts,
    handleOpenEditProduct,
    editingProduct,
    editingProductName,
    setEditingProductName,
    editingProductPrice,
    setEditingProductPrice,
    handleCloseEditProduct,
    handleSaveProduct
  };
}
