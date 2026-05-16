import type { Product } from "../types";

type Props = {
  product: Product | null;
  editingProductName: string;
  onEditingProductNameChange: (value: string) => void;
  editingProductPrice: string;
  onEditingProductPriceChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export function EditProductModal({
  product,
  editingProductName,
  onEditingProductNameChange,
  editingProductPrice,
  onEditingProductPriceChange,
  onClose,
  onSave
}: Props) {
  if (!product) {
    return null;
  }

  return (
    <div className="urreta-modal-backdrop" role="presentation">
      <div className="urreta-modal" role="dialog" aria-modal="true" aria-labelledby="edit-product-title">
        <div className="urreta-panel-heading">
          <h3 id="edit-product-title">Editar producto</h3>
          <p>Ajusta nombre y precio del producto seleccionado.</p>
        </div>

        <label className="urreta-field">
          <span>Nombre</span>
          <input
            value={editingProductName}
            onChange={(event) => onEditingProductNameChange(event.target.value)}
            className="urreta-input"
          />
        </label>

        <label className="urreta-field">
          <span>Precio</span>
          <input
            type="number"
            min="1"
            step="1"
            value={editingProductPrice}
            onChange={(event) => onEditingProductPriceChange(event.target.value)}
            className="urreta-input"
          />
        </label>

        <div className="urreta-actions urreta-actions--end">
          <button type="button" onClick={onClose} className="urreta-button urreta-button--secondary">
            Cancelar
          </button>
          <button type="button" onClick={onSave} className="urreta-button urreta-button--primary">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
