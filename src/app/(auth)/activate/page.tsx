import { Suspense } from "react";
import ActivateAccountPage from "./activate-page-component";

export default function AccountActivatePage() {
  return (
    <Suspense>
      <ActivateAccountPage />
    </Suspense>
  )
}
