import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { toast } from "react-toastify";

type Client = {
  id: string;
  name: string;
  phone: string;
};

type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
};

type OrderItem = {
  productId: string;
  productName: string;
  unit: string;
  unitPrice: number;
  quantity: number;
};

type OrderRecord = {
  id: string;
  clientId: string;
  clientName: string;
  createdAt: string;
  items: OrderItem[];
};

type Step = "client" | "order" | "record" | "products";

const CLIENTS_STORAGE_KEY = "urreta-clients-v1";
const ORDERS_STORAGE_KEY = "urreta-orders-v1";
const PRODUCTS_STORAGE_KEY = "urreta-products-v1";

const DEFAULT_CLIENTS: Client[] = [
  { id: "client-ana", name: "Ana Perez", phone: "099 111 222" },
  { id: "client-roberto", name: "Roberto Silva", phone: "098 444 555" },
  { id: "client-maria", name: "Maria Gomez", phone: "097 333 666" },
  { id: "client-lucas", name: "Lucas Fernandez", phone: "096 212 345" },
  { id: "client-paola", name: "Paola Rodriguez", phone: "094 778 901" },
  { id: "client-sergio", name: "Sergio Cabrera", phone: "095 654 210" }
];

const DEFAULT_PRODUCTS: Product[] = [
  { id: "prod-arroz", name: "Arroz", unit: "bolsa", price: 84 },
  { id: "prod-fideos", name: "Fideos", unit: "paquete", price: 58 },
  { id: "prod-azucar", name: "Azucar", unit: "kg", price: 49 },
  { id: "prod-harina", name: "Harina", unit: "kg", price: 43 },
  { id: "prod-aceite", name: "Aceite", unit: "botella", price: 129 },
  { id: "prod-yerba", name: "Yerba", unit: "paquete", price: 196 },
  { id: "prod-sal", name: "Sal", unit: "kg", price: 31 },
  { id: "prod-lentejas", name: "Lentejas", unit: "paquete", price: 72 }
];

function readStoredValue<T>(storageKey: string, fallbackValue: T): T {
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

function getInitialClients() {
  const storedClients = readStoredValue<Client[]>(CLIENTS_STORAGE_KEY, []);
  const mergedClients = [...DEFAULT_CLIENTS];

  storedClients.forEach((storedClient) => {
    if (!mergedClients.some((client) => client.id === storedClient.id)) {
      mergedClients.push(storedClient);
    }
  });

  return mergedClients;
}

function getInitialProducts() {
  const storedProducts = readStoredValue<Product[]>(PRODUCTS_STORAGE_KEY, []);
  if (storedProducts.length === 0) {
    return DEFAULT_PRODUCTS;
  }

  return DEFAULT_PRODUCTS.map((product) => storedProducts.find((item) => item.id === product.id) ?? product);
}

function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0
  }).format(value);
}

const BRAND_ORANGE = "#a84d12";
const BRAND_ORANGE_SOFT = "rgba(168,77,18,0.14)";
const BRAND_ORANGE_SURFACE = "rgba(168,77,18,0.10)";
const BRAND_ORANGE_BORDER = "rgba(168,77,18,0.18)";
const BRAND_ORANGE_GLOW = "rgba(168,77,18,0.16)";
const BRAND_ORANGE_TEXT = "#7b3408";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    `radial-gradient(circle at top, ${BRAND_ORANGE_GLOW}, transparent 32%), linear-gradient(180deg, #f7f1e8 0%, #efe5d8 100%)`,
  color: "#2a2018"
};

const wrapStyle: CSSProperties = {
  width: "min(1080px, calc(100% - 32px))",
  margin: "0 auto",
  padding: "32px 0 72px",
  display: "grid",
  gap: 22
};

const heroStyle: CSSProperties = {
  display: "grid",
  gap: 14,
  padding: "28px 30px",
  borderRadius: 28,
  border: "1px solid rgba(80, 50, 20, 0.12)",
  background: "rgba(255,255,255,0.78)",
  boxShadow: "0 24px 60px rgba(84, 49, 15, 0.10)"
};

const stepsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10
};

const panelStyle: CSSProperties = {
  display: "grid",
  gap: 16,
  padding: 24,
  borderRadius: 28,
  border: "1px solid rgba(80, 50, 20, 0.12)",
  background: "rgba(255,255,255,0.82)",
  boxShadow: "0 18px 40px rgba(84, 49, 15, 0.08)"
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24
};

const captionStyle: CSSProperties = {
  margin: 0,
  color: "#6b5540",
  lineHeight: 1.6
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: 6
};

const inputStyle: CSSProperties = {
  width: "100%",
  borderRadius: 16,
  border: "1px solid rgba(80, 50, 20, 0.15)",
  background: "#fffdfa",
  padding: "12px 14px",
  color: "#2a2018"
};

const primaryButtonStyle: CSSProperties = {
  border: "none",
  borderRadius: 18,
  padding: "12px 16px",
  background: BRAND_ORANGE,
  color: "#fff8f2",
  fontWeight: 700,
  cursor: "pointer"
};

const secondaryButtonStyle: CSSProperties = {
  border: "1px solid rgba(80, 50, 20, 0.14)",
  borderRadius: 18,
  padding: "12px 16px",
  background: "rgba(255,255,255,0.76)",
  color: "#5d4734",
  fontWeight: 700,
  cursor: "pointer"
};

const subtleButtonStyle: CSSProperties = {
  border: "none",
  borderRadius: 14,
  padding: "8px 11px",
  background: BRAND_ORANGE_SOFT,
  color: BRAND_ORANGE_TEXT,
  fontWeight: 700,
  cursor: "pointer"
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: 10
};

const listItemStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  alignItems: "center",
  padding: "14px 16px",
  borderRadius: 20,
  border: "1px solid rgba(80, 50, 20, 0.10)",
  background: "rgba(255,251,245,0.96)"
};

const emptyStyle: CSSProperties = {
  padding: "18px 16px",
  borderRadius: 20,
  border: "1px dashed rgba(80, 50, 20, 0.16)",
  color: "#7b6754",
  background: "rgba(255,255,255,0.5)"
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  padding: "6px 10px",
  borderRadius: 999,
  background: BRAND_ORANGE_SOFT,
  color: BRAND_ORANGE_TEXT,
  fontSize: 12,
  fontWeight: 700
};

const receiptStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  padding: 20,
  borderRadius: 24,
  border: "1px solid rgba(80, 50, 20, 0.12)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(253,247,239,0.96) 100%)",
  boxShadow: "0 18px 40px rgba(84, 49, 15, 0.08)"
};

const clientCardStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "84px minmax(0, 1fr) auto",
  gap: 16,
  alignItems: "center",
  padding: 18,
  borderRadius: 24,
  border: "1px solid rgba(80, 50, 20, 0.12)",
  background: "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(252,246,238,0.98) 100%)",
  boxShadow: "0 18px 40px rgba(84, 49, 15, 0.08)"
};

const clientImageStyle: CSSProperties = {
  width: 84,
  height: 84,
  borderRadius: 20,
  background: `linear-gradient(135deg, ${BRAND_ORANGE_BORDER} 0%, rgba(127,54,9,0.34) 100%)`,
  border: `1px solid ${BRAND_ORANGE_BORDER}`,
  display: "grid",
  placeItems: "center",
  color: BRAND_ORANGE_TEXT,
  fontSize: 24,
  fontWeight: 800
};

const receiptTableHeaderStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.8fr) 120px 120px",
  gap: 12,
  paddingBottom: 8,
  borderBottom: "1px solid rgba(80, 50, 20, 0.14)",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#8a6442"
};

const receiptRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.8fr) 120px 120px",
  gap: 12,
  alignItems: "center",
  paddingTop: 10,
  borderTop: "1px dashed rgba(80, 50, 20, 0.16)"
};

export function UrretaHomePage() {
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

  const canGoOrder = Boolean(selectedClient);
  const canGoRecord = Boolean(lastSavedOrder);

  const stepButtonStyle = (step: Step, enabled: boolean): CSSProperties => ({
    border: "1px solid",
    borderColor: activeStep === step ? BRAND_ORANGE : enabled ? "rgba(80, 50, 20, 0.14)" : "rgba(80, 50, 20, 0.08)",
    background: activeStep === step ? BRAND_ORANGE : "rgba(255,255,255,0.72)",
    color: activeStep === step ? "#fff8f2" : enabled ? "#5d4734" : "#9e8c7c",
    borderRadius: 999,
    padding: "11px 18px",
    fontWeight: 700,
    cursor: enabled ? "pointer" : "not-allowed",
    opacity: enabled ? 1 : 0.76
  });

  return (
    <main style={pageStyle}>
      <div style={wrapStyle}>
        <section style={heroStyle}>
          <h1 style={{ margin: 0, fontSize: "clamp(2.2rem, 5vw, 4.4rem)", lineHeight: 0.95 }}>Distribuidora</h1>
          <p style={{ margin: 0, maxWidth: 760, fontSize: 18, lineHeight: 1.6, color: "#5b4736" }}>Confianza y calidad.</p>
        </section>

        <section style={stepsStyle}>
          <button type="button" onClick={() => setActiveStep("client")} style={stepButtonStyle("client", true)}>
            1. Cliente
          </button>
          <button
            type="button"
            onClick={() => {
              if (canGoOrder) setActiveStep("order");
            }}
            style={stepButtonStyle("order", canGoOrder)}
          >
            2. Pedido
          </button>
          <button
            type="button"
            onClick={() => {
              if (canGoRecord) setActiveStep("record");
            }}
            style={stepButtonStyle("record", canGoRecord)}
          >
            3. Registro
          </button>
          <button type="button" onClick={() => setActiveStep("products")} style={stepButtonStyle("products", true)}>
            4. Productos
          </button>
        </section>

        {activeStep === "client" ? (
          <section style={panelStyle}>
            <div style={{ display: "grid", gap: 6 }}>
              <h2 style={sectionTitleStyle}>Elegi el cliente</h2>
              <p style={captionStyle}>Busca un cliente existente o crea uno nuevo con el boton +.</p>
            </div>

              <div style={{ display: "flex", gap: 10 }}>
                <input
                  value={clientSearch}
                  onChange={(event) => setClientSearch(event.target.value)}
                  placeholder="Buscar cliente..."
                  style={inputStyle}
                />
                <button type="button" onClick={() => setShowCreateClient((current) => !current)} style={secondaryButtonStyle}>
                  +
                </button>
              </div>

            {showCreateClient ? (
              <div
                ref={createClientFormRef}
                style={{ ...panelStyle, padding: 16, gap: 12, background: "rgba(255,247,239,0.92)" }}
              >
                <strong>Nuevo cliente</strong>
                <label style={fieldStyle}>
                  <span>Nombre</span>
                  <input
                    value={newClientName}
                    onChange={(event) => setNewClientName(event.target.value)}
                    placeholder="Nombre del cliente"
                    style={inputStyle}
                  />
                </label>
                <label style={fieldStyle}>
                  <span>Telefono</span>
                  <input
                    value={newClientPhone}
                    onChange={(event) => setNewClientPhone(event.target.value)}
                    placeholder="099..."
                    style={inputStyle}
                  />
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={handleCreateClient} style={primaryButtonStyle}>
                    Guardar cliente
                  </button>
                  <button type="button" onClick={() => setShowCreateClient(false)} style={secondaryButtonStyle}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : null}

            <div style={listStyle}>
              {visibleClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => handleSelectClient(client.id)}
                  style={{ ...listItemStyle, textAlign: "left" }}
                >
                  <div style={{ display: "grid", gap: 4 }}>
                    <strong>{client.name}</strong>
                    <span style={{ color: "#6b5540", fontSize: 14 }}>{client.phone || "Sin telefono"}</span>
                  </div>
                  <span style={badgeStyle}>Elegir</span>
                </button>
              ))}
              {filteredClients.length === 0 ? <div style={emptyStyle}>No encontramos clientes con ese nombre.</div> : null}
              {filteredClients.length > 3 ? (
                <button type="button" onClick={handleToggleVisibleClients} style={secondaryButtonStyle}>
                  {visibleClientCount <= 3 ? "Ver mas" : "Ver menos"}
                </button>
              ) : null}
            </div>
          </section>
        ) : null}

        {activeStep === "order" ? (
          <section style={panelStyle}>
            <div style={{ display: "grid", gap: 6 }}>
              <h2 style={sectionTitleStyle}>Arma el pedido</h2>
              <p style={captionStyle}>
                {selectedClient
                  ? `Cliente seleccionado: ${selectedClient.name}. Busca productos y agregalos al pedido.`
                  : "Primero elegi un cliente."}
              </p>
            </div>

            {selectedClient ? (
              <div style={clientCardStyle}>
                <div style={clientImageStyle}>{selectedClient.name.slice(0, 1).toUpperCase()}</div>
                <div style={{ display: "grid", gap: 4 }}>
                  <strong style={{ fontSize: 20 }}>{selectedClient.name}</strong>
                  <span style={{ color: "#6b5540", fontSize: 14 }}>Cliente</span>
                  <span style={{ color: "#6b5540", fontSize: 14 }}>
                    Pedido para: <strong style={{ color: "#2a2018" }}>{selectedClient.name}</strong>
                  </span>
                  <span style={{ color: "#6b5540", fontSize: 14 }}>
                    Numero tel.: <strong style={{ color: "#2a2018" }}>{selectedClient.phone || "Sin telefono"}</strong>
                  </span>
                </div>
                <button type="button" onClick={() => setActiveStep("client")} style={secondaryButtonStyle}>
                  Cambiar cliente
                </button>
              </div>
            ) : (
              <div style={emptyStyle}>No hay cliente seleccionado.</div>
            )}

            <label style={fieldStyle}>
              <span>Buscar producto</span>
              <input
                value={productSearch}
                onChange={(event) => setProductSearch(event.target.value)}
                placeholder="Ejemplo: arroz"
                style={inputStyle}
                disabled={!selectedClient}
              />
            </label>

            <div style={listStyle}>
              {selectedClient && productSearch.trim() ? (
                filteredProducts.map((product) => (
                    <div key={product.id} style={listItemStyle}>
                      <div style={{ display: "grid", gap: 4 }}>
                        <strong>{product.name}</strong>
                        <span style={{ color: "#6b5540", fontSize: 14 }}>
                          Unidad: {product.unit} - {formatMoney(product.price)}
                        </span>
                      </div>
                    <button type="button" onClick={() => handleAddProduct(product)} style={primaryButtonStyle}>
                      Agregar
                    </button>
                  </div>
                ))
              ) : !selectedClient ? (
                <div style={emptyStyle}>El buscador se habilita cuando elegis un cliente.</div>
              ) : null}
              {selectedClient && productSearch.trim() && filteredProducts.length === 0 ? (
                <div style={emptyStyle}>No encontramos productos con ese nombre.</div>
              ) : null}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: 20 }}>Pedido actual</h3>
                <span style={badgeStyle}>{formatMoney(currentOrderTotal)}</span>
              </div>
              <div style={listStyle}>
                {currentItems.map((item) => (
                  <div key={item.productId} style={listItemStyle}>
                    <div style={{ display: "grid", gap: 4 }}>
                      <strong>{item.productName}</strong>
                      <span style={{ color: "#6b5540", fontSize: 14 }}>
                        {item.quantity} {item.unit} - {formatMoney(item.unitPrice)} c/u
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleChangeItemQuantity(item.productId, item.quantity - 1)}
                        style={subtleButtonStyle}
                      >
                        -
                      </button>
                      <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleChangeItemQuantity(item.productId, item.quantity + 1)}
                        style={subtleButtonStyle}
                      >
                        +
                      </button>
                      <strong style={{ minWidth: 86, textAlign: "right" }}>
                        {formatMoney(item.quantity * item.unitPrice)}
                      </strong>
                    </div>
                  </div>
                ))}
                {currentItems.length === 0 ? <div style={emptyStyle}>Todavia no agregaste productos.</div> : null}
              </div>
              {currentItems.length > 0 ? (
                <div style={{ ...listItemStyle, background: BRAND_ORANGE_SURFACE, borderColor: BRAND_ORANGE_BORDER }}>
                  <strong>Total del pedido</strong>
                  <strong style={{ fontSize: 20 }}>{formatMoney(currentOrderTotal)}</strong>
                </div>
              ) : null}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={handleSaveOrder} style={primaryButtonStyle}>
                Guardar pedido
              </button>
              <button type="button" onClick={() => setActiveStep("client")} style={secondaryButtonStyle}>
                Volver
              </button>
            </div>
          </section>
        ) : null}

        {activeStep === "record" ? (
          <section style={panelStyle}>
            <div style={{ display: "grid", gap: 6 }}>
              <h2 style={sectionTitleStyle}>Registro del pedido</h2>
              <p style={captionStyle}>Aca ves la boleta del pedido guardado con el detalle final.</p>
            </div>

            {lastSavedOrder ? (
              <article style={receiptStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
                  <div style={{ display: "grid", gap: 4 }}>
                    <strong style={{ fontSize: 18 }}>{lastSavedOrder.clientName}</strong>
                    <span style={{ color: "#6b5540", fontSize: 14 }}>{formatOrderDate(lastSavedOrder.createdAt)}</span>
                  </div>
                  <span style={badgeStyle}>Pedido guardado</span>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <div style={receiptTableHeaderStyle}>
                    <span>Producto</span>
                    <span style={{ textAlign: "center" }}>Cantidad</span>
                    <span style={{ textAlign: "right" }}>Total</span>
                  </div>
                  {lastSavedOrder.items.map((item) => (
                    <div
                      key={`${lastSavedOrder.id}-${item.productId}`}
                      style={receiptRowStyle}
                    >
                      <span style={{ fontWeight: 600 }}>
                        {item.productName}
                      </span>
                      <span style={{ textAlign: "center", color: "#6b5540" }}>
                        {item.quantity} {item.unit}
                      </span>
                      <strong style={{ textAlign: "right" }}>
                        {formatMoney(item.quantity * item.unitPrice)}
                      </strong>
                    </div>
                  ))}
                </div>
                <div style={{ ...listItemStyle, background: BRAND_ORANGE_SURFACE, borderColor: BRAND_ORANGE_BORDER }}>
                  <strong>Total final</strong>
                  <strong style={{ fontSize: 20 }}>
                    {formatMoney(
                      lastSavedOrder.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                    )}
                  </strong>
                </div>
              </article>
            ) : (
              <div style={emptyStyle}>Todavia no hay un pedido guardado para mostrar.</div>
            )}

            <button type="button" onClick={handleStartNewFlow} style={primaryButtonStyle}>
              Cargar otro pedido
            </button>
          </section>
        ) : null}

        {activeStep === "products" ? (
          <section style={panelStyle}>
            <div style={{ display: "grid", gap: 6 }}>
              <h2 style={sectionTitleStyle}>Productos</h2>
              <p style={captionStyle}>Busca un producto y ajusta nombre o precio desde un modal rapido.</p>
            </div>

            <label style={fieldStyle}>
              <span>Buscar producto</span>
              <input
                value={productCatalogSearch}
                onChange={(event) => setProductCatalogSearch(event.target.value)}
                placeholder="Ejemplo: arroz"
                style={inputStyle}
              />
            </label>

            <div style={listStyle}>
              {visibleCatalogProducts.map((product) => (
                <article key={product.id} style={listItemStyle}>
                  <div style={{ display: "grid", gap: 4 }}>
                    <strong>{product.name}</strong>
                    <span style={{ color: "#6b5540", fontSize: 14 }}>
                      Unidad: {product.unit} - {formatMoney(product.price)}
                    </span>
                  </div>
                  <button type="button" onClick={() => handleOpenEditProduct(product)} style={secondaryButtonStyle}>
                    Editar
                  </button>
                </article>
              ))}
              {visibleCatalogProducts.length === 0 ? (
                <div style={emptyStyle}>No encontramos productos con ese nombre.</div>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>

      {editingProduct ? (
        <div
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(42, 32, 24, 0.42)",
            display: "grid",
            placeItems: "center",
            padding: 16,
            zIndex: 50
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-product-title"
            style={{
              width: "min(460px, 100%)",
              display: "grid",
              gap: 16,
              padding: 24,
              borderRadius: 28,
              border: "1px solid rgba(80, 50, 20, 0.12)",
              background: "#fffaf4",
              boxShadow: "0 24px 60px rgba(42, 32, 24, 0.22)"
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <h3 id="edit-product-title" style={{ margin: 0, fontSize: 24 }}>
                Editar producto
              </h3>
              <p style={captionStyle}>Ajusta nombre y precio del producto seleccionado.</p>
            </div>

            <label style={fieldStyle}>
              <span>Nombre</span>
              <input
                value={editingProductName}
                onChange={(event) => setEditingProductName(event.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={fieldStyle}>
              <span>Precio</span>
              <input
                type="number"
                min="1"
                step="1"
                value={editingProductPrice}
                onChange={(event) => setEditingProductPrice(event.target.value)}
                style={inputStyle}
              />
            </label>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" onClick={handleCloseEditProduct} style={secondaryButtonStyle}>
                Cancelar
              </button>
              <button type="button" onClick={handleSaveProduct} style={primaryButtonStyle}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
