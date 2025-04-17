
// Types
export type CartItem = {
  menuId: string;
  quantity: number;
  selectedSubProducts: string[];
  totalPrice: number;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  discountCode?: string;
};

export type DiscountCode = {
  code: string;
  percentage: number;
  validUntil: Date;
};

export type Company = {
  id: string;
  name: string;
  discountPercentage: number;
};

// Initial state
export const initialCart: Cart = {
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0
};

// Sample discount codes
export const discountCodes: DiscountCode[] = [
  {
    code: "WELCOME10",
    percentage: 10,
    validUntil: new Date(2025, 11, 31) // Valid until December 31, 2025
  },
  {
    code: "SUMMER20",
    percentage: 20,
    validUntil: new Date(2025, 8, 30) // Valid until September 30, 2025
  },
  {
    code: "FLASH25",
    percentage: 25,
    validUntil: new Date(2025, 5, 30) // Valid until June 30, 2025
  }
];

// Sample company data
export const companies: Company[] = [
  {
    id: "company-1",
    name: "TechCorp Inc.",
    discountPercentage: 10
  },
  {
    id: "company-2",
    name: "Global Finance",
    discountPercentage: 5
  },
  {
    id: "company-3",
    name: "Green Energy Solutions",
    discountPercentage: 8
  }
];

// Current company for the logged-in user
export const currentCompany: Company = companies[0];

// Helper function to format price
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

// Helper function to get minimum quantity (for backward compatibility)
export const getMinimumQuantity = (menuId: string): number => {
  return 5; // Default minimum quantity
};

// Helper function to calculate cart totals
export const calculateCartTotals = (cart: Cart, companyDiscount: number = 0): Cart => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  let discountPercentage = companyDiscount;
  
  // Check if a discount code is applied and valid
  if (cart.discountCode) {
    const discountCode = discountCodes.find(
      dc => dc.code === cart.discountCode && dc.validUntil > new Date()
    );
    
    if (discountCode) {
      // Use the higher discount between company discount and code discount
      discountPercentage = Math.max(discountPercentage, discountCode.percentage);
    }
  }
  
  const discount = discountPercentage > 0 ? (subtotal * discountPercentage) / 100 : 0;
  const total = subtotal - discount;
  
  return {
    ...cart,
    subtotal,
    discount,
    total
  };
};

// Apply discount code to cart
export const applyDiscountCode = (cart: Cart, code: string): { cart: Cart, success: boolean, message: string } => {
  // Find the discount code
  const discountCode = discountCodes.find(dc => dc.code === code);
  
  if (!discountCode) {
    return { cart, success: false, message: "Invalid discount code" };
  }
  
  if (discountCode.validUntil < new Date()) {
    return { cart, success: false, message: "This discount code has expired" };
  }
  
  // Apply the discount code
  const updatedCart = {
    ...cart,
    discountCode: code
  };
  
  // Recalculate totals with current company discount
  const finalCart = calculateCartTotals(updatedCart, currentCompany.discountPercentage);
  
  return { 
    cart: finalCart, 
    success: true, 
    message: `${discountCode.percentage}% discount applied successfully!`
  };
};

// Remove discount code from cart
export const removeDiscountCode = (cart: Cart): { cart: Cart, message: string } => {
  const updatedCart = {
    ...cart,
    discountCode: undefined
  };
  
  // Recalculate totals with only company discount
  const finalCart = calculateCartTotals(updatedCart, currentCompany.discountPercentage);
  
  return { 
    cart: finalCart, 
    message: "Discount code removed"
  };
};

// Validate if an item can be added to cart (meets minimum quantity)
export const validateCartItemQuantity = async (menuId: string, quantity: number): Promise<{ valid: boolean, message?: string }> => {
  try {
    // In a real app, this would fetch from the database
    const minQuantity = await getMinimumQuantity(menuId);
    
    if (quantity < minQuantity) {
      return {
        valid: false,
        message: `Minimum order quantity is ${minQuantity}`
      };
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Error validating item quantity:', error);
    return {
      valid: false,
      message: 'Could not validate quantity requirements'
    };
  }
};
