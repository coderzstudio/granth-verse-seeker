
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/types/book';
import BookCard from './BookCard';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface BookWithReadCount {
  book_id: string;
  read_count: number;
  books: Book;
}

const ShastrasBooksSection = () => {
  // Fetch top 10 most frequently read books
  const { data: topBooks = [] } = useQuery({
    queryKey: ['top-shastras-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_reading_activity')
        .select(`
          book_id,
          books (*)
        `)
        .in('status', ['reading', 'completed'])
        .order('last_read_at', { ascending: false });
      
      if (error) throw error;

      // Count frequency of each book
      const bookCounts = new Map<string, { count: number; book: Book }>();
      
      data.forEach((activity: any) => {
        const bookId = activity.book_id;
        const book = activity.books;
        
        if (bookCounts.has(bookId)) {
          bookCounts.get(bookId)!.count += 1;
        } else {
          bookCounts.set(bookId, { count: 1, book });
        }
      });

      // Convert to array and sort by count
      const sortedBooks = Array.from(bookCounts.entries())
        .map(([bookId, { count, book }]) => ({
          book_id: bookId,
          read_count: count,
          books: book
        }))
        .sort((a, b) => b.read_count - a.read_count)
        .slice(0, 10);

      return sortedBooks as BookWithReadCount[];
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

  if (topBooks.length === 0) {
    return (
      <section className="py-8 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">
            Shastras
          </h2>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No popular books found yet. Start reading to see the most popular Shastras!</p>
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
          {topBooks.map((item) => (
            <div key={item.book_id} className="flex-shrink-0">
              <BookCard book={item.books} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShastrasBooksSection;
