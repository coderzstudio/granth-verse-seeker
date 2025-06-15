
import { useEffect, useRef, useCallback, useState } from "react";

interface UseInfiniteLoadProps<T> {
  items: T[];
  chunkSize?: number;
}

/**
 * useInfiniteLoad
 * Only exposes and renders the initial chunk, appending more as "load more" is called.
 */
export function useInfiniteLoad<T>({
  items,
  chunkSize = 5,
}: UseInfiniteLoadProps<T>) {
  const [visibleCount, setVisibleCount] = useState(chunkSize);

  // When items change, reset visibleCount
  useEffect(() => {
    setVisibleCount(chunkSize);
  }, [items, chunkSize]);

  // Function to load more
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + chunkSize, items.length));
  }, [items.length, chunkSize]);

  // If infinite (all loaded), don't show extra
  const hasMore = visibleCount < items.length;

  return {
    visibleItems: items.slice(0, visibleCount),
    hasMore,
    loadMore,
  };
}
