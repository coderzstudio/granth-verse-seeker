import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Book, Language } from '@/types/book';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LanguageBooksSection = () => {
  const navigate = useNavigate();

  // Fetch languages with error handling
  const { 
    data: languages = [], 
    isLoading: loadingLanguages,
    error: languagesError 
  } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('languages').select('*');
      if (error) throw error;
      return data as Language[];
    }
  });

  // Fetch books grouped by language with error handling
  const { 
    data: booksByLanguage = {}, 
    isLoading: loadingBooks,
    error: booksError 
  } = useQuery({
    queryKey: ['books-by-language'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Group books by language
      const grouped = (data as Book[]).reduce((acc, book) => {
        if (!acc[book.language]) {
          acc[book.language] = [];
        }
        acc[book.language].push(book);
        return acc;
      }, {} as Record<string, Book[]>);
      
      return grouped;
    }
  });

  // Debug logs
  console.log('Languages:', languages);
  console.log('Books by language:', booksByLanguage);
  if (languagesError) console.error('Languages error:', languagesError);
  if (booksError) console.error('Books error:', booksError);

  const scrollLeft = (languageName: string) => {
    const container = document.getElementById(`language-${languageName}`);
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = (languageName: string) => {
    const container = document.getElementById(`language-${languageName}`);
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Loading state
  if (loadingLanguages || loadingBooks) {
    return (
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (languagesError || booksError) {
    return (
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            Error loading books. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (languages.length === 0 || Object.keys(booksByLanguage).length === 0) {
    return (
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            No books available at the moment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {languages.map((language) => {
            const books = booksByLanguage[language.name] || [];
            if (books.length === 0) return null;

            return (
              <div key={language.id}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {language.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => scrollLeft(language.name)}
                      className="p-1 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 text-orange-600" />
                    </button>
                    <button
                      onClick={() => scrollRight(language.name)}
                      className="p-1 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-orange-600" />
                    </button>
                  </div>
                </div>
                
                <div
                  id={`language-${language.name}`}
                  className="flex space-x-3 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {books.slice(0, 10).map((book) => (
                    <div
                      key={book.id}
                      onClick={() => navigate(`/book/${book.id}`)}
                      className="flex-shrink-0 w-32 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-orange-100"
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
                        <div className="mt-1">
                          <span className="inline-block px-1 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                            {book.category}
                          </span>
                        </div>
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

export default LanguageBooksSection;
