export const dynamic = "force-dynamic";

import RestuarantCardtWrapper from "@/ui/custom-components/restaurants"

export default async function Home() {
  return (
    <div className="lg:w-full lg:max-w-7xl lg:m-auto px-4">
      <RestuarantCardtWrapper className="pt-20" />
    </div>
  );
}
