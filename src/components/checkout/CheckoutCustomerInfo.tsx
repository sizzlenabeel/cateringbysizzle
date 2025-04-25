
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CheckoutCustomerInfo = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ordered By</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <span className="font-medium">Name: </span>
          <span>{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</span>
        </div>
        <div>
          <span className="font-medium">Email: </span>
          <span>{user?.email}</span>
        </div>
        <div>
          <span className="font-medium">Phone: </span>
          <span>{user?.user_metadata?.phone || 'Not provided'}</span>
        </div>
      </CardContent>
    </Card>
  );
};
