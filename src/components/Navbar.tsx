import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
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
            <img
              src="https://i.postimg.cc/hvhb1QrF/20240708-235028.jpg?w=40&h=40&fit=crop&crop=center"
              alt="Sanatani Gyan Logo"
              className="h-10 w-10 rounded-full mr-3"
            />
            <span className="text-lg font-bold">Sanatani Gyan</span> {/* Changed from text-xl to text-lg */}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="hover:bg-orange-700 px-3 py-2 rounded-md text-xs font-medium transition-colors"> {/* Changed from text-sm to text-xs */}
                Home
              </a>
              <a href="#" className="hover:bg-orange-700 px-3 py-2 rounded-md text-xs font-medium transition-colors"> {/* Changed from text-sm to text-xs */}
                Books
              </a>
              <a href="#" className="hover:bg-orange-700 px-3 py-2 rounded-md text-xs font-medium transition-colors"> {/* Changed from text-sm to text-xs */}
                Categories
              </a>
              <a href="#" className="hover:bg-orange-700 px-3 py-2 rounded-md text-xs font-medium transition-colors"> {/* Changed from text-sm to text-xs */}
                About
              </a>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-md hover:bg-orange-700 transition-colors">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-1/2 bg-gradient-to-b from-orange-600 to-red-600 border-l-0 text-white"
              >
                <SheetHeader className="border-b border-orange-500 pb-4 mb-6">
                  <SheetTitle className="text-white text-lg font-bold text-left"> {/* Changed from text-xl to text-lg */}
                    Sanatani Gyan
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-6">
                  <a 
                    href="#" 
                    className="text-base font-medium hover:text-orange-200 transition-colors py-2 px-4 hover:bg-orange-700 rounded-md" {/* Changed from text-lg to text-base */}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </a>
                  <a 
                    href="#" 
                    className="text-base font-medium hover:text-orange-200 transition-colors py-2 px-4 hover:bg-orange-700 rounded-md" {/* Changed from text-lg to text-base */}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Books
                  </a>
                  <a 
                    href="#" 
                    className="text-base font-medium hover:text-orange-200 transition-colors py-2 px-4 hover:bg-orange-700 rounded-md" {/* Changed from text-lg to text-base */}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Categories
                  </a>
                  <a 
                    href="#" 
                    className="text-base font-medium hover:text-orange-200 transition-colors py-2 px-4 hover:bg-orange-700 rounded-md" {/* Changed from text-lg to text-base */}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </a>
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
