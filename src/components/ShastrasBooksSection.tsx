import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/types/book';
import BookCard from './BookCard';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useInfiniteLoad } from "@/hooks/useInfiniteLoad";

const ShastrasBooksSection = () => {
  // Fetch books with hybrid algorithm: random initially, then by popularity
  const { data: shastrasBooks = [] } = useQuery({
    queryKey: ['shastras-books'],
    queryFn: async () => {
      // First, try to get books sorted by open_count (popularity-based)
      const { data: popularBooks, error: popularError } = await supabase
        .from('books')
        .select('*')
        .gt('open_count', 0)
        .order('open_count', { ascending: false })
        .limit(10);
      
      if (popularError) throw popularError;

      // If we have enough popular books (books that have been opened), return them
      if (popularBooks && popularBooks.length >= 10) {
        return popularBooks as Book[];
      }

      // Otherwise, fill the remaining spots with random books
      const remainingSlots = 10 - (popularBooks?.length || 0);
      
      const { data: randomBooks, error: randomError } = await supabase
        .from('books')
        .select('*')
        .eq('open_count', 0)
        .order('created_at', { ascending: false })
        .limit(remainingSlots);
      
      if (randomError) throw randomError;

      // Combine popular books with random books
      const combinedBooks = [
        ...(popularBooks || []),
        ...(randomBooks || [])
      ].slice(0, 10);

      return combinedBooks as Book[];
    }
  });

  // Virtualize the visible books list with incremental loading
  const { visibleItems, hasMore, loadMore } = useInfiniteLoad({ items: shastrasBooks, chunkSize: 5 });

  if (shastrasBooks.length === 0) {
    return (
      <section className="py-8 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-left">
            Shastras
          </h2>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No books found. Check back later for popular Shastras!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 text-left">
            Shastras
          </h2>
          <Link to="/books">
            <Button className="hover:bg-gray-30">
              View All
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visibleItems.map((book) => (
            <div key={book.id} className="h-[280px]">
              <BookCard book={book} size="small" />
            </div>
          ))}
          {hasMore && (
            <div className="flex items-center justify-center">
              <button
                className="px-4 py-2 mt-2 text-sm text-orange-800 font-medium bg-orange-100 hover:bg-orange-200 rounded-xl"
                onClick={loadMore}
                aria-label="Load more shastras"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShastrasBooksSection;
