
import React from 'react';
import { Book } from '@/types/book';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HorizontalBookCardProps {
  book: Book;
}

const HorizontalBookCard: React.FC<HorizontalBookCardProps> = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Add to recent books in localStorage (max 10 items)
    const recentBookIds = JSON.parse(localStorage.getItem('recentBooks') || '[]');
    const updatedIds = [book.id, ...recentBookIds.filter((id: string) => id !== book.id)].slice(0, 10);
    localStorage.setItem('recentBooks', JSON.stringify(updatedIds));
    
    navigate(`/book/${book.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="w-full h-20 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-orange-100 flex items-center p-3"
    >
      {/* Book Image */}
      <div className="w-12 h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded overflow-hidden flex-shrink-0">
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
            <BookOpen className="h-6 w-6 text-orange-400" />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="ml-3 flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-gray-900 truncate">
          {book.title}
        </h3>
        {book.author && (
          <p className="text-xs text-gray-600 truncate mt-1">
            {book.author}
          </p>
        )}
      </div>
    </div>
  );
};

export default HorizontalBookCard;
