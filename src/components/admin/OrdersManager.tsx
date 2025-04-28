
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminDataTable, AdminDataTableColumn } from "@/components/admin/common/AdminDataTable";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, RefreshCcw, ClipboardCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrderStatusBadge } from "@/components/admin/orders/OrderStatusBadge";
import { ViewOrderDialog } from "@/components/admin/orders/ViewOrderDialog";
import { UpdateOrderStatusDialog } from "@/components/admin/orders/UpdateOrderStatusDialog";

type Order = {
  id: string;
  status: string;
  total_amount: number;
  shipping_name: string;
  shipping_email: string;
  created_at: string;
  customer_email_sent: boolean;
  kitchen_email_sent: boolean;
  invoice_generated: boolean;
  reference?: string;
};

const OrdersManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  
  // Fetch orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    },
  });

  // Send customer email mutation
  const sendCustomerEmailMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch(`${window.location.origin}/api/send-order-emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          orderId,
          emailType: "customer",
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send customer email");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "Customer notification email was sent successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send email: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Send kitchen email mutation
  const sendKitchenEmailMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch(`${window.location.origin}/api/send-order-emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          orderId,
          emailType: "kitchen",
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send kitchen email");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "Kitchen notification email was sent successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send email: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Generate invoice mutation
  const generateInvoiceMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch(`${window.location.origin}/api/generate-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          orderId,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate invoice");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Invoice Generated",
        description: "The invoice was generated successfully",
      });
      
      // Download the PDF
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${data.invoicePdfBase64}`;
      link.download = `invoice-${data.orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate invoice: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update order status
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);
      
      if (error) throw error;
      return { orderId, status };
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Order status was updated successfully",
      });
      setStatusDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Define table columns
  const columns: AdminDataTableColumn<Order>[] = [
    {
      header: "Order ID",
      accessorKey: "id",
      cell: (order) => (
        <span className="font-mono text-xs">
          {order.id.substring(0, 8)}...
        </span>
      ),
    },
    {
      header: "Customer",
      accessorKey: "shipping_name",
    },
    {
      header: "Created",
      accessorKey: "created_at",
      cell: (order) => (
        <span>
          {new Date(order.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Amount",
      accessorKey: "total_amount",
      cell: (order) => (
        <span>
          {order.total_amount.toLocaleString('sv-SE', { style: 'currency', currency: 'SEK' })}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (order) => (
        <OrderStatusBadge status={order.status} />
      ),
    },
    {
      header: "Notifications",
      accessorKey: (order) => (
        <div className="flex gap-2">
          <Badge variant={order.customer_email_sent ? "default" : "outline"}>
            Customer
          </Badge>
          <Badge variant={order.kitchen_email_sent ? "default" : "outline"}>
            Kitchen
          </Badge>
        </div>
      ),
    },
    {
      header: "Actions",
      accessorKey: (order) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrder(order);
              setViewDialogOpen(true);
            }}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              sendCustomerEmailMutation.mutate(order.id);
            }}
            disabled={sendCustomerEmailMutation.isPending}
            title="Send customer notification"
          >
            <Mail className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              generateInvoiceMutation.mutate(order.id);
            }}
            disabled={generateInvoiceMutation.isPending}
            title="Generate invoice"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };
  
  const handleUpdateStatus = (status: string) => {
    if (selectedOrder) {
      updateOrderStatusMutation.mutate({ 
        orderId: selectedOrder.id, 
        status 
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <Button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-orders"] })}
          variant="outline"
        >
          <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      <AdminDataTable
        data={orders}
        columns={columns}
        isLoading={isLoading}
        onEdit={handleViewOrder}
        onDelete={(order) => {
          setSelectedOrder(order);
          setStatusDialogOpen(true);
        }}
        emptyMessage="No orders found"
      />

      {selectedOrder && (
        <>
          <ViewOrderDialog
            order={selectedOrder}
            isOpen={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            onSendCustomerEmail={() => sendCustomerEmailMutation.mutate(selectedOrder.id)}
            onSendKitchenEmail={() => sendKitchenEmailMutation.mutate(selectedOrder.id)}
            onGenerateInvoice={() => generateInvoiceMutation.mutate(selectedOrder.id)}
            onUpdateStatus={() => {
              setViewDialogOpen(false);
              setStatusDialogOpen(true);
            }}
          />
          
          <UpdateOrderStatusDialog
            isOpen={statusDialogOpen}
            onClose={() => setStatusDialogOpen(false)}
            currentStatus={selectedOrder.status}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={updateOrderStatusMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default OrdersManager;
