
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOrderAddresses } from "@/hooks/useOrderAddresses";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CheckoutDeliveryInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectedAddress } = useOrderAddresses(user?.id);
  const [deliveryNotes, setDeliveryNotes] = useState("");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Delivery Details</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/company-settings")}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div>
            <span className="font-medium">Delivery Address: </span>
            <span>{selectedAddress?.address || 'No address selected'}</span>
          </div>
          <div className="pt-4">
            <label htmlFor="deliveryNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Instructions
            </label>
            <Textarea
              id="deliveryNotes"
              placeholder="Enter any specific delivery instructions, building access details, or who to contact for delivery..."
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
