
import { Card, CardContent } from "@/components/ui/card";
import { SubProduct } from "@/types/supabase";
import { SubProductItem } from "./SubProductItem";

type SubProductListProps = {
  subProducts: (SubProduct & { is_default: boolean })[];
  selectedSubProducts: string[];
  onToggleSubProduct: (id: string) => void;
  formatPrice: (price: number) => string;
};

export const SubProductList = ({
  subProducts,
  selectedSubProducts,
  onToggleSubProduct,
  formatPrice
}: SubProductListProps) => {
  const defaultProducts = subProducts.filter(sp => sp.is_default);
  const optionalProducts = subProducts.filter(sp => !sp.is_default);

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Customize Your Menu</h2>
        <p className="text-gray-600 mb-6">
          Select or deselect items to customize your menu. The price will update automatically.
        </p>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-3">Included Items</h3>
            <div className="space-y-3">
              {defaultProducts.map(subProduct => (
                <SubProductItem 
                  key={subProduct.id}
                  subProduct={subProduct}
                  isSelected={selectedSubProducts.includes(subProduct.id)}
                  onToggle={onToggleSubProduct}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Optional Add-ons</h3>
            <div className="space-y-3">
              {optionalProducts.map(subProduct => (
                <SubProductItem 
                  key={subProduct.id}
                  subProduct={subProduct}
                  isSelected={selectedSubProducts.includes(subProduct.id)}
                  onToggle={onToggleSubProduct}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
