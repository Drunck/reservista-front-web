import { PaginationsSchema, TPaginationProps } from "@/lib/types";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function Pagination({ currentPage = 1, totalPages = 1, baseUrl, queryParams = undefined }: TPaginationProps) {
  const result = PaginationsSchema.safeParse({ currentPage, totalPages, baseUrl, queryParams });
  if (!result.success) {
    console.log("ERROR PAGINATION", result.error.issues);
  }
  const generatePageLink = (page: number) => {
    if (queryParams) {
      const params = new URLSearchParams({ ...queryParams, page: page.toString() });
      return `${baseUrl}?${params.toString()}`;
    }
    return `${baseUrl}/${page}`;
  };

  const getPageNumbers = () => {
    if (totalPages < 10) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 5) {
      return [1, 2, 3, 4, "...", totalPages];
    } else if (currentPage > totalPages - 3) {
      return [1, "...", totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      return [1, "...", currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, "...", totalPages];
    }
  };

  console.log("GET PAGE NUMBERS", getPageNumbers());
  return (
    <div className="mx-auto flex w-full justify-center">
      <ul className="flex flex-row items-center gap-1">
        {currentPage > 1 && (
          <li>
            <Link href={generatePageLink(currentPage - 1)} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition duration-300 hover:bg-[--dark-blue-1] gap-1 pl-2.5 py-2 px-4 h-10 hover:text-white">
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Link>
          </li>
        )}
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <li key={index}>
              <Link href={generatePageLink(page)} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition duration-300 hover:bg-[--dark-blue-1] w-10 h-10 ${page === currentPage ? "bg-black text-white" : ""} hover:text-white`}>
                {page}
              </Link>
            </li>
          ) : (
            <li key={index} className="flex h-9 w-9 items-center justify-center">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More pages</span>
            </li>
          )
        )}
        {currentPage < totalPages && (
          <li>
            <Link href={generatePageLink(currentPage + 1)} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition duration-300 hover:bg-[--dark-blue-1] gap-1 pr-2.5 py-2 px-4 h-10 hover:text-white">
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}
