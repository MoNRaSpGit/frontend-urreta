import { formatMoney } from "../lib/urretaUtils";
import type { Client, OrderItem, Product } from "../types";

type Props = {
  selectedClient: Client | null;
  productSearch: string;
  onProductSearchChange: (value: string) => void;
  filteredProducts: Product[];
  currentItems: OrderItem[];
  currentOrderTotal: number;
  onAddProduct: (product: Product) => void;
  onChangeItemQuantity: (productId: string, nextQuantity: number) => void;
  onSaveOrder: () => void;
  onBackToClients: () => void;
};

export function OrderStep({
  selectedClient,
  productSearch,
  onProductSearchChange,
  filteredProducts,
  currentItems,
  currentOrderTotal,
  onAddProduct,
  onChangeItemQuantity,
  onSaveOrder,
  onBackToClients
}: Props) {
  return (
    <section className="urreta-panel">
      <div className="urreta-panel-heading">
        <h2>Arma el pedido</h2>
        <p>
          {selectedClient
            ? `Cliente seleccionado: ${selectedClient.name}. Busca productos y agregalos al pedido.`
            : "Primero elegi un cliente."}
        </p>
      </div>

      {selectedClient ? (
        <div className="urreta-client-card">
          <div className="urreta-client-image">{selectedClient.name.slice(0, 1).toUpperCase()}</div>
          <div className="urreta-client-copy">
            <strong>{selectedClient.name}</strong>
            <span>Cliente</span>
            <span>
              Pedido para: <strong>{selectedClient.name}</strong>
            </span>
            <span>
              Numero tel.: <strong>{selectedClient.phone || "Sin telefono"}</strong>
            </span>
          </div>
          <button type="button" onClick={onBackToClients} className="urreta-button urreta-button--secondary">
            Cambiar cliente
          </button>
        </div>
      ) : (
        <div className="urreta-empty">No hay cliente seleccionado.</div>
      )}

      <label className="urreta-field">
        <span>Buscar producto</span>
        <input
          value={productSearch}
          onChange={(event) => onProductSearchChange(event.target.value)}
          placeholder="Ejemplo: arroz"
          className="urreta-input"
          disabled={!selectedClient}
        />
      </label>

      <div className="urreta-list">
        {selectedClient && productSearch.trim()
          ? filteredProducts.map((product) => (
              <div key={product.id} className="urreta-list-item urreta-list-item--static">
                <div className="urreta-list-copy">
                  <strong>{product.name}</strong>
                  <span>
                    Unidad: {product.unit} - {formatMoney(product.price)}
                  </span>
                </div>
                <button type="button" onClick={() => onAddProduct(product)} className="urreta-button urreta-button--primary">
                  Agregar
                </button>
              </div>
            ))
          : null}
        {!selectedClient ? <div className="urreta-empty">El buscador se habilita cuando elegis un cliente.</div> : null}
        {selectedClient && productSearch.trim() && filteredProducts.length === 0 ? (
          <div className="urreta-empty">No encontramos productos con ese nombre.</div>
        ) : null}
      </div>

      <div className="urreta-order-stack">
        <div className="urreta-order-summary">
          <h3>Pedido actual</h3>
          <span className="urreta-badge">{formatMoney(currentOrderTotal)}</span>
        </div>
        <div className="urreta-list">
          {currentItems.map((item) => (
            <div key={item.productId} className="urreta-list-item urreta-list-item--static">
              <div className="urreta-list-copy">
                <strong>{item.productName}</strong>
                <span>
                  {item.quantity} {item.unit} - {formatMoney(item.unitPrice)} c/u
                </span>
              </div>
              <div className="urreta-qty-actions">
                <button
                  type="button"
                  onClick={() => onChangeItemQuantity(item.productId, item.quantity - 1)}
                  className="urreta-button urreta-button--subtle"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onChangeItemQuantity(item.productId, item.quantity + 1)}
                  className="urreta-button urreta-button--subtle"
                >
                  +
                </button>
                <strong className="urreta-qty-total">{formatMoney(item.quantity * item.unitPrice)}</strong>
              </div>
            </div>
          ))}
          {currentItems.length === 0 ? <div className="urreta-empty">Todavia no agregaste productos.</div> : null}
        </div>
        {currentItems.length > 0 ? (
          <div className="urreta-total-row">
            <strong>Total del pedido</strong>
            <strong>{formatMoney(currentOrderTotal)}</strong>
          </div>
        ) : null}
      </div>

      <div className="urreta-actions">
        <button type="button" onClick={onSaveOrder} className="urreta-button urreta-button--primary">
          Guardar pedido
        </button>
        <button type="button" onClick={onBackToClients} className="urreta-button urreta-button--secondary">
          Volver
        </button>
      </div>
    </section>
  );
}
