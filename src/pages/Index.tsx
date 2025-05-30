
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Book, Language, Category } from '@/types/book';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Fetch books with filters
  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ['books', searchQuery, selectedLanguage, selectedCategory],
    queryFn: async () => {
      let query = supabase.from('books').select('*');
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }
      
      if (selectedLanguage) {
        query = query.eq('language', selectedLanguage);
      }
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Book[];
    }
  });

  // Fetch languages for filter
  const { data: languages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('languages').select('*');
      if (error) throw error;
      return data as Language[];
    }
  });

  // Fetch categories for filter
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return data as Category[];
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              🕉️ Sanatani Gyan
            </h1>
            <p className="text-lg md:text-xl text-orange-100">
              Sacred Hindu Literature & Spiritual Texts
            </p>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery}
            books={books}
          />
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterSidebar
              languages={languages}
              categories={categories}
              selectedLanguage={selectedLanguage}
              selectedCategory={selectedCategory}
              onLanguageChange={setSelectedLanguage}
              onCategoryChange={setSelectedCategory}
            />
          </aside>

          {/* Books Grid */}
          <main className="flex-1">
            {booksLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <span className="ml-2 text-gray-600">Loading sacred texts...</span>
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Sacred Texts ({books.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
