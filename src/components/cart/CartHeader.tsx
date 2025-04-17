
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CartHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      className="flex items-center gap-1 mb-6"
      onClick={() => navigate("/order")}
    >
      <ArrowLeft className="h-4 w-4" />
      Continue Shopping
    </Button>
  );
};
