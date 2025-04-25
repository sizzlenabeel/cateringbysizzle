
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { CheckoutCustomerInfo } from "@/components/checkout/CheckoutCustomerInfo";
import { CheckoutDeliveryInfo } from "@/components/checkout/CheckoutDeliveryInfo";
import { CheckoutInvoiceDetails } from "@/components/checkout/CheckoutInvoiceDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, formatPrice } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!cartItems.length) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate("/order")}>Go to Menu</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CheckoutCustomerInfo />
            <CheckoutDeliveryInfo />
            <CheckoutInvoiceDetails />
          </div>
          <div className="lg:col-span-1">
            <CheckoutOrderSummary />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
