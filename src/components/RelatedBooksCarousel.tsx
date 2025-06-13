
import React, { useRef, useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RelatedBookCard from '@/components/RelatedBookCard';
import RelatedBookSkeleton from '@/components/RelatedBookSkeleton';
import { BookCacheManager, CachedBook } from '@/utils/bookCache';

interface RelatedBooksCarouselProps {
  books: Book[];
  currentBookId: string;
  isLoading?: boolean;
}

const RelatedBooksCarousel: React.FC<RelatedBooksCarouselProps> = ({ 
  books, 
  currentBookId,
  isLoading = false 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleBookIds, setVisibleBookIds] = useState<string[]>([]);
  const [cachedBooks, setCachedBooks] = useState<CachedBook[]>([]);
  const [showCached, setShowCached] = useState(false);

  // Load cached books on mount
  useEffect(() => {
    const cache = BookCacheManager.getCacheData();
    if (cache && cache.lastViewedBooks.currentBook === currentBookId) {
      const cached = BookCacheManager.getCachedBooks(cache.lastViewedBooks.viewportBooks);
      setCachedBooks(cached);
      setShowCached(true);
    }
  }, [currentBookId]);

  // Update cache when books change
  useEffect(() => {
    if (books.length > 0) {
      BookCacheManager.updateCache(currentBookId, visibleBookIds, books);
      // Hide cached books when fresh data arrives
      if (showCached) {
        setShowCached(false);
      }
    }
  }, [books, currentBookId, visibleBookIds, showCached]);

  const handleBookVisible = (bookId: string) => {
    setVisibleBookIds(prev => {
      if (!prev.includes(bookId)) {
        return [...prev, bookId];
      }
      return prev;
    });
  };

  const handleBookHidden = (bookId: string) => {
    setVisibleBookIds(prev => prev.filter(id => id !== bookId));
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  // Determine what to show
  const displayBooks = books.length > 0 ? books : (showCached ? cachedBooks : []);
  const shouldShowSkeletons = isLoading && displayBooks.length === 0;

  if (shouldShowSkeletons) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Related Books</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" disabled className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <RelatedBookSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (displayBooks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Related Books</h3>
        <p className="text-gray-500 text-center py-8">No related books found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-gray-900">Related Books</h3>
          {showCached && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              From Cache
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none'
        }}
      >
        {displayBooks.map((book) => (
          <div key={book.id} className="flex-shrink-0">
            <RelatedBookCard 
              book={book}
              isCached={showCached}
              onVisible={handleBookVisible}
              onHidden={handleBookHidden}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedBooksCarousel;
