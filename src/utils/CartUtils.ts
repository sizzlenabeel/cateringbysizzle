
import { Cart, CartItem, calculateCartTotals, currentCompany } from "@/data/cartData";
import { toast } from "@/hooks/use-toast";

/**
 * Add an item to the cart
 * @param cart Current cart state
 * @param item Item to add
 * @returns Updated cart
 */
export const addToCart = (cart: Cart, item: CartItem): Cart => {
  // Check if the item already exists in the cart
  const existingItemIndex = cart.items.findIndex(cartItem => cartItem.menuId === item.menuId);
  
  let updatedItems;
  
  if (existingItemIndex >= 0) {
    // Update existing item
    updatedItems = cart.items.map((cartItem, index) => {
      if (index === existingItemIndex) {
        // Merge selected sub-products and update quantity and price
        const updatedSubProducts = [...new Set([
          ...cartItem.selectedSubProducts, 
          ...item.selectedSubProducts
        ])];
        
        return {
          ...cartItem,
          quantity: cartItem.quantity + item.quantity,
          selectedSubProducts: updatedSubProducts,
          totalPrice: cartItem.totalPrice + item.totalPrice
        };
      }
      return cartItem;
    });
    
    toast({
      title: "Cart updated",
      description: "Item quantity has been updated in your cart",
    });
  } else {
    // Add new item
    updatedItems = [...cart.items, item];
    
    toast({
      title: "Item added to cart",
      description: `${item.quantity} item(s) have been added to your cart`,
    });
  }
  
  const updatedCart = {
    ...cart,
    items: updatedItems,
  };
  
  // Calculate totals with company discount
  return calculateCartTotals(updatedCart, currentCompany.discountPercentage);
};

/**
 * Remove an item from the cart
 * @param cart Current cart state
 * @param menuId ID of the menu item to remove
 * @returns Updated cart
 */
export const removeFromCart = (cart: Cart, menuId: string): Cart => {
  const updatedItems = cart.items.filter(item => item.menuId !== menuId);
  
  const updatedCart = {
    ...cart,
    items: updatedItems,
  };
  
  toast({
    title: "Item removed",
    description: "Item has been removed from your cart",
  });
  
  // Calculate totals with company discount
  return calculateCartTotals(updatedCart, currentCompany.discountPercentage);
};

/**
 * Update an item's quantity in the cart
 * @param cart Current cart state
 * @param menuId ID of the menu item
 * @param quantity New quantity
 * @returns Updated cart
 */
export const updateCartItemQuantity = (cart: Cart, menuId: string, quantity: number): Cart => {
  if (quantity <= 0) {
    return removeFromCart(cart, menuId);
  }
  
  const updatedItems = cart.items.map(item => {
    if (item.menuId === menuId) {
      const pricePerUnit = item.totalPrice / item.quantity;
      return {
        ...item,
        quantity,
        totalPrice: pricePerUnit * quantity
      };
    }
    return item;
  });
  
  const updatedCart = {
    ...cart,
    items: updatedItems,
  };
  
  // Calculate totals with company discount
  return calculateCartTotals(updatedCart, currentCompany.discountPercentage);
};

/**
 * Clear all items from the cart
 * @returns Empty cart with calculated totals
 */
export const clearCart = (): Cart => {
  const emptyCart: Cart = {
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    discountCode: undefined
  };
  
  toast({
    title: "Cart cleared",
    description: "All items have been removed from your cart",
  });
  
  return emptyCart;
};

/**
 * Save cart to local storage
 * @param cart Cart to save
 */
export const saveCartToLocalStorage = (cart: Cart): void => {
  localStorage.setItem('userCart', JSON.stringify(cart));
};

/**
 * Load cart from local storage
 * @returns Cart from local storage or empty cart
 */
export const loadCartFromLocalStorage = (): Cart => {
  const savedCart = localStorage.getItem('userCart');
  
  if (savedCart) {
    try {
      const parsedCart = JSON.parse(savedCart);
      return calculateCartTotals(parsedCart, currentCompany.discountPercentage);
    } catch (error) {
      console.error('Error parsing saved cart:', error);
    }
  }
  
  return {
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0
  };
};
