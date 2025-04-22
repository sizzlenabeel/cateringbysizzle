
import { Button } from "@/components/ui/button";

type PriceSummaryProps = {
  totalPrice: number;
  quantity: number;
  formatPrice: (price: number) => string;
  onAddToCart: () => void;
};

export const PriceSummary = ({
  totalPrice,
  quantity,
  formatPrice,
  onAddToCart
}: PriceSummaryProps) => {
  const pricePerPersonSEK = totalPrice.toLocaleString('sv-SE', { style: 'currency', currency: 'SEK', minimumFractionDigits: 2 });
  const totalPriceSEK = (totalPrice * quantity).toLocaleString('sv-SE', { style: 'currency', currency: 'SEK', minimumFractionDigits: 2 });

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-lg font-medium">Price per person:</span>
        <span className="text-2xl font-bold text-orange-600">
          {pricePerPersonSEK}
        </span>
      </div>
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-lg font-medium">Total price:</span>
        <span className="text-2xl font-bold text-orange-600">
          {totalPriceSEK}
        </span>
      </div>
      <Button 
        className="w-full mt-2 bg-orange-600 hover:bg-orange-500"
        onClick={onAddToCart}
      >
        Add to Cart
      </Button>
    </div>
  );
};
