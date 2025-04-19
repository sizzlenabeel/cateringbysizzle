import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";

/**
 * Add an item to the cart
 */
export const addToCart = async (item: Omit<CartItem, 'id'>): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    toast({
      title: "Please log in",
      description: "You need to be logged in to add items to cart",
      variant: "destructive"
    });
    return false;
  }

  try {
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: session.user.id,
        menu_id: item.menuId,
        quantity: item.quantity,
        selected_sub_products: item.selectedSubProducts,
        total_price: item.totalPrice
      });

    if (error) throw error;
    
    toast({
      title: "Item added",
      description: `${item.quantity} item(s) have been added to your cart`
    });
    
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast({
      title: "Error",
      description: "Failed to add item to cart. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Remove an item from the cart
 */
export const removeFromCart = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart"
    });
    
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    toast({
      title: "Error",
      description: "Failed to remove item. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
  if (quantity <= 0) {
    return removeFromCart(itemId);
  }

  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) throw error;
    
    toast({
      title: "Quantity updated",
      description: "Cart has been updated"
    });
    
    return true;
  } catch (error) {
    console.error('Error updating quantity:', error);
    toast({
      title: "Error",
      description: "Failed to update quantity. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Load cart items from database
 */
export const loadCartItems = async (): Promise<CartItem[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    console.log('No active session: Cannot load cart items');
    return [];
  }

  console.log('Current User ID:', session.user.id);

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        menu_id,
        quantity,
        selected_sub_products,
        total_price
      `)
      .eq('user_id', session.user.id);

    console.log('Cart Items Query Result:', { data, error });

    if (error) {
      console.error('Detailed Cart Load Error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log('No cart items found for user');
    }

    return data.map(item => {
      let selectedSubProducts: string[] = [];
      
      if (item.selected_sub_products) {
        if (typeof item.selected_sub_products === 'string') {
          try {
            selectedSubProducts = JSON.parse(item.selected_sub_products);
          } catch (e) {
            console.error('Error parsing selected_sub_products', e);
          }
        } else if (Array.isArray(item.selected_sub_products)) {
          selectedSubProducts = item.selected_sub_products.map(sp => String(sp));
        }
      }

      return {
        id: item.id,
        menuId: item.menu_id,
        quantity: item.quantity,
        selectedSubProducts: selectedSubProducts,
        totalPrice: Number(item.total_price)
      };
    });
  } catch (error) {
    console.error('Comprehensive Cart Load Error:', error);
    toast({
      title: "Error",
      description: "Failed to load cart items",
      variant: "destructive"
    });
    return [];
  }
};
