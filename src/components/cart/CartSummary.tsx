
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface CartSummaryProps {
  subtotal: number;
  formatPrice: (price: number) => string;
}

export const CartSummary = ({ subtotal, formatPrice }: CartSummaryProps) => {
  const navigate = useNavigate();

  return (
    <Card className="sticky top-20">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Button 
            className="w-full bg-orange-600 hover:bg-orange-500"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
