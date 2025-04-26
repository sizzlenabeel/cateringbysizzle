
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";

interface CreateOrderParams {
  cartItems: CartItem[];
  shippingInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  notes?: {
    delivery?: string;
    allergy?: string;
  };
  totalAmount: number;
  discountCode?: string;
  discountAmount?: number;
}

export const createOrder = async (params: CreateOrderParams) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User must be logged in to create an order");

  // Start a Supabase transaction
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      shipping_name: params.shippingInfo.name,
      shipping_email: params.shippingInfo.email,
      shipping_phone: params.shippingInfo.phone,
      shipping_address: params.shippingInfo.address,
      delivery_notes: params.notes?.delivery,
      allergy_notes: params.notes?.allergy,
      total_amount: params.totalAmount,
      discount_code: params.discountCode,
      discount_amount: params.discountAmount || 0,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("Error creating order:", orderError);
    throw new Error("Failed to create order");
  }

  // Insert order items
  const orderItems = params.cartItems.map(item => ({
    order_id: order.id,
    menu_id: item.menuId,
    quantity: item.quantity,
    selected_sub_products: item.selectedSubProducts,
    total_price: item.totalPrice
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error("Error creating order items:", itemsError);
    // If order items fail, delete the order
    await supabase
      .from('orders')
      .delete()
      .eq('id', order.id);
    throw new Error("Failed to create order items");
  }

  return order;
};
