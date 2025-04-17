
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { menuItems } from "@/data/menuData";
import { currentCompany, getMinimumQuantity } from "@/data/cartData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Trash2, ShoppingBag, FileCheck, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(6, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Please enter a valid address" }),
  reference: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, applyDiscountCode, formatPrice } = useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      reference: "",
    },
  });

  const handleApplyDiscount = () => {
    applyDiscountCode(discountCode);
  };

  const onSubmitOrder = (values: CheckoutFormValues) => {
    // In a real app, we would send the order to the backend
    toast({
      title: "Order submitted!",
      description: "Your order has been placed. You will receive an invoice shortly.",
    });
    
    // Redirect to a confirmation page (would create in a real app)
    navigate("/order");
  };

  if (cart.items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Start browsing our menu to add items to your cart!</p>
            <Link to="/order">
              <Button className="bg-orange-600 hover:bg-orange-500">
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="flex items-center gap-1 mb-6"
          onClick={() => navigate("/order")}
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Button>

        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                {cart.items.map(item => {
                  const menu = menuItems.find(m => m.id === item.menuId);
                  if (!menu) return null;
                  
                  const minQuantity = getMinimumQuantity(menu.id);
                  
                  return (
                    <div key={item.menuId} className="mb-6 last:mb-0">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/4 h-24 rounded-md overflow-hidden">
                          <img 
                            src={menu.image} 
                            alt={menu.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-3/4 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="font-semibold text-lg">{menu.name}</h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.menuId)}
                                className="h-8 w-8 text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {item.selectedSubProducts.length} items selected
                            </p>
                            
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <span className="text-sm mr-2">Quantity:</span>
                                <Input
                                  type="number"
                                  min={minQuantity}
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.menuId, parseInt(e.target.value))}
                                  className="w-16 h-8 text-center"
                                />
                                <span className="text-xs text-gray-500 ml-2">
                                  Min: {minQuantity}
                                </span>
                              </div>
                              <div className="font-medium">
                                {formatPrice(item.totalPrice * item.quantity)}
                              </div>
                            </div>
                          </div>
                          
                          <Link 
                            to={`/menu/${menu.id}`}
                            className="text-sm text-purple-600 hover:text-purple-800"
                          >
                            Edit selection
                          </Link>
                        </div>
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                {currentCompany && (
                  <div className="bg-blue-50 p-3 rounded-md mb-4">
                    <p className="text-sm font-medium">Company discount applied:</p>
                    <p className="text-lg font-semibold text-blue-700">
                      {currentCompany.name} ({currentCompany.discountPercentage}%)
                    </p>
                  </div>
                )}
                
                {/* Discount Code */}
                <div className="mb-6">
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleApplyDiscount}
                      variant="outline"
                    >
                      Apply
                    </Button>
                  </div>
                  
                  {cart.discountCode && (
                    <div className="bg-green-50 p-2 rounded text-sm text-green-700">
                      Code "{cart.discountCode}" applied
                    </div>
                  )}
                </div>
                
                {/* Price Summary */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(cart.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-500"
                  onClick={() => setIsCheckingOut(true)}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Checkout Form */}
        {isCheckingOut && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Checkout</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setIsCheckingOut(false)}
                  >
                    Close
                  </Button>
                </div>
                
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileCheck className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Invoice Information</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your order will be processed and an invoice will be sent to the email address you provide below.
                  </p>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitOrder)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Email for invoice" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Billing address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="reference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Reference (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Project name, department" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="bg-slate-50 p-4 rounded-md mb-4">
                      <h3 className="font-semibold mb-2">Order Summary</h3>
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span className="font-bold">{formatPrice(cart.total)}</span>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Place Order
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
