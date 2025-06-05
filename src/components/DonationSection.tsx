
import React from 'react';
import { Heart, Users, BookOpen, Globe } from 'lucide-react';

const DonationSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative">
            <img
              src="https://i.postimg.cc/7LbhHLcm/a94ce74134950bd24ca6a56b59c64919.jpg?w=600&h=400&fit=crop"
              alt="Support Free Education"
              className="rounded-lg shadow-2xl w-full h-60 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold mb-4">
              Support Our Mission to Promote Free Education
            </h2>
            <p className="text-xl text-orange-100 mb-6">
              Join us in spreading sacred knowledge and making Hindu literature accessible to everyone, everywhere. Your support helps us digitize, preserve, and share ancient wisdom for future generations.
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-2">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">300+</div>
                <div className="text-sm text-orange-100">Books Digitized</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">1K+</div>
                <div className="text-sm text-orange-100">Readers Served</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-2">
                  <Globe className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">8+</div>
                <div className="text-sm text-orange-100">Languages</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mx-auto mb-2">
                  <Heart className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-orange-100">Free Access</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center">
                <Heart className="h-5 w-5 mr-2" />
                Donate Now
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
                Learn More
              </button>
            </div>

            <p className="text-sm text-orange-100">
              🕉️ Every contribution helps preserve and share our sacred heritage 🚩
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
