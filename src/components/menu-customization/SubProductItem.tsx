
import React from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { SubProduct } from "@/types/supabase";

interface SubProductItemProps {
  subProduct: SubProduct;
  isSelected: boolean;
  onToggle: (id: string) => void;
  formatPrice: (price: number) => string;
}

export const SubProductItem = ({
  subProduct,
  isSelected,
  onToggle,
  formatPrice,
}: SubProductItemProps) => {
  return (
    <Card className={`p-4 cursor-pointer transition-all ${
      isSelected ? "border-catering-secondary bg-purple-50" : ""
    }`} onClick={() => onToggle(subProduct.id)}>
      <div className="flex items-start gap-3">
        <Checkbox checked={isSelected} />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{subProduct.name}</h3>
            <span className="text-sm font-medium">
              {formatPrice(subProduct.price)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{subProduct.description}</p>
        </div>
      </div>
    </Card>
  );
};
