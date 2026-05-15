import { useEffect, useState, type CSSProperties } from "react";
import { FRONTEND_BUILD_INFO, getAvailableBuildMeta, type AppBuildMeta } from "../config/build";

const UPDATE_CHECK_INTERVAL_MS = 2 * 60 * 1000;

const noticeStyle: CSSProperties = {
  position: "fixed",
  left: "50%",
  bottom: 24,
  transform: "translateX(-50%)",
  zIndex: 30,
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "14px 16px",
  borderRadius: 18,
  background: "#1f150c",
  color: "#fff7ed",
  boxShadow: "0 16px 40px rgba(0,0,0,0.22)"
};

const buttonStyle: CSSProperties = {
  border: "none",
  borderRadius: 999,
  padding: "9px 14px",
  background: "#a84d12",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer"
};

export function AppUpdateNotice() {
  const [availableBuild, setAvailableBuild] = useState<AppBuildMeta | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) {
      return;
    }

    let active = true;

    const checkForUpdate = async () => {
      const nextBuild = await getAvailableBuildMeta();
      if (!active || !nextBuild) {
        return;
      }

      if (nextBuild.releaseSha && nextBuild.releaseSha !== FRONTEND_BUILD_INFO.releaseSha) {
        setAvailableBuild(nextBuild);
      } else {
        setAvailableBuild(null);
      }
    };

    void checkForUpdate();
    const intervalId = window.setInterval(() => {
      void checkForUpdate();
    }, UPDATE_CHECK_INTERVAL_MS);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        void checkForUpdate();
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, []);

  function handleUpdate() {
    setIsUpdating(true);
    window.setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  if (!availableBuild && !isUpdating) {
    return null;
  }

  return (
    <div style={noticeStyle}>
      <span>{isUpdating ? "Actualizando..." : "Hay una actualizacion disponible."}</span>
      {!isUpdating ? (
        <button type="button" onClick={handleUpdate} style={buttonStyle}>
          Actualizar
        </button>
      ) : null}
    </div>
  );
}
