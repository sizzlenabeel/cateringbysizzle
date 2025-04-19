
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { CartItem as CartItemType } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  formatPrice: (price: number) => string;
}

export const CartItemComponent = ({ item, onUpdateQuantity, onRemove, formatPrice }: CartItemProps) => {
  // Fetch menu item details
  const { data: menuItem, isLoading } = useQuery({
    queryKey: ['menuItem', item.menuId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', item.menuId)
        .single();

      if (error) {
        console.error('Error fetching menu item:', error);
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="mb-6 last:mb-0">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-24 w-full md:w-1/4" />
          <div className="md:w-3/4 space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!menuItem) {
    return null;
  }

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4">
          <img 
            src={menuItem.image_url || '/placeholder.svg'} 
            alt={menuItem.name} 
            className="w-full h-24 object-cover rounded-md"
          />
        </div>
        <div className="md:w-3/4">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold text-lg">{menuItem.name}</h3>
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
