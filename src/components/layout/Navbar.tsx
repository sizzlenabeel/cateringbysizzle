
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, User, LogOut, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { cart } = useCart();
  
  // Check if we're in the order flow or menu customization
  const isOrderFlow = location.pathname === "/order" || 
                     location.pathname.startsWith("/menu/") ||
                     location.pathname === "/cart";
  
  // Calculate total items in cart
  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
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
            <div className="ml-4 flex items-center">
              {isOrderFlow ? (
                <>
                  <Link to="/cart">
                    <Button variant="ghost" className="flex items-center gap-2 mr-4 relative">
                      <ShoppingCart className="h-4 w-4" />
                      Cart
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                  <Button variant="ghost" className="flex items-center gap-2 mr-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isOrderFlow && (
              <Link to="/cart" className="mr-4 relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
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
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                {isOrderFlow ? (
                  <>
                    <Link to="/cart" className="block w-full px-3 py-2 rounded-md text-center text-base font-medium text-catering-secondary border border-catering-secondary mb-3" onClick={() => setIsMenuOpen(false)}>
                      Cart
                      {cartItemCount > 0 && ` (${cartItemCount})`}
                    </Link>
                    <button className="block w-full px-3 py-2 rounded-md text-center text-base font-medium text-catering-secondary border border-catering-secondary mb-3" onClick={() => setIsMenuOpen(false)}>
                      Profile
                    </button>
                    <button className="block w-full px-3 py-2 rounded-md text-center text-base font-medium text-catering-secondary border border-catering-secondary" onClick={() => setIsMenuOpen(false)}>
                      Log out
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="block w-full px-3 py-2 rounded-md text-center text-base font-medium text-catering-secondary border border-catering-secondary" onClick={() => setIsMenuOpen(false)}>
                    Log in
                  </Link>
                )}
              </div>
              {!isOrderFlow && (
                <div className="mt-3 px-5">
                  <Link to="/register" className="block w-full px-3 py-2 rounded-md text-center text-base font-medium text-white bg-catering-secondary" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>}
    </nav>
  );
};

export default Navbar;
