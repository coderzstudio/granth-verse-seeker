
import React from 'react';
import Navbar from '@/components/Navbar';
import ImageCarousel from '@/components/ImageCarousel';
import CategoryBooksSection from '@/components/CategoryBooksSection';
import LanguageBooksSection from '@/components/LanguageBooksSection';
import DonationSection from '@/components/DonationSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navbar */}
      <Navbar />
      
      {/* Add top margin to account for fixed navbar */}
      <div className="pt-16">
        {/* Auto-Scrolling Image Section */}
        <ImageCarousel />
        
        {/* Category-wise Horizontal Book Cards */}
        <CategoryBooksSection />
        
        {/* Language-wise Horizontal Book Cards */}
        <LanguageBooksSection />
        
        {/* Donation Section */}
        <DonationSection />
      </div>
    </div>
  );
};

export default Index;
