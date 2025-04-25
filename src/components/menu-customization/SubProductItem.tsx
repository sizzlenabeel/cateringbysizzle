
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus } from "lucide-react";
import { SubProduct } from "@/types/supabase";

type SubProductItemProps = {
  subProduct: SubProduct & { is_default: boolean };
  isSelected: boolean;
  onToggle: (id: string) => void;
  formatPrice: (price: number) => string;
};

export const SubProductItem = ({ 
  subProduct, 
  isSelected, 
  onToggle,
  formatPrice 
}: SubProductItemProps) => {
  return (
    <div className={`
      flex items-center justify-between p-3 rounded-lg border 
      ${isSelected ? 'border-purple-400 bg-purple-50' : 'border-gray-200'}
      transition-all hover:border-purple-300
    `}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Checkbox 
            checked={isSelected} 
            id={`checkbox-${subProduct.id}`}
            onCheckedChange={() => onToggle(subProduct.id)}
          />
        </div>
        <div>
          <label 
            htmlFor={`checkbox-${subProduct.id}`}
            className="font-medium cursor-pointer flex items-center"
          >
            {subProduct.name}
            {subProduct.is_vegan && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                Vegan
              </span>
            )}
          </label>
          <p className="text-sm text-gray-600">{subProduct.description}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="font-medium text-orange-600">{formatPrice(Number(subProduct.price))}</span>
        {isSelected ? (
          <button 
            onClick={() => onToggle(subProduct.id)}
            className="ml-3 p-1 text-red-500 hover:bg-red-50 rounded"
            aria-label="Remove item"
          >
            <Minus className="h-4 w-4" />
          </button>
        ) : (
          <button 
            onClick={() => onToggle(subProduct.id)}
            className="ml-3 p-1 text-green-500 hover:bg-green-50 rounded"
            aria-label="Add item"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
