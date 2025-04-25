
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useOrderAddresses } from "@/hooks/useOrderAddresses";
import { useAuth } from "@/contexts/AuthContext";

export const CheckoutDeliveryInfo = () => {
  const { user } = useAuth();
  const { selectedAddress } = useOrderAddresses(user?.id);
  const [deliveryNotes, setDeliveryNotes] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Details</CardTitle>
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
