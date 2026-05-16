import { formatMoney, formatOrderDate } from "../lib/urretaUtils";
import type { OrderRecord } from "../types";

type Props = {
  lastSavedOrder: OrderRecord | null;
  onStartNewFlow: () => void;
};

export function RecordStep({ lastSavedOrder, onStartNewFlow }: Props) {
  return (
    <section className="urreta-panel">
      <div className="urreta-panel-heading">
        <h2>Registro del pedido</h2>
        <p>Aca ves la boleta del pedido guardado con el detalle final.</p>
      </div>

      {lastSavedOrder ? (
        <article className="urreta-receipt">
          <div className="urreta-receipt-top">
            <div className="urreta-list-copy">
              <strong>{lastSavedOrder.clientName}</strong>
              <span>{formatOrderDate(lastSavedOrder.createdAt)}</span>
            </div>
            <span className="urreta-badge">Pedido guardado</span>
          </div>

          <div className="urreta-receipt-table">
            <div className="urreta-receipt-head">
              <span>Producto</span>
              <span className="is-center">Cantidad</span>
              <span className="is-right">Total</span>
            </div>
            {lastSavedOrder.items.map((item) => (
              <div key={`${lastSavedOrder.id}-${item.productId}`} className="urreta-receipt-row">
                <span className="is-strong">{item.productName}</span>
                <span className="is-center">
                  {item.quantity} {item.unit}
                </span>
                <strong className="is-right">{formatMoney(item.quantity * item.unitPrice)}</strong>
              </div>
            ))}
          </div>

          <div className="urreta-total-row">
            <strong>Total final</strong>
            <strong>
              {formatMoney(lastSavedOrder.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0))}
            </strong>
          </div>
        </article>
      ) : (
        <div className="urreta-empty">Todavia no hay un pedido guardado para mostrar.</div>
      )}

      <button type="button" onClick={onStartNewFlow} className="urreta-button urreta-button--primary">
        Cargar otro pedido
      </button>
    </section>
  );
}
