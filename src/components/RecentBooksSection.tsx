
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/types/book';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserReadingActivity {
  id: string;
  user_id: string;
  book_id: string;
  status: 'reading' | 'completed' | 'want_to_read';
  started_at: string;
  completed_at?: string;
  last_read_at?: string;
  books: Book;
}

const RecentBooksSection = () => {
  const navigate = useNavigate();

  // Fetch recent books that user has read or is reading
  const { data: recentBooks = [] } = useQuery({
    queryKey: ['recent-books'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_reading_activity')
        .select(`
          *,
          books (*)
        `)
        .eq('user_id', user.id)
        .in('status', ['reading', 'completed'])
        .order('last_read_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as UserReadingActivity[];
    }
  });

  const scrollLeft = () => {
    const container = document.getElementById('recent-books');
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('recent-books');
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (recentBooks.length === 0) {
    return (
      <section className="py-8 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">
            Recent
          </h2>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recent reading activity found. Start reading some books!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-left">
            Recent
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
          id="recent-books"
          className="flex space-x-3 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recentBooks.map((activity) => (
            <div
              key={activity.id}
              onClick={() => navigate(`/book/${activity.book_id}`)}
              className="flex-shrink-0 w-32 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-orange-100 to-red-100 rounded-t-lg overflow-hidden">
                {activity.books.image_url ? (
                  <img
                    src={activity.books.image_url}
                    alt={activity.books.title}
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
                  {activity.books.title}
                </h4>
                {activity.books.author && (
                  <p className="text-xs text-gray-600 truncate">
                    {activity.books.author}
                  </p>
                )}
                <div className="mt-1 flex items-center justify-between">
                  <span className="inline-block px-1 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                    {activity.books.language}
                  </span>
                  <span className={`text-xs font-medium ${
                    activity.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {activity.status === 'completed' ? '✓' : '📖'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentBooksSection;
