
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { MenuItemWithRelations } from "@/types/supabase";
import { MenuHeader } from "./MenuHeader";
import { QuantitySelector } from "./QuantitySelector";
import { PriceSummary } from "./PriceSummary";
import { SubProductList } from "./SubProductList";
import { useIsMobile } from "@/hooks/use-mobile";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-6">
            <MenuHeader
              name={menuItem.name}
              description={menuItem.description}
              imageUrl={menuItem.image_url}
              eventTypes={menuItem.event_types}
              isVegan={menuItem.is_vegan}
            />
          </div>
          
          <div className="flex flex-col space-y-6 relative">
            {!isMobile && (
              <div className="md:block">
                <QuantitySelector
                  quantity={customizedMenu.quantity}
                  minimumQuantity={minimumQuantity}
                  onUpdateQuantity={onUpdateQuantity}
                />
              </div>
            )}
            
            <div className="md:block">
              <SubProductList
                subProducts={menuItem.sub_products}
                selectedSubProducts={customizedMenu.selectedSubProducts}
                onToggleSubProduct={onToggleSubProduct}
                formatPrice={formatPrice}
              />
            </div>
            
            {isMobile ? (
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
            ) : (
              <div className="md:block">
                <PriceSummary
                  totalPrice={customizedMenu.totalPrice}
                  quantity={customizedMenu.quantity}
                  formatPrice={formatPrice}
                  onAddToCart={handleAddToCart}
                />
              </div>
            )}
          </div>
        </div>
        
        {isMobile && (
          <div className="pb-32">
            <QuantitySelector
              quantity={customizedMenu.quantity}
              minimumQuantity={minimumQuantity}
              onUpdateQuantity={onUpdateQuantity}
            />
          </div>
        )}
      </div>
    </div>
  );
};
