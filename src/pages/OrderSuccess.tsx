
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingCart, FileText, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) return;

        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error) throw error;

        // Verify the order belongs to the current user
        if (data.user_id !== user?.id) {
          throw new Error("You don't have permission to view this order");
        }

        setOrder(data);
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [orderId, user]);

  // Helper function to format price
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(price);
  };

  // Email has been sent automatically or is in the process
  const emailStatus = order?.customer_email_sent
    ? "Order confirmation has been sent to your email"
    : "Order confirmation email will be sent shortly";

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <p>Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <Button className="mt-4" asChild>
                <Link to="/order-history">View Order History</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center border-b pb-6">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
            <p className="text-gray-600 mt-2">
              Thank you for your order. We've received your request and it's being processed.
            </p>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Order Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Order ID:</p>
                  <p className="font-mono">{order?.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Order Date:</p>
                  <p>{new Date(order?.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status:</p>
                  <p className="capitalize">{order?.status}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount:</p>
                  <p className="font-semibold">{formatPrice(order?.total_amount)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-600 flex-shrink-0" />
              <p className="text-sm text-gray-700">{emailStatus}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild className="flex-1">
                <Link to="/order-history">
                  <FileText className="h-4 w-4 mr-2" /> View Order History
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/order">
                  <ShoppingCart className="h-4 w-4 mr-2" /> Place New Order
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
