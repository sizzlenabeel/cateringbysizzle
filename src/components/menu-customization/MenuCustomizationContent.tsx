
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { MenuItemWithRelations } from "@/types/supabase";
import { MenuHeader } from "./MenuHeader";
import { QuantitySelector } from "./QuantitySelector";
import { PriceSummary } from "./PriceSummary";
import { SubProductList } from "./SubProductList";

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
          
          <div className="flex flex-col space-y-6">
            <div className="md:block">
              <QuantitySelector
                quantity={customizedMenu.quantity}
                minimumQuantity={minimumQuantity}
                onUpdateQuantity={onUpdateQuantity}
              />
            </div>
            
            <div className="md:block">
              <SubProductList
                subProducts={menuItem.sub_products}
                selectedSubProducts={customizedMenu.selectedSubProducts}
                onToggleSubProduct={onToggleSubProduct}
                formatPrice={formatPrice}
              />
            </div>
            
            <div className="md:block md:mt-4 sticky bottom-0 bg-white p-4 md:p-0 shadow-lg md:shadow-none z-10 md:z-0">
              <PriceSummary
                totalPrice={customizedMenu.totalPrice}
                quantity={customizedMenu.quantity}
                formatPrice={formatPrice}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
