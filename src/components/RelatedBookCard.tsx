
import React, { useEffect, useRef } from 'react';
import { Book } from '@/types/book';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RelatedBookCardProps {
  book: Book;
  isCached?: boolean;
  onVisible?: (id: string) => void;
  onHidden?: (id: string) => void;
}

const RelatedBookCard: React.FC<RelatedBookCardProps> = ({ 
  book, 
  isCached = false,
  onVisible,
  onHidden 
}) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!cardRef.current || (!onVisible && !onHidden)) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          onVisible?.(book.id);
        } else {
          onHidden?.(book.id);
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(cardRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [book.id, onVisible, onHidden]);

  const handleClick = () => {
    // Add to recent books in localStorage (max 10 items)
    const recentBookIds = JSON.parse(localStorage.getItem('recentBooks') || '[]');
    const updatedIds = [book.id, ...recentBookIds.filter((id: string) => id !== book.id)].slice(0, 10);
    localStorage.setItem('recentBooks', JSON.stringify(updatedIds));
    
    navigate(`/book/${book.id}`);
  };

  return (
    <div 
      ref={cardRef}
      onClick={handleClick}
      className="relative w-[200px] bg-white rounded-lg border border-orange-100 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden"
    >
      {/* Cached indicator */}
      {isCached && (
        <div className="absolute top-2 right-2 z-10">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Cached
          </span>
        </div>
      )}

      {/* Book Image */}
      <div className="h-[120px] bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
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
            <BookOpen className="h-12 w-12 text-orange-400" />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-3">
        <h4 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 leading-5">
          {book.title}
        </h4>
        
        {book.short_description && (
          <p className="text-xs text-gray-600 line-clamp-2 leading-4">
            {book.short_description}
          </p>
        )}
        
        <div className="mt-2">
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            {book.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RelatedBookCard;
