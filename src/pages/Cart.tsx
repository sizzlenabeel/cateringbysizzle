
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { loadCartItems, updateCartItemQuantity, removeFromCart } from "@/utils/CartUtils";
import { menuItems } from "@/data/menuData";
import { formatPrice } from "@/data/cartData";

export type CartItem = {
  id: string;
  menuId: string;
  quantity: number;
  selectedSubProducts: string[];
  totalPrice: number;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    const fetchCart = async () => {
      setIsLoading(true);
      const items = await loadCartItems();
      setCartItems(items);
      setIsLoading(false);
    };

    fetchCart();
  }, [user, navigate]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (await updateCartItemQuantity(itemId, newQuantity)) {
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (await removeFromCart(itemId)) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            Loading cart...
          </div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Start browsing our menu to add items to your cart!</p>
            <Link to="/order">
              <Button className="bg-orange-600 hover:bg-orange-500">
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="flex items-center gap-1 mb-6"
          onClick={() => navigate("/order")}
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                {cartItems.map(item => {
                  const menu = menuItems.find(m => m.id === item.menuId);
                  if (!menu) return null;
                  
                  return (
                    <div key={item.id} className="mb-6 last:mb-0">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/4">
                          <img 
                            src={menu.image} 
                            alt={menu.name} 
                            className="w-full h-24 object-cover rounded-md"
                          />
                        </div>
                        <div className="md:w-3/4">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-semibold text-lg">{menu.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              Remove
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="h-8 w-8"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                className="w-16 text-center h-8"
                                min={1}
                              />
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="h-8 w-8"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <span className="font-medium">
                              {formatPrice(item.totalPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-500"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
