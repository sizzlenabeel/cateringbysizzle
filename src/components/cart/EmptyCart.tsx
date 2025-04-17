
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export const EmptyCart = () => {
  return (
    <div className="text-center py-16">
      <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-6" />
      <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
      <p className="text-gray-500 mb-8">Start browsing our menu to add items to your cart!</p>
      <Link to="/order">
        <Button className="bg-orange-600 hover:bg-orange-500">
          Browse Menu
        </Button>
      </Link>
    </div>
  );
};
