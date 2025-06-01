
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselImage {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
  display_order: number;
}

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch carousel images from Supabase
  const { data: images = [] } = useQuery({
    queryKey: ['carousel-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carousel_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data as CarouselImage[];
    }
  });

  // Auto-scroll functionality
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // 4 seconds

      return () => clearInterval(interval);
    }
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  if (images.length === 0) {
    return (
      <div className="relative h-64 max-w-4xl bg-gradient-to-r from-orange-200 to-red-200 flex items-center justify-center mx-auto">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700 mb-2">Welcome to Sanatani Gyan</div>
          <div className="text-gray-600">Sacred Hindu Literature & Spiritual Texts</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-64 max-w-4xl overflow-hidden bg-gray-900 mx-auto">
      {/* Images */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={image.id} className="w-full h-full flex-shrink-0 relative">
            <img
              src={image.image_url}
              alt={image.title || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white px-4">
                {image.title && (
                  <h2 className="text-4xl font-bold mb-4">{image.title}</h2>
                )}
                {image.description && (
                  <p className="text-xl">{image.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
