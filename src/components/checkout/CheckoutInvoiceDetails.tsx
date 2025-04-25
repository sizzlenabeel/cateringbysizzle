
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrderAddresses } from "@/hooks/useOrderAddresses";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CheckoutInvoiceDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { company } = useOrderAddresses(user?.id);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invoice Details</CardTitle>
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
      <CardContent className="space-y-2">
        <div>
          <span className="font-medium">Company Name: </span>
          <span>{company?.name || 'Not available'}</span>
        </div>
        <div>
          <span className="font-medium">Organization Number: </span>
          <span>{company?.organization_number || 'Not available'}</span>
        </div>
        <div>
          <span className="font-medium">Billing Email: </span>
          <span>{company?.billing_email || 'Not available'}</span>
        </div>
      </CardContent>
    </Card>
  );
};
