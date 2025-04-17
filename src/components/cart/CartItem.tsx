
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { CartItem as CartItemType } from "@/contexts/CartContext";
import { menuItems } from "@/data/menuData";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  formatPrice: (price: number) => string;
}

export const CartItemComponent = ({ item, onUpdateQuantity, onRemove, formatPrice }: CartItemProps) => {
  const menu = menuItems.find(m => m.id === item.menuId);
  if (!menu) return null;

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4">
          <img 
            src={menu.image} 
            alt={menu.name} 
            className="w-full h-24 object-cover rounded-md"
          />
        </div>
        <div className="md:w-3/4">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold text-lg">{menu.name}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
              className="text-red-500 hover:text-red-600"
            >
              Remove
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="h-8 w-8"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
                className="w-16 text-center h-8"
                min={1}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="font-medium">
              {formatPrice(item.totalPrice * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
