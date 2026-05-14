import { AppUpdateNotice } from "../shared/components/AppUpdateNotice";
import { BuildMetaCard } from "../shared/components/BuildMetaCard";
import { UrretaHomePage } from "../features/urreta/UrretaHomePage";

export function App() {
  return (
    <>
      <UrretaHomePage />
      <BuildMetaCard />
      <AppUpdateNotice />
    </>
  );
}
