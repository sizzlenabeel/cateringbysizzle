import React from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { MenuItemWithRelations } from "@/types/supabase";
import { MenuHeader } from "./MenuHeader";
import { QuantitySelector } from "./QuantitySelector";
import { PriceSummary } from "./PriceSummary";
import { SubProductList } from "./SubProductList";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MenuCustomizationContentProps {
  menuItem: MenuItemWithRelations;
  customizedMenu: {
    selectedSubProducts: string[];
    totalPrice: number;
    quantity: number;
  };
  minimumQuantity: number;
  onUpdateQuantity: (quantity: number) => void;
  onToggleSubProduct: (subProductId: string) => void;
}

export const MenuCustomizationContent = ({
  menuItem,
  customizedMenu,
  minimumQuantity,
  onUpdateQuantity,
  onToggleSubProduct
}: MenuCustomizationContentProps) => {
  const navigate = useNavigate();
  const { addItemToCart, formatPrice } = useCart();
  const isMobile = useIsMobile();

  const handleAddToCart = () => {
    addItemToCart({
      menuId: menuItem.id,
      quantity: customizedMenu.quantity,
      selectedSubProducts: customizedMenu.selectedSubProducts,
      totalPrice: customizedMenu.totalPrice
    });
    
    navigate("/cart");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        {isMobile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
            <div className="flex flex-col space-y-6 overflow-y-auto">
              <MenuHeader
                name={menuItem.name}
                description={menuItem.description}
                imageUrl={menuItem.image_url}
                eventTypes={menuItem.event_types}
                isVegan={menuItem.is_vegan}
              />
              
              <QuantitySelector
                quantity={customizedMenu.quantity}
                minimumQuantity={minimumQuantity}
                onUpdateQuantity={onUpdateQuantity}
              />
              
              <SubProductList
                subProducts={menuItem.sub_products}
                selectedSubProducts={customizedMenu.selectedSubProducts}
                onToggleSubProduct={onToggleSubProduct}
                formatPrice={formatPrice}
              />
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50">
              <div className="container mx-auto">
                <PriceSummary
                  totalPrice={customizedMenu.totalPrice}
                  quantity={customizedMenu.quantity}
                  formatPrice={formatPrice}
                  onAddToCart={handleAddToCart}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:grid md:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-6">
              <div>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/order")}
                  className="flex items-center gap-1 mb-6"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Menu Selection
                </Button>
              </div>
              
              <div className="h-[500px] overflow-hidden rounded-lg">
                <img 
                  src={menuItem.image_url || "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666"} 
                  alt={menuItem.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">{menuItem.name}</h1>
                <p className="text-gray-600">{menuItem.description}</p>
                
                <div className="flex flex-wrap gap-2">
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
                
                <QuantitySelector
                  quantity={customizedMenu.quantity}
                  minimumQuantity={minimumQuantity}
                  onUpdateQuantity={onUpdateQuantity}
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-6">
              <SubProductList
                subProducts={menuItem.sub_products}
                selectedSubProducts={customizedMenu.selectedSubProducts}
                onToggleSubProduct={onToggleSubProduct}
                formatPrice={formatPrice}
              />
              
              <PriceSummary
                totalPrice={customizedMenu.totalPrice}
                quantity={customizedMenu.quantity}
                formatPrice={formatPrice}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
