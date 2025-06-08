import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import HorizontalBookCard from '@/components/HorizontalBookCard';
import { Book } from '@/types/book';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Books: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Fetch all books
  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');
      
      if (error) throw error;
      return data as Book[];
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Filter books based on search query and selected category
  const filteredBooks = books.filter(book => {
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group books by category
  const booksByCategory = filteredBooks.reduce((acc, book) => {
    if (!acc[book.category]) {
      acc[book.category] = [];
    }
    acc[book.category].push(book);
    return acc;
  }, {} as Record<string, Book[]>);

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  // Get unique categories from books
  const uniqueCategories = [...new Set(books.map(book => book.category))].sort();

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Loading books...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Section */}
          <div className="flex items-center gap-4 mb-8 w-full">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex-1">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                books={books}
              />
            </div>
          </div>

          {/* Books by Category */}
          {Object.keys(booksByCategory).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(booksByCategory).map(([category, categoryBooks]) => (
                <Collapsible 
                  key={category} 
                  open={!collapsedCategories.has(category)}
                  onOpenChange={() => toggleCategory(category)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">({categoryBooks.length} books)</span>
                      {collapsedCategories.has(category) ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {categoryBooks.map((book) => (
                        <HorizontalBookCard key={book.id} book={book} className="rounded-lg" />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Books;
