
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { CartHeader } from "@/components/cart/CartHeader";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CartItemComponent } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, isLoading, updateQuantity, removeItem, subtotal, formatPrice } = useCart();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            Loading cart...
          </div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <EmptyCart />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <CartHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                {cartItems.map(item => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    formatPrice={formatPrice}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <CartSummary 
              subtotal={subtotal}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
