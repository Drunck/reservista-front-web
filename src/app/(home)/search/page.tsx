export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import SearchPageComponent from "./search-page-component";

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageComponent />
    </Suspense>
  )
}
