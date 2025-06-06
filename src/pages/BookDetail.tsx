
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/types/book';
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react';
import BookCard from '@/components/BookCard';
import PDFViewer from '@/components/PDFViewer';
import { Button } from '@/components/ui/button';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch book details
  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Book;
    },
    enabled: !!id
  });

  // Fetch related books
  const { data: relatedBooks = [] } = useQuery({
    queryKey: ['related-books', book?.category, id],
    queryFn: async () => {
      if (!book) return [];
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('category', book.category)
        .neq('id', book.id)
        .limit(4);
      
      if (error) throw error;
      return data as Book[];
    },
    enabled: !!book
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Book not found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-64 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg overflow-hidden">
                    {book.image_url ? (
                      <img
                        src={book.image_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">📖</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Book Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
                  
                  {book.author && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <User className="h-5 w-5 mr-2" />
                      <span className="text-lg">{book.author}</span>
                    </div>
                  )}

                  {book.publication_year && (
                    <div className="flex items-center text-gray-600 mb-4">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{book.publication_year}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                      {book.category}
                    </span>
                  </div>

                  {book.tags && book.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <Tag className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Tags:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {book.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {book.description && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              </div>
            )}

            {/* PDF Viewer */}
            {book.pdf_drive_link && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Read Online</h2>
                <PDFViewer pdfUrl={book.pdf_drive_link} title={book.title} />
              </div>
            )}
          </div>

          {/* Sidebar - Related Books */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Related Books</h3>
              {relatedBooks.length > 0 ? (
                <div className="space-y-4">
                  {relatedBooks.map((relatedBook) => (
                    <div key={relatedBook.id} className="transform scale-95">
                      <BookCard book={relatedBook} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No related books found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
