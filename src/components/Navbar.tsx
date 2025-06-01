
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="https://i.postimg.cc/hvhb1QrF/20240708-235028.jpg?w=40&h=40&fit=crop&crop=center"
              alt="Sanatani Gyan Logo"
              className="h-10 w-10 rounded-full mr-3"
            />
            <span className="text-xl font-bold">Sanatani Gyan</span>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-orange-700 rounded-b-lg">
              <div className="block px-3 py-2 text-base font-medium">
                Welcome to Sanatani Gyan
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
