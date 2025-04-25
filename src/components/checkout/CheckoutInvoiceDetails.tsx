
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderAddresses } from "@/hooks/useOrderAddresses";
import { useAuth } from "@/contexts/AuthContext";

export const CheckoutInvoiceDetails = () => {
  const { user } = useAuth();
  const { company } = useOrderAddresses(user?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Details</CardTitle>
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
