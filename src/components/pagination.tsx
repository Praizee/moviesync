import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  // Limit total pages to a reasonable number
  const maxPages = Math.min(totalPages, 500);

  // Calculate page range to display
  const getPageRange = () => {
    const range = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > maxPages) {
      endPage = maxPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  };

  const pageRange = getPageRange();

  return (
    <div className="flex items-center justify-center min-[390px]:gap-1 gap-8 mt-8">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link
            href={`${baseUrl}?page=${currentPage - 1}`}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}
      </Button>

      {/* hidden sm:block */}
      <div className="hidden min-[390px]:flex items-center justify-center gap-1">
        {pageRange[0] > 1 && (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href={`${baseUrl}?page=1`}>1</Link>
            </Button>
            {pageRange[0] > 2 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}
          </>
        )}

        {pageRange.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            asChild={currentPage !== page}
          >
            {currentPage !== page ? (
              <Link href={`${baseUrl}?page=${page}`}>{page}</Link>
            ) : (
              <span>{page}</span>
            )}
          </Button>
        ))}

        {pageRange[pageRange.length - 1] < maxPages && (
          <>
            {pageRange[pageRange.length - 1] < maxPages - 1 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href={`${baseUrl}?page=${maxPages}`}>{maxPages}</Link>
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= maxPages}
        asChild={currentPage < maxPages}
      >
        {currentPage < maxPages ? (
          <Link
            href={`${baseUrl}?page=${currentPage + 1}`}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  );
}

