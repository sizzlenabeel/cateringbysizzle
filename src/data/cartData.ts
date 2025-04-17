
import { getMinimumQuantity } from "@/services/menuService";

export interface CartItem {
  menuId: string;
  quantity: number;
  selectedSubProducts: string[];
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  discountCode?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  percentage: number;
  validUntil: Date;
  isActive: boolean;
}

export interface Company {
  id: string;
  name: string;
  discountPercentage: number;
}

// Currency formatter for Swedish Krona
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Initialize empty cart
export const initialCart: Cart = {
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0
};

// Export the functions and data that are referenced in CartContext and Cart components
export const discountCodes: DiscountCode[] = [
  {
    id: "1",
    code: "WELCOME10",
    percentage: 10,
    validUntil: new Date(2025, 11, 31),
    isActive: true
  },
  {
    id: "2",
    code: "SUMMER20",
    percentage: 20,
    validUntil: new Date(2025, 8, 30),
    isActive: true
  }
];

// Sample company for demonstration purposes
export const currentCompany: Company | null = {
  id: "1",
  name: "Acme Corp",
  discountPercentage: 15
};

// Re-export getMinimumQuantity from menuService
export { getMinimumQuantity };
