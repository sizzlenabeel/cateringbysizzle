
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-catering-primary font-bold text-xl md:text-2xl">
                Sizzle
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/services" className="text-gray-600 hover:text-catering-secondary px-3 py-2 font-medium">
              Services
            </Link>
            <Link to="/menus" className="text-gray-600 hover:text-catering-secondary px-3 py-2 font-medium">
              Menus
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-catering-secondary px-3 py-2 font-medium">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-catering-secondary px-3 py-2 font-medium">
              Contact
            </Link>
            <div className="ml-4 flex items-center">
              <Link to="/login">
                <Button variant="outline" className="mr-2">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="text-white bg-orange-600 hover:bg-orange-500">
                  Register
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-catering-secondary hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              Services
            </Link>
            <Link to="/menus" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-catering-secondary hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              Menus
            </Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-catering-secondary hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              About Us
            </Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-catering-secondary hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <Link to="/login" className="block w-full px-3 py-2 rounded-md text-center text-base font-medium text-catering-secondary border border-catering-secondary" onClick={() => setIsMenuOpen(false)}>
                  Log in
                </Link>
              </div>
              <div className="mt-3 px-5">
                <Link to="/register" className="block w-full px-3 py-2 rounded-md text-center text-base font-medium text-white bg-catering-secondary" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>}
    </nav>;
};
export default Navbar;
