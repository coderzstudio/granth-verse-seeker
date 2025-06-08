
import React from 'react';
import { Book } from '@/types/book';
import { Calendar, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  book: Book;
  size?: 'normal' | 'small';
}

const BookCard: React.FC<BookCardProps> = ({ book, size = 'normal' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Add to recent books in localStorage (max 10 items)
    const recentBookIds = JSON.parse(localStorage.getItem('recentBooks') || '[]');
    const updatedIds = [book.id, ...recentBookIds.filter((id: string) => id !== book.id)].slice(0, 10);
    localStorage.setItem('recentBooks', JSON.stringify(updatedIds));
    
    navigate(`/book/${book.id}`);
  };

  const cardWidth = size === 'small' ? 'w-[140px]' : 'w-[180px]';
  const imageIconSize = size === 'small' ? 'h-12 w-12' : 'h-16 w-16';
  const titleClass = size === 'small' ? 'font-semibold text-sm' : 'font-bold text-lg';
  const padding = size === 'small' ? 'p-3' : 'p-4';

  return (
    <div 
      onClick={handleClick}
      className={`${cardWidth} h-full bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-orange-100 flex flex-col`}
    >
      {/* Book Image */}
      <div className="aspect-[3/4] bg-gradient-to-br from-orange-100 to-red-100 rounded-t-lg overflow-hidden p-2">
        {book.image_url ? (
          <img
            src={book.image_url}
            alt={book.title}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className={`${imageIconSize} text-orange-400`} />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className={`${padding} flex-1 flex flex-col`}>
        <h3 className={`${titleClass} text-gray-900 mb-2 line-clamp-2 flex-1`}>
          {book.title}
        </h3>

        {book.short_description && size === 'normal' && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-3">
            {book.short_description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            {book.category}
          </span>
        </div>

        {book.publication_year && size === 'normal' && (
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
