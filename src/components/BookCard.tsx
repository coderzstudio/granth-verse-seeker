
import React from 'react';
import { Book } from '@/types/book';
import { Calendar, User, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${book.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-orange-100"
    >
      {/* Book Image */}
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
            <BookOpen className="h-16 w-16 text-orange-400" />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {book.title}
        </h3>
        
        {book.author && (
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <User className="h-4 w-4 mr-1" />
            <span className="truncate">{book.author}</span>
          </div>
        )}

        {book.short_description && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-3">
            {book.short_description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
            {book.language}
          </span>
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            {book.category}
          </span>
        </div>

        {book.publication_year && (
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{book.publication_year}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
