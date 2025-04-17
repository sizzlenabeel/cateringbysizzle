
import { menuItems, MenuItem } from "./menuData";

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
  code: string;
  percentage: number;
  validUntil: Date;
}

export interface Company {
  id: string;
  name: string;
  discountPercentage: number;
}

// Sample discount codes
export const discountCodes: DiscountCode[] = [
  {
    code: "WELCOME10",
    percentage: 10,
    validUntil: new Date(2025, 11, 31)
  },
  {
    code: "SUMMER15",
    percentage: 15,
    validUntil: new Date(2025, 8, 30)
  },
  {
    code: "WINTER20",
    percentage: 20,
    validUntil: new Date(2025, 1, 28)
  }
];

// Sample companies with discounts
export const companies: Company[] = [
  {
    id: "company1",
    name: "Acme Corp",
    discountPercentage: 15
  },
  {
    id: "company2",
    name: "Tech Innovations",
    discountPercentage: 10
  },
  {
    id: "company3",
    name: "Global Enterprises",
    discountPercentage: 12
  }
];

// For demo purposes, let's set a current company
export const currentCompany = companies[0];

// Update menu item minimum quantities
export const getMinimumQuantity = (menuId: string): number => {
  const menu = menuItems.find(item => item.id === menuId);
  // Define minimum quantities for each menu (could be part of the menu data in a real app)
  const minimumQuantities: Record<string, number> = {
    'menu1': 5,
    'menu2': 10,
    'menu3': 8,
    'menu4': 15,
    'menu5': 12,
    'menu6': 20
  };
  
  return minimumQuantities[menuId] || 5; // Default minimum is 5
};

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
