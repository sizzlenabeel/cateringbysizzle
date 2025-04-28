
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "processing" | "delivered" | "cancelled";

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Badge className={cn(getStatusColor(status))}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
