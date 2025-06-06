
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Book, Category } from '@/types/book';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CategoryBooksSection = () => {
  const navigate = useNavigate();

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return data as Category[];
    }
  });

  // Fetch books grouped by category
  const { data: booksByCategory = {} } = useQuery({
    queryKey: ['books-by-category'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Group books by category
      const grouped = (data as Book[]).reduce((acc, book) => {
        if (!acc[book.category]) {
          acc[book.category] = [];
        }
        acc[book.category].push(book);
        return acc;
      }, {} as Record<string, Book[]>);
      
      return grouped;
    }
  });

  const scrollLeft = (categoryName: string) => {
    const container = document.getElementById(`category-${categoryName}`);
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = (categoryName: string) => {
    const container = document.getElementById(`category-${categoryName}`);
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">
          Category
        </h2>
        
        <div className="space-y-8">
          {categories.map((category) => {
            const books = booksByCategory[category.name] || [];
            if (books.length === 0) return null;

            return (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {category.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => scrollLeft(category.name)}
                      className="p-1 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => scrollRight(category.name)}
                      className="p-1 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div
                  id={`category-${category.name}`}
                  className="flex space-x-3 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {books.slice(0, 10).map((book) => (
                    <div
                      key={book.id}
                      onClick={() => navigate(`/book/${book.id}`)}
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryBooksSection;
