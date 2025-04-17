import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getMinimumQuantity } from "@/services/menuService";
import { supabase } from "@/integrations/supabase/client";
import { MenuItemWithRelations } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";
import { MenuHeader } from "@/components/menu-customization/MenuHeader";
import { QuantitySelector } from "@/components/menu-customization/QuantitySelector";
import { PriceSummary } from "@/components/menu-customization/PriceSummary";
import { SubProductList } from "@/components/menu-customization/SubProductList";

const MenuCustomization = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItemToCart, formatPrice } = useCart();

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
      
      // Transform the data to match our expected format
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

  // Get the minimum quantity for this menu
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

  const handleAddToCart = () => {
    if (!menuItem) return;
    
    addItemToCart({
      menuId: menuItem.id,
      quantity: customizedMenu.quantity,
      selectedSubProducts: customizedMenu.selectedSubProducts,
      totalPrice: customizedMenu.totalPrice
    });
    
    navigate("/cart");
  };

  if (isLoading || isLoadingMinQuantity) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-catering-secondary mx-auto mb-4" />
            <p className="text-xl text-gray-600">Loading menu details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!menuItem) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <p>Menu not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col space-y-6">
          <MenuHeader
            name={menuItem.name}
            description={menuItem.description}
            imageUrl={menuItem.image_url}
            eventTypes={menuItem.event_types}
            isVegan={menuItem.is_vegan}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <QuantitySelector
                quantity={customizedMenu.quantity}
                minimumQuantity={minimumQuantity}
                onUpdateQuantity={(quantity) => setCustomizedMenu({ ...customizedMenu, quantity })}
              />
              <PriceSummary
                totalPrice={customizedMenu.totalPrice}
                quantity={customizedMenu.quantity}
                formatPrice={formatPrice}
                onAddToCart={handleAddToCart}
              />
            </div>

            <div>
              <SubProductList
                subProducts={menuItem.sub_products}
                selectedSubProducts={customizedMenu.selectedSubProducts}
                onToggleSubProduct={toggleSubProduct}
                formatPrice={formatPrice}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MenuCustomization;
