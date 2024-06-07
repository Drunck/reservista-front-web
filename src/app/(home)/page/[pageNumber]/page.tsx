import RestuarantCardtWrapper from "@/ui/custom-components/restaurants"

export default async function Pages({ params }: { params: { pageNumber: string } }) {
  const page = params.pageNumber ? parseInt(params.pageNumber) : 1;
  return (
    <div className="lg:w-full lg:max-w-7xl lg:m-auto px-4">
      <RestuarantCardtWrapper className="py-20" currentPage={page} />
    </div>
  )
}
