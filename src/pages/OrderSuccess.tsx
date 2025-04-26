import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, ShoppingBag } from "lucide-react";

interface ExtendedOrder {
  id: string;
  reference?: string;
  status: string;
  total_amount: number;
  discount_amount: number;
  discount_code?: string;
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  delivery_notes?: string;
  allergy_notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  order_items: {
    id: string;
    quantity: number;
    total_price: number;
    menu_id: {
      name: string;
      description?: string;
    };
  }[];
}

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_id (
              name,
              description
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        console.error("Error fetching order:", error);
        throw error;
      }
      return data as ExtendedOrder;
    },
    enabled: !!orderId && !!user,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          Loading order details...
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          Order not found
        </div>
      </Layout>
    );
  }

  const formatSEK = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-100 rounded-full p-4">
                <ShoppingBag className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thanks for your order. We'll notify you when it's ready.
            </p>
            <p className="text-sm text-gray-500">
              Order Reference: {order.reference || order.id}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Delivery Information</h3>
                  <p>{order.shipping_name}</p>
                  <p>{order.shipping_email}</p>
                  <p>{order.shipping_phone}</p>
                  <p>{order.shipping_address}</p>
                  {order.delivery_notes && (
                    <p className="mt-2 text-sm text-gray-600">
                      Delivery Notes: {order.delivery_notes}
                    </p>
                  )}
                </div>

                {order.allergy_notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Allergy Information</h3>
                    <p className="text-sm text-gray-600">{order.allergy_notes}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">{item.menu_id.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">
                          {formatSEK(item.total_price)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatSEK(order.total_amount)}</span>
                    </div>
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatSEK(order.discount_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatSEK(order.total_amount - order.discount_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              onClick={() => navigate("/order")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Button>
            <Button 
              onClick={() => navigate("/order-history")}
            >
              View All Orders
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
