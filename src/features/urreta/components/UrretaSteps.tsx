import type { Step } from "../types";

type Props = {
  activeStep: Step | null;
  canGoOrder: boolean;
  canGoRecord: boolean;
  onStepChange: (step: Step) => void;
};

const STEPS: Array<{ step: Step; label: string }> = [
  { step: "client", label: "1. Cliente" },
  { step: "order", label: "2. Pedido" },
  { step: "record", label: "3. Registro" },
  { step: "products", label: "4. Productos" }
];

export function UrretaSteps({ activeStep, canGoOrder, canGoRecord, onStepChange }: Props) {
  return (
    <section className="urreta-steps">
      {STEPS.map(({ step, label }) => {
        const enabled = step === "client" || step === "products" || (step === "order" ? canGoOrder : canGoRecord);

        return (
          <button
            key={step}
            type="button"
            onClick={() => {
              if (enabled) {
                onStepChange(step);
              }
            }}
            className={`urreta-step-button ${activeStep === step ? "is-active" : ""} ${enabled ? "" : "is-disabled"}`.trim()}
          >
            {label}
          </button>
        );
      })}
    </section>
  );
}
