
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";

interface OrderValidationError {
  field: string;
  message: string;
}

interface CreateOrderPayload {
  cartItems: CartItem[];
  shippingInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  notes: {
    delivery: string;
    allergy: string;
  };
  totalAmount: number;
}

export const useOrderCreation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateOrder = (): OrderValidationError[] => {
    const errors: OrderValidationError[] = [];

    if (!user?.user_metadata?.first_name || !user?.user_metadata?.last_name) {
      errors.push({
        field: "name",
        message: "Please complete your name in profile settings"
      });
    }
    if (!user?.user_metadata?.phone) {
      errors.push({
        field: "phone",
        message: "Please add your phone number in profile settings"
      });
    }

    return errors;
  };

  const createOrderMutation = useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: payload.totalAmount,
          shipping_name: payload.shippingInfo.name,
          shipping_email: payload.shippingInfo.email,
          shipping_phone: payload.shippingInfo.phone,
          shipping_address: payload.shippingInfo.address,
          delivery_notes: payload.notes.delivery,
          allergy_notes: payload.notes.allergy,
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

      const orderItems = payload.cartItems.map(item => ({
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

      return order;
    },
    onSuccess: (order) => {
      console.log("Order complete, redirecting...");
      navigate(`/order-success/${order.id}`);
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

  const createOrder = async (payload: CreateOrderPayload) => {
    if (isSubmitting) return;

    const validationErrors = validateOrder();
    
    if (validationErrors.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: (
          <ul className="list-disc pl-4">
            {validationErrors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        ),
      });
      return;
    }

    setIsSubmitting(true);
    await createOrderMutation.mutate(payload);
  };

  return {
    createOrder,
    isSubmitting,
  };
};
