import { formatMoney } from "../lib/urretaUtils";
import type { Product } from "../types";

type Props = {
  productCatalogSearch: string;
  onProductCatalogSearchChange: (value: string) => void;
  visibleCatalogProducts: Product[];
  onOpenEditProduct: (product: Product) => void;
};

export function ProductsStep({
  productCatalogSearch,
  onProductCatalogSearchChange,
  visibleCatalogProducts,
  onOpenEditProduct
}: Props) {
  return (
    <section className="urreta-panel">
      <div className="urreta-panel-heading">
        <h2>Productos</h2>
        <p>Busca un producto y ajusta nombre o precio desde un modal rapido.</p>
      </div>

      <label className="urreta-field">
        <span>Buscar producto</span>
        <input
          value={productCatalogSearch}
          onChange={(event) => onProductCatalogSearchChange(event.target.value)}
          placeholder="Ejemplo: arroz"
          className="urreta-input"
        />
      </label>

      <div className="urreta-list">
        {visibleCatalogProducts.map((product) => (
          <article key={product.id} className="urreta-list-item urreta-list-item--static">
            <div className="urreta-list-copy">
              <strong>{product.name}</strong>
              <span>
                Unidad: {product.unit} - {formatMoney(product.price)}
              </span>
            </div>
            <button type="button" onClick={() => onOpenEditProduct(product)} className="urreta-button urreta-button--secondary">
              Editar
            </button>
          </article>
        ))}
        {visibleCatalogProducts.length === 0 ? <div className="urreta-empty">No encontramos productos con ese nombre.</div> : null}
      </div>
    </section>
  );
}
