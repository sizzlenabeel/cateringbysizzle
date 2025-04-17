
import { Database } from "@/integrations/supabase/types";

// Convenience types for database tables
export type EventType = Database["public"]["Tables"]["event_types"]["Row"];
export type ServingStyle = Database["public"]["Tables"]["serving_styles"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
export type SubProduct = Database["public"]["Tables"]["sub_products"]["Row"];
export type MenuItemSubProduct = Database["public"]["Tables"]["menu_item_sub_products"]["Row"];
export type MenuItemEventType = Database["public"]["Tables"]["menu_item_event_types"]["Row"];
export type MenuItemServingStyle = Database["public"]["Tables"]["menu_item_serving_styles"]["Row"];

// Extended types with relationships resolved
export interface MenuItemWithRelations extends MenuItem {
  event_types: EventType[];
  serving_styles: ServingStyle[];
  sub_products: (SubProduct & { is_default: boolean })[];
}
