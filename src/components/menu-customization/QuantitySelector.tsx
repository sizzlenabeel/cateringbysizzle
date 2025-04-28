
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type QuantitySelectorProps = {
  quantity: number;
  minimumQuantity: number;
  onUpdateQuantity: (quantity: number) => void;
};

export const QuantitySelector = ({
  quantity,
  minimumQuantity,
  onUpdateQuantity
}: QuantitySelectorProps) => {
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState(quantity.toString());

  const validateAndUpdateQuantity = (value: number) => {
    if (value >= minimumQuantity) {
      onUpdateQuantity(value);
      setInputValue(value.toString());
    } else {
      setInputValue(quantity.toString());
      toast({
        title: "Minimum quantity required",
        description: `This menu requires a minimum of ${minimumQuantity} orders`,
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputBlur = () => {
    const newValue = parseInt(inputValue);
    if (isNaN(newValue) || inputValue === "") {
      setInputValue(quantity.toString());
    } else {
      validateAndUpdateQuantity(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newValue = parseInt(inputValue);
      if (!isNaN(newValue)) {
        validateAndUpdateQuantity(newValue);
      }
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="quantity" className="font-medium">Quantity:</label>
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => validateAndUpdateQuantity(quantity - 1)}
            disabled={quantity <= minimumQuantity}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            id="quantity"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-16 mx-2 text-center h-8"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => validateAndUpdateQuantity(quantity + 1)}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-500">
        Minimum quantity: {minimumQuantity}
      </p>
    </div>
  );
};
