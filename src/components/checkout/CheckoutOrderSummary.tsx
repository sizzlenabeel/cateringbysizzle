
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CheckoutOrderSummary = () => {
  const { cartItems, subtotal, formatPrice } = useCart();
  const [allergyNotes, setAllergyNotes] = useState("");

  // Fetch menu item details for the cart items
  const { data: menuItems } = useQuery({
    queryKey: ['menuItems', cartItems.map(item => item.menuId)],
    queryFn: async () => {
      const { data } = await supabase
        .from('menu_items')
        .select('*')
        .in('id', cartItems.map(item => item.menuId));
      return data || [];
    },
  });

  const formatSEK = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
                          const subProduct = menuItem?.sub_products?.find(sp => sp.id === subProductId);
                          return (
                            <li key={subProductId}>{subProduct?.name}</li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="font-medium">
                  {formatSEK(item.totalPrice * item.quantity)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4">
          <label htmlFor="allergyNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Allergy Information
          </label>
          <Textarea
            id="allergyNotes"
            placeholder="Please list any allergies or dietary restrictions..."
            value={allergyNotes}
            onChange={(e) => setAllergyNotes(e.target.value)}
            className="mb-4"
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatSEK(subtotal)}</span>
          </div>
        </div>

        <Button className="w-full bg-orange-600 hover:bg-orange-500">
          Place Order
        </Button>
      </CardContent>
    </Card>
  );
};
