import { supabase } from "@/integrations/supabase/client";
import { EventType, MenuItem, MenuItemWithRelations, ServingStyle, SubProduct } from "@/types/supabase";

export async function fetchEventTypes(): Promise<EventType[]> {
  const { data, error } = await supabase
    .from("event_types")
    .select("*")
    .order("name");
  
  if (error) {
    console.error("Error fetching event types:", error);
    return [];
  }
  
  return data;
}

export async function fetchServingStyles(): Promise<ServingStyle[]> {
  const { data, error } = await supabase
    .from("serving_styles")
    .select("*")
    .order("name");
  
  if (error) {
    console.error("Error fetching serving styles:", error);
    return [];
  }
  
  return data;
}

export async function fetchMenuItems(options: {
  eventTypeId?: string;
  servingStyleId?: string;
  isVegan?: boolean;
} = {}): Promise<MenuItemWithRelations[]> {
  let query = supabase.from("menu_items").select(`
    *,
    menu_item_event_types!inner (
      event_type_id,
      event_types (*)
    ),
    menu_item_serving_styles!inner (
      serving_style_id,
      serving_styles (*)
    ),
    menu_item_sub_products (
      is_default,
      sub_products (*)
    )
  `);
  
  if (options.eventTypeId) {
    query = query.filter("menu_item_event_types.event_type_id", "eq", options.eventTypeId);
  }
  
  if (options.servingStyleId) {
    query = query.filter("menu_item_serving_styles.serving_style_id", "eq", options.servingStyleId);
  }
  
  if (options.isVegan !== undefined) {
    query = query.filter("is_vegan", "eq", options.isVegan);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
  
  return data.map((item: any) => {
    const event_types = item.menu_item_event_types.map((et: any) => et.event_types);
    const serving_styles = item.menu_item_serving_styles.map((ss: any) => ss.serving_styles);
    const sub_products = item.menu_item_sub_products.map((sp: any) => ({
      ...sp.sub_products,
      is_default: sp.is_default
    }));
    
    const { menu_item_event_types, menu_item_serving_styles, menu_item_sub_products, ...menuItem } = item;
    
    return {
      ...menuItem,
      event_types,
      serving_styles,
      sub_products
    };
  });
}

export async function getMinimumQuantity(menuId: string): Promise<number> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("minimum_quantity")
    .eq("id", menuId)
    .single();
  
  if (error || !data) {
    console.error("Error fetching minimum quantity:", error);
    return 5; // Default minimum
  }
  
  return data.minimum_quantity || 5;
}
