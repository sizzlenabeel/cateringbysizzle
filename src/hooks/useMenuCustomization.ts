
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MenuItemWithRelations } from "@/types/supabase";
import { getMinimumQuantity } from "@/services/menuService";

export const useMenuCustomization = () => {
  const { id } = useParams<{ id: string }>();

  const { data: menuItem, isLoading } = useQuery({
    queryKey: ['menuItem', id],
    queryFn: async () => {
      if (!id) throw new Error("Menu ID is required");
      
      const { data, error } = await supabase
        .from("menu_items")
        .select(`
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
        `)
        .eq("id", id)
        .single();
      
      if (error) throw error;
      
      const event_types = data.menu_item_event_types.map((et: any) => et.event_types);
      const serving_styles = data.menu_item_serving_styles.map((ss: any) => ss.serving_styles);
      const sub_products = data.menu_item_sub_products.map((sp: any) => ({
        ...sp.sub_products,
        is_default: sp.is_default
      }));
      
      const { menu_item_event_types, menu_item_serving_styles, menu_item_sub_products, ...menuItemData } = data;
      
      return {
        ...menuItemData,
        event_types,
        serving_styles,
        sub_products
      };
    },
    enabled: !!id
  });

  const { data: minimumQuantity = 5, isLoading: isLoadingMinQuantity } = useQuery({
    queryKey: ['minimumQuantity', id],
    queryFn: () => id ? getMinimumQuantity(id) : Promise.resolve(5),
    enabled: !!id
  });

  const [customizedMenu, setCustomizedMenu] = useState<{
    selectedSubProducts: string[];
    totalPrice: number;
    quantity: number;
  }>({
    selectedSubProducts: [],
    totalPrice: 0,
    quantity: 5
  });

  useEffect(() => {
    if (menuItem) {
      const defaultSelectedSubProducts = menuItem.sub_products
        .filter(subProduct => subProduct.is_default)
        .map(subProduct => subProduct.id);
      
      setCustomizedMenu({
        selectedSubProducts: defaultSelectedSubProducts,
        totalPrice: calculateTotalPrice(menuItem, defaultSelectedSubProducts),
        quantity: minimumQuantity
      });
    }
  }, [menuItem, minimumQuantity]);

  const calculateTotalPrice = (menu: MenuItemWithRelations, selectedIds: string[]): number => {
    const basePrice = Number(menu.base_price);
    const defaultSubProducts = menu.sub_products.filter(sp => sp.is_default);
    const defaultIds = defaultSubProducts.map(sp => sp.id);
    let priceAdjustment = 0;
    
    selectedIds.forEach(id => {
      if (!defaultIds.includes(id)) {
        const subProduct = menu.sub_products.find(sp => sp.id === id);
        if (subProduct) {
          priceAdjustment += Number(subProduct.price);
        }
      }
    });
    
    defaultIds.forEach(id => {
      if (!selectedIds.includes(id)) {
        const subProduct = menu.sub_products.find(sp => sp.id === id);
        if (subProduct) {
          priceAdjustment -= Number(subProduct.price);
        }
      }
    });
    
    return basePrice + priceAdjustment;
  };

  const toggleSubProduct = (subProductId: string) => {
    if (!menuItem) return;
    
    const newSelectedSubProducts = customizedMenu.selectedSubProducts.includes(subProductId)
      ? customizedMenu.selectedSubProducts.filter(id => id !== subProductId)
      : [...customizedMenu.selectedSubProducts, subProductId];
    
    setCustomizedMenu({
      ...customizedMenu,
      selectedSubProducts: newSelectedSubProducts,
      totalPrice: calculateTotalPrice(menuItem, newSelectedSubProducts)
    });
  };

  return {
    menuItem,
    isLoading: isLoading || isLoadingMinQuantity,
    customizedMenu,
    minimumQuantity,
    toggleSubProduct,
    setCustomizedMenu,
  };
};
