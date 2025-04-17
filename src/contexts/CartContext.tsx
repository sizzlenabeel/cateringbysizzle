
import React, { createContext, useContext } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart, loadCartItems, removeFromCart, updateCartItemQuantity } from "@/utils/CartUtils";
import { toast } from "@/hooks/use-toast";

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

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: loadCartItems,
    enabled: !!user,
  });

  const addItemMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
      console.error("Error in add item mutation:", error);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => 
      updateCartItemQuantity(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive"
      });
      console.error("Error in update quantity mutation:", error);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive"
      });
      console.error("Error in remove item mutation:", error);
    },
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);

  // Helper function to format prices
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        subtotal,
        formatPrice,
        addItemToCart: async (item) => {
          await addItemMutation.mutateAsync(item);
        },
        updateQuantity: async (itemId, quantity) => {
          await updateQuantityMutation.mutateAsync({ itemId, quantity });
        },
        removeItem: async (itemId) => {
          await removeItemMutation.mutateAsync(itemId);
        },
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
