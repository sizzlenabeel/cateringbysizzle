import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart, loadCartItems, removeFromCart, updateCartItemQuantity } from "@/utils/CartUtils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase";

// Unified CartItem type definition
export type CartItem = {
  id: string;
  menuId: string;
  quantity: number;
  selectedSubProducts: string[];
  totalPrice: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addItemToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  isLoading: boolean;
  subtotal: number;
  formatPrice: (price: number) => string;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Force refetch when user changes
  useEffect(() => {
    if (user) {
      console.log("User logged in, invalidating cart query");
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  }, [user, queryClient]);

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: loadCartItems,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  const addItemMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error("Error in add item mutation:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => 
      updateCartItemQuantity(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error("Error in update quantity mutation:", error);
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive"
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error("Error in remove item mutation:", error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive"
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared successfully"
      });
    },
    onError: (error) => {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart items",
        variant: "destructive"
      });
    },
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);

  // Helper function to format prices in SEK
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(price);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        subtotal,
        formatPrice,
        addItemToCart: async (item) => {
          try {
            await addItemMutation.mutateAsync(item);
          } catch (error) {
            console.error("Error adding item to cart:", error);
            throw error;
          }
        },
        updateQuantity: async (itemId, quantity) => {
          try {
            await updateQuantityMutation.mutateAsync({ itemId, quantity });
          } catch (error) {
            console.error("Error updating quantity:", error);
            throw error;
          }
        },
        removeItem: async (itemId) => {
          try {
            await removeItemMutation.mutateAsync(itemId);
          } catch (error) {
            console.error("Error removing item:", error);
            throw error;
          }
        },
        clearCart: async () => {
          try {
            await clearCartMutation.mutateAsync();
          } catch (error) {
            console.error("Error clearing cart:", error);
            throw error;
          }
        },
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
