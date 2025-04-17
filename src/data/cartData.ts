
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
  }
];

// Sample company data
export const currentCompany: Company = {
  id: "company-1",
  name: "Acme Inc",
  discountPercentage: 5
};

// Helper function to format price
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

// Helper function to get minimum quantity (for backward compatibility)
export const getMinimumQuantity = (menuId: string): number => {
  return 5; // Default minimum quantity
};
