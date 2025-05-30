
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Book } from '@/types/book';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  books: Book[];
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, books }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = books
        .filter(book => 
          book.title.toLowerCase().includes(value.toLowerCase()) ||
          book.author?.toLowerCase().includes(value.toLowerCase()) ||
          book.category.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [value, books]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (book: Book) => {
    onChange(book.title);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    onChange('');
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for books, authors, or categories..."
          className="w-full pl-12 pr-12 py-4 text-lg border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors bg-white shadow-sm"
        />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Live Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((book) => (
            <button
              key={book.id}
              onClick={() => handleSuggestionClick(book)}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{book.title}</div>
              <div className="text-sm text-gray-500 mt-1">
                {book.author && `by ${book.author} • `}
                {book.category}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
