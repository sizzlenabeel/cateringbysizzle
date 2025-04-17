
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PackageSearch } from "lucide-react";

const OrderHistory = () => {
  // This would be replaced with real order data from your backend
  const orders = [
    {
      id: "1",
      date: "2024-04-17",
      status: "Delivered",
      total: "$250.00",
      items: ["Catering Package A", "Drinks Package"],
    },
    {
      id: "2", 
      date: "2024-04-15",
      status: "Processing",
      total: "$175.50",
      items: ["Party Platter", "Dessert Selection"],
    },
  ];

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
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                          <div className="mt-2">
                            {order.items.map((item, index) => (
                              <p key={index} className="text-sm">
                                • {item}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{order.total}</p>
                          <p className={`text-sm ${
                            order.status === "Delivered" 
                              ? "text-green-600" 
                              : "text-orange-600"
                          }`}>
                            {order.status}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderHistory;
