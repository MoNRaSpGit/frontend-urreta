import { AppUpdateNotice } from "../shared/components/AppUpdateNotice";
import { UrretaHomePage } from "../features/urreta/UrretaHomePage";

export function App() {
  return (
    <>
      <UrretaHomePage />
      <AppUpdateNotice />
    </>
  );
}
