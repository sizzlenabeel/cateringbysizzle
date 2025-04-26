
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useOrderAddresses } from "@/hooks/useOrderAddresses";
import { useDiscountCode } from '@/hooks/useDiscountCode';
import { OrderItemsList } from './OrderItemsList';
import { OrderNotes } from './OrderNotes';
import { OrderCostBreakdown } from './OrderCostBreakdown';
import { DiscountCodeInput } from './DiscountCodeInput';
import { useOrderCreation } from "@/hooks/useOrderCreation";

export const CheckoutOrderSummary = () => {
  const { cartItems, subtotal, formatPrice, removeItem } = useCart();
  const [allergyNotes, setAllergyNotes] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const { user } = useAuth();
  const { company, selectedAddress } = useOrderAddresses(user?.id);
  const { createOrder, isSubmitting } = useOrderCreation();

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

  const handlePlaceOrder = () => {
    if (!selectedAddress?.address) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a delivery address in company settings",
      });
      return;
    }

    if (!company?.name || !company?.organization_number || !company?.billing_email) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please complete company invoice details in company settings",
      });
      return;
    }

    createOrder({
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
