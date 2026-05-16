import "./styles/urreta-home.css";
import { ClientStep } from "./components/ClientStep";
import { EditProductModal } from "./components/EditProductModal";
import { OrderStep } from "./components/OrderStep";
import { ProductsStep } from "./components/ProductsStep";
import { RecordStep } from "./components/RecordStep";
import { UrretaHero } from "./components/UrretaHero";
import { UrretaSteps } from "./components/UrretaSteps";
import { useUrretaDemo } from "./hooks/useUrretaDemo";

export function UrretaHomePage() {
  const urreta = useUrretaDemo();

  return (
    <main className="urreta-page">
      <div className="urreta-wrap">
        <UrretaHero />
        <UrretaSteps
          activeStep={urreta.activeStep}
          canGoOrder={urreta.canGoOrder}
          canGoRecord={urreta.canGoRecord}
          onStepChange={urreta.setActiveStep}
        />

        {urreta.activeStep === "client" ? (
          <ClientStep
            clientSearch={urreta.clientSearch}
            onClientSearchChange={urreta.setClientSearch}
            visibleClients={urreta.visibleClients}
            filteredClientsLength={urreta.filteredClients.length}
            visibleClientCount={urreta.visibleClientCount}
            showCreateClient={urreta.showCreateClient}
            onToggleCreateClient={() => urreta.setShowCreateClient((current) => !current)}
            newClientName={urreta.newClientName}
            onNewClientNameChange={urreta.setNewClientName}
            newClientPhone={urreta.newClientPhone}
            onNewClientPhoneChange={urreta.setNewClientPhone}
            onCreateClient={urreta.handleCreateClient}
            onSelectClient={urreta.handleSelectClient}
            onToggleVisibleClients={urreta.handleToggleVisibleClients}
            createClientFormRef={urreta.createClientFormRef}
          />
        ) : null}

        {urreta.activeStep === "order" ? (
          <OrderStep
            selectedClient={urreta.selectedClient}
            productSearch={urreta.productSearch}
            onProductSearchChange={urreta.setProductSearch}
            filteredProducts={urreta.filteredProducts}
            currentItems={urreta.currentItems}
            currentOrderTotal={urreta.currentOrderTotal}
            onAddProduct={urreta.handleAddProduct}
            onChangeItemQuantity={urreta.handleChangeItemQuantity}
            onSaveOrder={urreta.handleSaveOrder}
            onBackToClients={() => urreta.setActiveStep("client")}
          />
        ) : null}

        {urreta.activeStep === "record" ? (
          <RecordStep lastSavedOrder={urreta.lastSavedOrder} onStartNewFlow={urreta.handleStartNewFlow} />
        ) : null}

        {urreta.activeStep === "products" ? (
          <ProductsStep
            productCatalogSearch={urreta.productCatalogSearch}
            onProductCatalogSearchChange={urreta.setProductCatalogSearch}
            visibleCatalogProducts={urreta.visibleCatalogProducts}
            onOpenEditProduct={urreta.handleOpenEditProduct}
          />
        ) : null}
      </div>

      <EditProductModal
        product={urreta.editingProduct}
        editingProductName={urreta.editingProductName}
        onEditingProductNameChange={urreta.setEditingProductName}
        editingProductPrice={urreta.editingProductPrice}
        onEditingProductPriceChange={urreta.setEditingProductPrice}
        onClose={urreta.handleCloseEditProduct}
        onSave={urreta.handleSaveProduct}
      />
    </main>
  );
}
