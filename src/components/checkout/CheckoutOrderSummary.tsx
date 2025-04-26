import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useOrderAddresses } from "@/hooks/useOrderAddresses";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { calculateOrderTaxes } from "@/utils/TaxUtils";
import { useDiscountCode } from '@/hooks/useDiscountCode';
import { DiscountCodeInput } from './DiscountCodeInput';
import { OrderItemsList } from './OrderItemsList';
import { OrderNotes } from './OrderNotes';
import { OrderCostBreakdown } from './OrderCostBreakdown';

export const CheckoutOrderSummary = () => {
  const { cartItems, subtotal, formatPrice, removeItem } = useCart();
  const [allergyNotes, setAllergyNotes] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { company, selectedAddress } = useOrderAddresses(user?.id);

  const {
    discountCode,
    discountInfo,
    isValidating,
    validateDiscountCode,
    clearDiscount
  } = useDiscountCode();

  const companyDiscountPercentage = company?.discount_percentage ?? 0;

  const taxBreakdown = calculateOrderTaxes(
    subtotal,
    discountInfo,
    companyDiscountPercentage
  );

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
    mutationFn: async (payload: any) => {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: payload.totalAmount,
          shipping_name: `${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}`,
          shipping_email: user?.email,
          shipping_phone: user?.user_metadata?.phone,
          shipping_address: selectedAddress?.address,
          delivery_notes: deliveryNotes,
          allergy_notes: allergyNotes,
          subtotal_pre_tax: taxBreakdown.subtotalPreTax,
          product_tax_amount: taxBreakdown.productTaxAmount,
          admin_fee_amount: taxBreakdown.adminFeeAmount,
          admin_fee_tax_amount: taxBreakdown.adminFeeTaxAmount,
          admin_fee_discount: taxBreakdown.adminFeeDiscount,
          delivery_fee_amount: taxBreakdown.deliveryFeeAmount,
          delivery_fee_tax_amount: taxBreakdown.deliveryFeeTaxAmount,
          delivery_fee_discount: taxBreakdown.deliveryFeeDiscount,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        throw orderError;
      }
      
      if (!order) {
        throw new Error("Failed to create order - no order data returned");
      }

      console.log("Order created successfully:", order);

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

      if (itemsError) {
        console.error("Order items creation error:", itemsError);
        throw itemsError;
      }

      console.log("Order items created successfully");
      return order;
    },
    onSuccess: (order) => {
      console.log("Order complete, clearing cart and redirecting...");
      
      Promise.all(cartItems.map(item => removeItem(item.id)))
        .then(() => {
          navigate(`/order-success/${order.id}`);
        })
        .catch(error => {
          console.error("Error clearing cart:", error);
          navigate(`/order-success/${order.id}`);
        });
    },
    onError: (error) => {
      console.error('Order creation error:', error);
      toast({
        variant: "destructive",
        title: "Error creating order",
        description: "There was a problem creating your order. Please try again.",
      });
      setIsSubmitting(false);
    },
  });

  const handlePlaceOrder = () => {
    if (isSubmitting) return;
    
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

    setIsSubmitting(true);
    
    createOrderMutation.mutate({
      cartItems,
      shippingInfo: {
        name: `${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}`,
        email: user?.email || '',
        phone: user?.user_metadata?.phone || '',
        address: selectedAddress?.address || '',
      },
      notes: {
        delivery: deliveryNotes,
        allergy: allergyNotes,
      },
      totalAmount: taxBreakdown.totalAmount,
    });
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <OrderItemsList 
          cartItems={cartItems}
          formatPrice={formatPrice}
        />

        <div className="pt-4">
          <DiscountCodeInput
            onApplyDiscount={validateDiscountCode}
            isValidating={isValidating}
            discountCode={discountCode}
            onClear={clearDiscount}
          />
        </div>

        <OrderNotes
          allergyNotes={allergyNotes}
          deliveryNotes={deliveryNotes}
          onAllergyNotesChange={setAllergyNotes}
          onDeliveryNotesChange={setDeliveryNotes}
        />

        <OrderCostBreakdown
          taxBreakdown={taxBreakdown}
          formatPrice={formatPrice}
          companyDiscountPercentage={companyDiscountPercentage}
          discountInfo={discountInfo}
        />

        <Button 
          className="w-full bg-orange-600 hover:bg-orange-500"
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </Button>
      </CardContent>
    </Card>
  );
};
