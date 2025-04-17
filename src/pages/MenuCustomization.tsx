import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Check, Plus, Minus, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getMinimumQuantity } from "@/services/menuService";
import { supabase } from "@/integrations/supabase/client";
import { MenuItemWithRelations, SubProduct } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";

const MenuCustomization = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart, formatPrice } = useCart();

  // Fetch the menu item details
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
      
      // Remove the nested data and add the flattened arrays
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

  // Initialize the customized menu when the data is loaded
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

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= minimumQuantity) {
      setCustomizedMenu({
        ...customizedMenu,
        quantity: newQuantity
      });
    } else {
      toast({
        title: "Minimum quantity required",
        description: `This menu requires a minimum of ${minimumQuantity} orders`,
        variant: "destructive"
      });
    }
  };

  const handleAddToCart = () => {
    if (!menuItem) return;
    
    addToCart({
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
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/order")}
              className="flex items-center gap-1 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Menu Selection
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 overflow-hidden rounded-lg">
              <img 
                src={menuItem.image_url || "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666"} 
                alt={menuItem.name}
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{menuItem.name}</h1>
                <p className="text-gray-600 mb-4">{menuItem.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {menuItem.event_types.map(eventType => (
                    <span key={eventType.id} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {eventType.name}
                    </span>
                  ))}
                  {menuItem.is_vegan && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Vegan
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="quantity" className="font-medium">Quantity:</label>
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => updateQuantity(customizedMenu.quantity - 1)}
                        disabled={customizedMenu.quantity <= minimumQuantity}
                        className="h-8 w-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        min={minimumQuantity}
                        value={customizedMenu.quantity}
                        onChange={(e) => updateQuantity(parseInt(e.target.value))}
                        className="w-16 mx-2 text-center h-8"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => updateQuantity(customizedMenu.quantity + 1)}
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Minimum quantity: {minimumQuantity}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-lg font-medium">Price per person:</span>
                  <span className="text-2xl font-bold text-purple-700">
                    {formatPrice(customizedMenu.totalPrice)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-lg font-medium">Total price:</span>
                  <span className="text-2xl font-bold text-purple-700">
                    {formatPrice(customizedMenu.totalPrice * customizedMenu.quantity)}
                  </span>
                </div>
                <Button 
                  className="w-full mt-2 bg-orange-600 hover:bg-orange-500"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Customize Your Menu</h2>
              <p className="text-gray-600 mb-6">
                Select or deselect items to customize your menu. The price will update automatically.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-3">Included Items</h3>
                  <div className="space-y-3">
                    {menuItem.sub_products
                      .filter(subProduct => subProduct.is_default)
                      .map(subProduct => (
                        <SubProductItem 
                          key={subProduct.id}
                          subProduct={subProduct}
                          isSelected={customizedMenu.selectedSubProducts.includes(subProduct.id)}
                          onToggle={toggleSubProduct}
                          formatPrice={formatPrice}
                        />
                      ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-3">Optional Add-ons</h3>
                  <div className="space-y-3">
                    {menuItem.sub_products
                      .filter(subProduct => !subProduct.is_default)
                      .map(subProduct => (
                        <SubProductItem 
                          key={subProduct.id}
                          subProduct={subProduct}
                          isSelected={customizedMenu.selectedSubProducts.includes(subProduct.id)}
                          onToggle={toggleSubProduct}
                          formatPrice={formatPrice}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

type SubProductItemProps = {
  subProduct: SubProduct & { is_default: boolean };
  isSelected: boolean;
  onToggle: (id: string) => void;
  formatPrice: (price: number) => string;
};

const SubProductItem = ({ subProduct, isSelected, onToggle, formatPrice }: SubProductItemProps) => {
  return (
    <div className={`
      flex items-center justify-between p-3 rounded-lg border 
      ${isSelected ? 'border-purple-400 bg-purple-50' : 'border-gray-200'}
      transition-all hover:border-purple-300
    `}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Checkbox 
            checked={isSelected} 
            id={`checkbox-${subProduct.id}`}
            onCheckedChange={() => onToggle(subProduct.id)}
          />
        </div>
        <div>
          <label 
            htmlFor={`checkbox-${subProduct.id}`}
            className="font-medium cursor-pointer flex items-center"
          >
            {subProduct.name}
            {subProduct.is_vegan && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                Vegan
              </span>
            )}
          </label>
          <p className="text-sm text-gray-600">{subProduct.description}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="font-medium text-purple-700">{formatPrice(Number(subProduct.price))}</span>
        {isSelected ? (
          <button 
            onClick={() => onToggle(subProduct.id)}
            className="ml-3 p-1 text-red-500 hover:bg-red-50 rounded"
            aria-label="Remove item"
          >
            <Minus className="h-4 w-4" />
          </button>
        ) : (
          <button 
            onClick={() => onToggle(subProduct.id)}
            className="ml-3 p-1 text-green-500 hover:bg-green-50 rounded"
            aria-label="Add item"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuCustomization;
