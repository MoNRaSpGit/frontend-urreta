import type { CSSProperties } from "react";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(213,107,29,0.16), transparent 32%), linear-gradient(180deg, #f7f1e8 0%, #efe5d8 100%)",
  color: "#2a2018"
};

const wrapStyle: CSSProperties = {
  width: "min(1120px, calc(100% - 32px))",
  margin: "0 auto",
  padding: "48px 0 64px",
  display: "grid",
  gap: 24
};

const heroStyle: CSSProperties = {
  display: "grid",
  gap: 14,
  padding: "32px",
  borderRadius: 28,
  border: "1px solid rgba(80, 50, 20, 0.12)",
  background: "rgba(255,255,255,0.72)",
  boxShadow: "0 24px 60px rgba(84, 49, 15, 0.10)"
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 18
};

const cardStyle: CSSProperties = {
  padding: 22,
  borderRadius: 24,
  border: "1px solid rgba(80, 50, 20, 0.12)",
  background: "rgba(255,255,255,0.82)",
  boxShadow: "0 18px 40px rgba(84, 49, 15, 0.08)",
  display: "grid",
  gap: 8
};

const chipStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  padding: "8px 12px",
  borderRadius: 999,
  background: "#d56b1d",
  color: "#fff8f2",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase"
};

export function UrretaHomePage() {
  return (
    <main style={pageStyle}>
      <div style={wrapStyle}>
        <section style={heroStyle}>
          <span style={chipStyle}>Urreta</span>
          <h1 style={{ margin: 0, fontSize: "clamp(2.4rem, 6vw, 4.8rem)", lineHeight: 0.94 }}>
            Modulo nuevo listo para empezar.
          </h1>
          <p style={{ margin: 0, maxWidth: 760, fontSize: 18, lineHeight: 1.6, color: "#5b4736" }}>
            Dejamos una base limpia para construir el flujo real de Urreta sin arrastrar ruido de otros modulos.
            Ya esta preparada para crecer con API, auth, reportes y vistas operativas.
          </p>
        </section>

        <section style={gridStyle}>
          <article style={cardStyle}>
            <strong>Estructura lista</strong>
            <span>Vite, React, TypeScript, lint, smoke y build metadata preparados.</span>
          </article>
          <article style={cardStyle}>
            <strong>Deploy ready</strong>
            <span>La app ya nace con `build:gh`, `deploy` y `app-build.json` como nuestros otros frontends.</span>
          </article>
          <article style={cardStyle}>
            <strong>Proximo paso</strong>
            <span>Definir el objetivo del modulo y conectar la primera entidad real del negocio.</span>
          </article>
        </section>
      </div>
    </main>
  );
}
