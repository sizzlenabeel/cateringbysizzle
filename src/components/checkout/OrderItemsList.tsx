
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";

interface OrderItemsListProps {
  cartItems: CartItem[];
  formatPrice: (price: number) => string;
}

export const OrderItemsList = ({ cartItems, formatPrice }: OrderItemsListProps) => {
  const { data: menuItems } = useQuery({
    queryKey: ['menuItems', cartItems.map(item => item.menuId)],
    queryFn: async () => {
      const { data } = await supabase
        .from('menu_items')
        .select('*')
        .in('id', cartItems.map(item => item.menuId));
      return data || [];
    },
    enabled: cartItems.length > 0,
  });

  const { data: subProducts } = useQuery({
    queryKey: ['subProducts', cartItems],
    queryFn: async () => {
      const allSubProductIds = cartItems.flatMap(item => 
        item.selectedSubProducts || []
      );
      
      if (allSubProductIds.length === 0) return [];
      
      const { data } = await supabase
        .from('sub_products')
        .select('*')
        .in('id', allSubProductIds);
      return data || [];
    },
    enabled: cartItems.some(item => item.selectedSubProducts?.length > 0),
  });

  return (
    <div className="space-y-4">
      {cartItems.map((item) => {
        const menuItem = menuItems?.find(mi => mi.id === item.menuId);
        return (
          <div key={item.id} className="flex justify-between items-start border-b pb-4">
            <div className="space-y-1">
              <div className="font-medium">{menuItem?.name}</div>
              <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
              {item.selectedSubProducts && item.selectedSubProducts.length > 0 && (
                <div className="text-sm text-gray-500">
                  <p className="font-medium mb-1">Selected options:</p>
                  <ul className="list-disc pl-4">
                    {item.selectedSubProducts.map((subProductId) => {
                      const subProduct = subProducts?.find(sp => sp.id === subProductId);
                      return (
                        <li key={subProductId}>{subProduct?.name}</li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            <div className="font-medium">
              {formatPrice(item.totalPrice * item.quantity)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
