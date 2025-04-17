import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Cart, CartItem, initialCart, discountCodes, currentCompany, formatPrice } from "@/data/cartData";
import { menuItems } from "@/data/menuData";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CartItem as SupabaseCartItem } from "@/types/supabase";

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

  // Load cart from Supabase when user logs in
  useEffect(() => {
    const loadCart = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Using raw SQL query with type assertion for now, until types are updated
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select('*');

      if (error) {
        console.error('Error loading cart:', error);
        return;
      }

      if (cartItems) {
        const loadedCart: Cart = {
          items: cartItems.map((item: any) => ({
            menuId: item.menu_id,
            quantity: item.quantity,
            selectedSubProducts: item.selected_sub_products || [],
            totalPrice: Number(item.total_price)
          })),
          subtotal: cartItems.reduce((sum: number, item: any) => sum + Number(item.total_price) * item.quantity, 0),
          discount: 0,
          total: cartItems.reduce((sum: number, item: any) => sum + Number(item.total_price) * item.quantity, 0)
        };
        setCart(loadedCart);
      }
    };

    loadCart();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        loadCart();
      } else if (event === 'SIGNED_OUT') {
        setCart(initialCart);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addToCart = async (item: CartItem) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive"
      });
      return;
    }

    // Using type assertion for now
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: session.user.id,
        menu_id: item.menuId,
        quantity: item.quantity,
        selected_sub_products: item.selectedSubProducts,
        total_price: item.totalPrice
      } as any);

    if (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
      return;
    }

    const updatedItems = [...cart.items, item];
    const updatedCart = recalculateCart(updatedItems);
    setCart(updatedCart);
    
    toast({
      title: "Added to cart",
      description: `${item.quantity} item(s) added to your cart`
    });
  };

  const updateQuantity = async (menuId: string, quantity: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    if (quantity <= 0) {
      return removeFromCart(menuId);
    }

    // Using type assertion for now
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity } as any)
      .eq('menu_id', menuId)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error updating quantity:', error);
      return;
    }

    const updatedItems = cart.items.map(item =>
      item.menuId === menuId ? { ...item, quantity } : item
    );
    setCart(recalculateCart(updatedItems));
  };

  const removeFromCart = async (menuId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    // Using type assertion for now
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('menu_id', menuId)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error removing item:', error);
      return;
    }

    const updatedItems = cart.items.filter(item => item.menuId !== menuId);
    setCart(recalculateCart(updatedItems));
    
    toast({
      title: "Removed from cart",
      description: "Item removed from your cart"
    });
  };

  const clearCart = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    // Using type assertion for now
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error clearing cart:', error);
      return;
    }

    setCart(initialCart);
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart"
    });
  };

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
