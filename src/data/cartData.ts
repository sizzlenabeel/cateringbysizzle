
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
