
import React from 'react';
import Navbar from '@/components/Navbar';
import ImageCarousel from '@/components/ImageCarousel';
import RecentBooksSection from '@/components/RecentBooksSection';
import ShastrasBooksSection from '@/components/ShastrasBooksSection';
import DonationSection from '@/components/DonationSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navbar */}
      <Navbar />
      
      {/* Add top margin to account for fixed navbar */}
      <div className="pt-16">
        {/* Auto-Scrolling Image Section */}
        <ImageCarousel />
        
        {/* Recent Books Section */}
        <RecentBooksSection />
        
        {/* Shastras Section - Top 10 most frequently read books */}
        <ShastrasBooksSection />
        
        {/* Donation Section */}
        <DonationSection />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
