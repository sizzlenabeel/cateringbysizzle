import { Database } from "@/integrations/supabase/types";

// Convenience types for database tables
export type EventType = Database["public"]["Tables"]["event_types"]["Row"];
export type ServingStyle = Database["public"]["Tables"]["serving_styles"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
export type SubProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_vegan: boolean | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}
export type MenuItemSubProduct = Database["public"]["Tables"]["menu_item_sub_products"]["Row"];
export type MenuItemEventType = Database["public"]["Tables"]["menu_item_event_types"]["Row"];
export type MenuItemServingStyle = Database["public"]["Tables"]["menu_item_serving_styles"]["Row"];

// Extended types with relationships resolved
export interface MenuItemWithRelations extends MenuItem {
  event_types: EventType[];
  serving_styles: ServingStyle[];
  sub_products: (SubProduct & { is_default: boolean })[];
}

// New types for cart and orders
export interface CartItem {
  id: string;
  user_id: string;
  menu_id: string;
  quantity: number;
  selected_sub_products: any;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  total_amount: number;
  discount_amount: number;
  discount_code?: string;
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  reference?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_id: string;
  quantity: number;
  selected_sub_products: any;
  total_price: number;
  created_at: string;
  updated_at: string;
}
