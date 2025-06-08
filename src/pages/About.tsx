
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Heart, Users, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About Sanatani Gyan</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Your gateway to sacred Hindu literature and spiritual wisdom
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto">
                Sanatani Gyan is dedicated to preserving and sharing the timeless wisdom of Hindu scriptures, 
                making sacred texts accessible to everyone seeking spiritual knowledge and enlightenment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BookOpen className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sacred Texts</h3>
                <p className="text-gray-600">Access to authentic Hindu scriptures and spiritual literature</p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Spiritual Growth</h3>
                <p className="text-gray-600">Foster spiritual development through ancient wisdom</p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600">Building a community of spiritual seekers and learners</p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600">Commitment to quality and authenticity in all our content</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Comprehensive Library</h3>
                  <p className="text-gray-700">
                    Our extensive collection includes Vedas, Puranas, Upanishads, Bhagavad Gita, 
                    Ramayana, Mahabharata, and many other sacred texts that form the foundation 
                    of Hindu philosophy and spirituality.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Access</h3>
                  <p className="text-gray-700">
                    All texts are available in digital format, making it easy to read, search, 
                    and study these profound works anytime, anywhere. Our platform is designed 
                    for both casual readers and serious scholars.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-gray-700 mb-6">
                We envision a world where the profound wisdom of Hindu scriptures is easily accessible 
                to all seekers, regardless of their background or location. Through technology and 
                dedication, we aim to bridge the gap between ancient wisdom and modern life.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Journey</h2>
              <p className="text-gray-700">
                Whether you're beginning your spiritual journey or deepening your understanding 
                of Hindu philosophy, Sanatani Gyan is here to support you. Explore our collection, 
                discover new insights, and connect with the timeless wisdom that has guided 
                countless souls throughout history.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
