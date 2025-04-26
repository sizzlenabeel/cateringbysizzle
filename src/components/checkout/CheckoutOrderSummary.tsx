import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useOrderAddresses } from "@/hooks/useOrderAddresses";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const CheckoutOrderSummary = () => {
  const { cartItems, subtotal, formatPrice } = useCart();
  const [allergyNotes, setAllergyNotes] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const { company, selectedAddress } = useOrderAddresses(user?.id);
  const navigate = useNavigate();

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

  const formatSEK = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  const validateCheckout = () => {
    const errors = [];

    if (!user?.user_metadata?.first_name || !user?.user_metadata?.last_name) {
      errors.push("Please complete your name in profile settings");
    }
    if (!user?.user_metadata?.phone) {
      errors.push("Please add your phone number in profile settings");
    }

    if (!selectedAddress?.address) {
      errors.push("Please select a delivery address in company settings");
    }

    if (!company?.name || !company?.organization_number || !company?.billing_email) {
      errors.push("Please complete company invoice details in company settings");
    }

    return errors;
  };

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: subtotal,
          shipping_name: `${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}`,
          shipping_email: user?.email,
          shipping_phone: user?.user_metadata?.phone,
          shipping_address: selectedAddress?.address,
          delivery_notes: deliveryNotes,
          allergy_notes: allergyNotes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        menu_id: item.menuId,
        quantity: item.quantity,
        selected_sub_products: item.selectedSubProducts,
        total_price: item.totalPrice,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: (order) => {
      cartItems.forEach(item => removeItem(item.id));
      navigate(`/order-success/${order.id}`);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error creating order",
        description: "There was a problem creating your order. Please try again.",
      });
      console.error('Order creation error:', error);
    },
  });

  const handlePlaceOrder = () => {
    const validationErrors = validateCheckout();
    
    if (validationErrors.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: (
          <ul className="list-disc pl-4">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
      });
      return;
    }

    createOrderMutation.mutate();
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

        <div className="pt-4">
          <label htmlFor="deliveryNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Notes
          </label>
          <Textarea
            id="deliveryNotes"
            placeholder="Please add any delivery notes..."
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            className="mb-4"
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatSEK(subtotal)}</span>
          </div>
        </div>

        <Button 
          className="w-full bg-orange-600 hover:bg-orange-500"
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </CardContent>
    </Card>
  );
};
