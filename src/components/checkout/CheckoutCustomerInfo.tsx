
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CheckoutCustomerInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ordered By</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
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
