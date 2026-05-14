import { useEffect, useState, type CSSProperties } from "react";
import { getAppBuildMeta, type AppBuildMeta } from "../config/build";

const cardStyle: CSSProperties = {
  position: "fixed",
  right: 16,
  bottom: 16,
  zIndex: 20,
  display: "grid",
  gap: 4,
  padding: "12px 14px",
  borderRadius: 18,
  background: "rgba(31, 21, 12, 0.88)",
  color: "#f7efe3",
  boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
  fontSize: 12
};

export function BuildMetaCard() {
  const [meta, setMeta] = useState<AppBuildMeta | null>(null);

  useEffect(() => {
    let active = true;

    void getAppBuildMeta().then((nextMeta) => {
      if (active) {
        setMeta(nextMeta);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (!meta) {
    return null;
  }

  return (
    <aside style={cardStyle}>
      <strong>Urreta</strong>
      <span>v{meta.version}</span>
      <span>{meta.releaseSha}</span>
    </aside>
  );
}
