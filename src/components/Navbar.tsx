
import React, { useState } from 'react';
import { Menu, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="https://i.postimg.cc/hvhb1QrF/20240708-235028.jpg?w=40&h=40&fit=crop&crop=center"
                alt="Sanatani Gyan Logo"
                className="h-8 w-8 rounded-full mr-2"
              />
              <span className="text-sm font-bold">Sanatani Gyan</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-6 flex items-baseline space-x-2">
              <Link to="/" className="hover:bg-orange-700 px-2 py-1 rounded-md text-xs font-medium transition-colors">
                Home
              </Link>
              <Link to="/books" className="hover:bg-orange-700 px-2 py-1 rounded-md text-xs font-medium transition-colors">
                Books
              </Link>
              <Link to="/naam-jaap" className="hover:bg-orange-700 px-2 py-1 rounded-md text-xs font-medium transition-colors">
                Naam Jaap
              </Link>
              <Link to="/report" className="hover:bg-orange-700 px-2 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Report
              </Link>
              <Link to="/about" className="hover:bg-orange-700 px-2 py-1 rounded-md text-xs font-medium transition-colors">
                About
              </Link>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-1 rounded-md hover:bg-orange-700 transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[200px] bg-gradient-to-b from-orange-600 to-red-600 border-l-0 text-white"
              >
                <SheetHeader className="border-b border-orange-500 pb-3 mb-4">
                  <SheetTitle className="text-white text-sm font-bold text-left">
                    Sanatani Gyan
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/" 
                    className="text-xs font-medium hover:text-orange-200 transition-colors py-1 px-3 hover:bg-orange-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/books" 
                    className="text-xs font-medium hover:text-orange-200 transition-colors py-1 px-3 hover:bg-orange-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Books
                  </Link>
                  <Link 
                    to="/naam-jaap" 
                    className="text-xs font-medium hover:text-orange-200 transition-colors py-1 px-3 hover:bg-orange-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Naam Jaap
                  </Link>
                  <Link 
                    to="/report" 
                    className="text-xs font-medium hover:text-orange-200 transition-colors py-1 px-3 hover:bg-orange-700 rounded-md flex items-center gap-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <AlertTriangle className="h-3 w-3" />
                    Report
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-xs font-medium hover:text-orange-200 transition-colors py-1 px-3 hover:bg-orange-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
