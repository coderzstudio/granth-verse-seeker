import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/types/book';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteLoad } from "@/hooks/useInfiniteLoad";

const RecentBooksSection = () => {
  const navigate = useNavigate();

  // Fetch recent books from localStorage
  const { data: recentBooks = [] } = useQuery({
    queryKey: ['recent-books-local'],
    queryFn: async () => {
      const recentBookIds = JSON.parse(localStorage.getItem('recentBooks') || '[]');
      if (recentBookIds.length === 0) return [];

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .in('id', recentBookIds);

      if (error) throw error;

      // Sort books according to the order in localStorage (most recent first)
      const sortedBooks = recentBookIds
        .map((id: string) => data?.find(book => book.id === id))
        .filter(Boolean) as Book[];

      return sortedBooks;
    }
  });

  // INFINITE LOAD: Only show a chunk, append more as user scrolls/clicks
  const { visibleItems, hasMore, loadMore } = useInfiniteLoad<Book>({ items: recentBooks, chunkSize: 5 });

  const scrollLeft = () => {
    const container = document.getElementById('recent-books');
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('recent-books');
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
    if (hasMore) {
      loadMore();
    }
  };

  const handleBookClick = (bookId: string) => {
    // Add to recent books in localStorage (max 10 items)
    const recentBookIds = JSON.parse(localStorage.getItem('recentBooks') || '[]');
    const updatedIds = [bookId, ...recentBookIds.filter((id: string) => id !== bookId)].slice(0, 10);
    localStorage.setItem('recentBooks', JSON.stringify(updatedIds));
    
    navigate(`/book/${bookId}`);
  };

  if (recentBooks.length === 0) {
    return (
      <section className="py-8 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">
            Recent
          </h2>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recent reading activity found. Start reading some books!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-left">
            Recent
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={scrollLeft}
              className="p-1 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={scrollRight}
              className="p-1 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              disabled={!hasMore}
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div
          id="recent-books"
          className="flex space-x-3 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {visibleItems.map((book) => (
            <div
              key={book.id}
              onClick={() => handleBookClick(book.id)}
              className="flex-shrink-0 w-32 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-orange-100 to-red-100 rounded-t-lg overflow-hidden">
                {book.image_url ? (
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-orange-400" />
                  </div>
                )}
              </div>
              <div className="p-2">
                <h4 className="font-semibold text-gray-900 text-xs line-clamp-2 mb-1">
                  {book.title}
                </h4>
                {book.author && (
                  <p className="text-xs text-gray-600 truncate">
                    {book.author}
                  </p>
                )}
              </div>
            </div>
          ))}
          {hasMore && (
            <button
              onClick={loadMore}
              className="flex items-center justify-center px-4 text-sm text-orange-700 font-bold hover:underline min-w-[64px] bg-orange-50 rounded-lg border border-orange-100"
              aria-label="Load more"
            >
              Load more
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecentBooksSection;
