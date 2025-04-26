
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PackageSearch } from "lucide-react";
import { format } from "date-fns";

const OrderHistory = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu: menu_id (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      return data;
    },
  });

  const formatSEK = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600';
      case 'processing':
        return 'text-orange-600';
      case 'pending':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <PackageSearch className="h-6 w-6" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] rounded-md border p-4">
              {isLoading ? (
                <div className="text-center py-4">Loading your orders...</div>
              ) : orders?.length === 0 ? (
                <div className="text-center py-4">No orders found</div>
              ) : (
                <div className="space-y-4">
                  {orders?.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div>
                              <p className="font-semibold">Order #{order.reference || order.id.slice(0, 8)}</p>
                              <p className="text-sm text-gray-500">
                                {format(new Date(order.created_at), 'PPP')}
                              </p>
                            </div>
                            <div className="mt-2">
                              {order.order_items.map((item: any) => (
                                <p key={item.id} className="text-sm">
                                  • {item.quantity}x {item.menu.name}
                                </p>
                              ))}
                            </div>
                            {(order.delivery_notes || order.allergy_notes) && (
                              <div className="mt-2 text-sm text-gray-600">
                                {order.delivery_notes && (
                                  <p>Delivery notes: {order.delivery_notes}</p>
                                )}
                                {order.allergy_notes && (
                                  <p>Allergy notes: {order.allergy_notes}</p>
                                )}
                              </div>
                            )}
                            <div className="text-sm text-gray-600">
                              <p>Delivery to: {order.shipping_name}</p>
                              <p>{order.shipping_address}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatSEK(order.total_amount)}
                            </p>
                            {order.discount_amount > 0 && (
                              <p className="text-sm text-green-600">
                                Discount: -{formatSEK(order.discount_amount)}
                              </p>
                            )}
                            <p className={`text-sm mt-1 capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderHistory;
