
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Cart, CartItem, initialCart, discountCodes, currentCompany, formatPrice } from "@/data/cartData";
import { menuItems } from "@/data/menuData";
import { useToast } from "@/components/ui/use-toast";

interface CartContextType {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  removeFromCart: (menuId: string) => void;
  applyDiscountCode: (code: string) => boolean;
  clearCart: () => void;
  formatPrice: (price: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>(initialCart);
  const { toast } = useToast();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Recalculate cart totals
  const recalculateCart = (updatedItems: CartItem[]) => {
    const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
    
    // Apply company discount if available
    let discountAmount = currentCompany?.discountPercentage 
      ? subtotal * (currentCompany.discountPercentage / 100) 
      : 0;
    
    // Apply discount code if available
    if (cart.discountCode) {
      const discountCode = discountCodes.find(dc => dc.code === cart.discountCode);
      if (discountCode && new Date() <= discountCode.validUntil) {
        discountAmount += subtotal * (discountCode.percentage / 100);
      }
    }
    
    const total = subtotal - discountAmount;
    
    return {
      items: updatedItems,
      subtotal,
      discount: discountAmount,
      total,
      discountCode: cart.discountCode
    };
  };

  const addToCart = (item: CartItem) => {
    const existingItemIndex = cart.items.findIndex(i => 
      i.menuId === item.menuId && 
      JSON.stringify(i.selectedSubProducts) === JSON.stringify(item.selectedSubProducts)
    );

    let updatedItems;
    
    if (existingItemIndex >= 0) {
      // Update existing item
      updatedItems = [...cart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + item.quantity
      };
    } else {
      // Add new item
      updatedItems = [...cart.items, item];
    }
    
    setCart(recalculateCart(updatedItems));
    
    toast({
      title: "Menu added to cart",
      description: `${item.quantity} x ${menuItems.find(m => m.id === item.menuId)?.name} added`,
    });
  };

  const updateQuantity = (menuId: string, quantity: number) => {
    const updatedItems = cart.items.map(item => 
      item.menuId === menuId ? { ...item, quantity } : item
    );
    
    setCart(recalculateCart(updatedItems));
  };

  const removeFromCart = (menuId: string) => {
    const updatedItems = cart.items.filter(item => item.menuId !== menuId);
    setCart(recalculateCart(updatedItems));
    
    toast({
      title: "Item removed",
      description: "Menu item removed from cart",
    });
  };

  const applyDiscountCode = (code: string) => {
    const discountCode = discountCodes.find(dc => 
      dc.code === code && new Date() <= dc.validUntil
    );
    
    if (discountCode) {
      setCart({
        ...cart,
        discountCode: code,
        ...recalculateCart(cart.items)
      });
      
      toast({
        title: "Discount applied",
        description: `${discountCode.percentage}% discount applied to your order`,
      });
      
      return true;
    }
    
    toast({
      title: "Invalid discount code",
      description: "The discount code is invalid or has expired",
      variant: "destructive"
    });
    
    return false;
  };

  const clearCart = () => {
    setCart(initialCart);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      applyDiscountCode,
      clearCart,
      formatPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
