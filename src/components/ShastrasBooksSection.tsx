import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/types/book';
import BookCard from './BookCard';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

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

  const scrollLeft = () => {
    const container = document.getElementById('shastras-books');
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('shastras-books');
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (shastrasBooks.length === 0) {
    return (
      <section className="py-8 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">
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
          <h2 className="text-2xl font-bold text-gray-900 text-left">
            Shastras
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
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div
          id="shastras-books"
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {shastrasBooks.map((book) => (
            <div key={book.id} className="flex-shrink-0">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShastrasBooksSection;
