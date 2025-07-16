import { useState, useMemo } from "react";

interface UseInfiniteScrollOptions<T> {
  items: T[];
  itemsPerPage?: number;
}

export function useInfiniteScroll<T>({
  items,
  itemsPerPage = 10,
}: UseInfiniteScrollOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const displayedItems = useMemo(() => {
    return items.slice(0, currentPage * itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const loadMore = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCurrentPage((prev) => prev + 1);
    setIsLoading(false);
  };

  const hasMore = displayedItems.length < items.length;

  const resetItems = () => {
    setCurrentPage(1);
    setIsLoading(false);
  };

  return {
    displayedItems,
    hasMore,
    isLoading,
    loadMore,
    resetItems,
  };
}
