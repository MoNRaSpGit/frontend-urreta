import type { RefObject } from "react";
import type { Client } from "../types";

type Props = {
  clientSearch: string;
  onClientSearchChange: (value: string) => void;
  visibleClients: Client[];
  filteredClientsLength: number;
  visibleClientCount: number;
  showCreateClient: boolean;
  onToggleCreateClient: () => void;
  newClientName: string;
  onNewClientNameChange: (value: string) => void;
  newClientPhone: string;
  onNewClientPhoneChange: (value: string) => void;
  onCreateClient: () => void;
  onSelectClient: (clientId: string) => void;
  onToggleVisibleClients: () => void;
  createClientFormRef: RefObject<HTMLDivElement | null>;
};

export function ClientStep({
  clientSearch,
  onClientSearchChange,
  visibleClients,
  filteredClientsLength,
  visibleClientCount,
  showCreateClient,
  onToggleCreateClient,
  newClientName,
  onNewClientNameChange,
  newClientPhone,
  onNewClientPhoneChange,
  onCreateClient,
  onSelectClient,
  onToggleVisibleClients,
  createClientFormRef
}: Props) {
  return (
    <section className="urreta-panel">
      <div className="urreta-panel-heading">
        <h2>Elegi el cliente</h2>
        <p>Busca un cliente existente o crea uno nuevo con el boton +.</p>
      </div>

      <div className="urreta-search-row">
        <input
          value={clientSearch}
          onChange={(event) => onClientSearchChange(event.target.value)}
          placeholder="Buscar cliente..."
          className="urreta-input"
        />
        <button type="button" onClick={onToggleCreateClient} className="urreta-button urreta-button--secondary urreta-button--square">
          +
        </button>
      </div>

      {showCreateClient ? (
        <div ref={createClientFormRef} className="urreta-subpanel">
          <strong>Nuevo cliente</strong>
          <label className="urreta-field">
            <span>Nombre</span>
            <input
              value={newClientName}
              onChange={(event) => onNewClientNameChange(event.target.value)}
              placeholder="Nombre del cliente"
              className="urreta-input"
            />
          </label>
          <label className="urreta-field">
            <span>Telefono</span>
            <input
              value={newClientPhone}
              onChange={(event) => onNewClientPhoneChange(event.target.value)}
              placeholder="099..."
              className="urreta-input"
            />
          </label>
          <div className="urreta-actions">
            <button type="button" onClick={onCreateClient} className="urreta-button urreta-button--primary">
              Guardar cliente
            </button>
            <button type="button" onClick={onToggleCreateClient} className="urreta-button urreta-button--secondary">
              Cancelar
            </button>
          </div>
        </div>
      ) : null}

      <div className="urreta-list">
        {visibleClients.map((client) => (
          <button key={client.id} type="button" onClick={() => onSelectClient(client.id)} className="urreta-list-item">
            <div className="urreta-list-copy">
              <strong>{client.name}</strong>
              <span>{client.phone || "Sin telefono"}</span>
            </div>
            <span className="urreta-badge">Elegir</span>
          </button>
        ))}
        {filteredClientsLength === 0 ? <div className="urreta-empty">No encontramos clientes con ese nombre.</div> : null}
        {filteredClientsLength > 3 ? (
          <button type="button" onClick={onToggleVisibleClients} className="urreta-button urreta-button--secondary">
            {visibleClientCount <= 3 ? "Ver mas" : "Ver menos"}
          </button>
        ) : null}
      </div>
    </section>
  );
}
