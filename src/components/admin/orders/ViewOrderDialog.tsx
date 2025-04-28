
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/components/admin/orders/OrderStatusBadge";
import { Download, Mail, Clipboard, ClipboardCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  menu_id: string;
  quantity: number;
  total_price: number;
  menu_item_name?: string;
}

interface ViewOrderDialogProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onSendCustomerEmail: () => void;
  onSendKitchenEmail: () => void;
  onGenerateInvoice: () => void;
  onUpdateStatus: () => void;
}

export const ViewOrderDialog = ({
  order,
  isOpen,
  onClose,
  onSendCustomerEmail,
  onSendKitchenEmail,
  onGenerateInvoice,
  onUpdateStatus
}: ViewOrderDialogProps) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && order) {
      fetchOrderDetails();
    }
  }, [isOpen, order]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch order items with menu item details
      const { data: items, error } = await supabase
        .from("order_items")
        .select(`
          id, 
          menu_id, 
          quantity, 
          total_price,
          menu_items:menu_id (name)
        `)
        .eq("order_id", order.id);
      
      if (error) throw error;
      
      const formattedItems = items.map((item: any) => ({
        ...item,
        menu_item_name: item.menu_items?.name || "Unknown Item",
      }));
      
      setOrderItems(formattedItems);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('sv-SE', { style: 'currency', currency: 'SEK' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Order Details</span>
            <OrderStatusBadge status={order.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Order ID:</p>
              <div className="flex items-center">
                <p className="font-mono">{order.id.substring(0, 12)}...</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 ml-2"
                  onClick={copyOrderId}
                >
                  {copySuccess ? (
                    <ClipboardCheck className="h-4 w-4" />
                  ) : (
                    <Clipboard className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Date:</p>
              <p>{formatDate(order.created_at)}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Name:</p>
                <p>{order.shipping_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email:</p>
                <p>{order.shipping_email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone:</p>
                <p>{order.shipping_phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Address:</p>
                <p>{order.shipping_address}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Order Items</h3>
            {loading ? (
              <p>Loading order items...</p>
            ) : (
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.menu_item_name}
                    </span>
                    <span>{formatPrice(item.total_price)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-between gap-2">
            <Button 
              variant="outline" 
              onClick={onUpdateStatus}
              className="flex-1"
            >
              Update Status
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={onSendCustomerEmail}
                title="Send customer email"
              >
                <Mail className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={onSendKitchenEmail}
                title="Send kitchen notification"
              >
                <Mail className="h-4 w-4 text-orange-600" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={onGenerateInvoice}
                title="Generate invoice"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
