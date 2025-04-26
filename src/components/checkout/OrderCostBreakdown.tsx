
import { Company } from "@/hooks/useOrderAddresses";

interface OrderCostBreakdownProps {
  taxBreakdown: {
    subtotalPreTax: number;
    productTaxAmount: number;
    adminFeeAmount: number;
    adminFeeTaxAmount: number;
    adminFeeDiscount: number;
    deliveryFeeAmount: number;
    deliveryFeeTaxAmount: number;
    deliveryFeeDiscount: number;
    totalAmount: number;
  };
  formatPrice: (amount: number) => string;
  companyDiscountPercentage: number;
  discountInfo: { percentage: number; applies_to?: string[] } | null;
}

export const OrderCostBreakdown = ({ 
  taxBreakdown, 
  formatPrice, 
  companyDiscountPercentage,
  discountInfo 
}: OrderCostBreakdownProps) => {
  return (
    <div className="border-t pt-4 space-y-2">
      <div className="flex justify-between">
        <span>Subtotal (excl. VAT)</span>
        <span>{formatPrice(taxBreakdown.subtotalPreTax)}</span>
      </div>
    
      <div className="flex justify-between text-sm text-gray-600">
        <span>VAT (12%)</span>
        <span>{formatPrice(taxBreakdown.productTaxAmount)}</span>
      </div>

      <div className="flex justify-between">
        <span>Administrative fee (5%)</span>
        <span>{formatPrice(taxBreakdown.adminFeeAmount)}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Administrative fee VAT (25%)</span>
        <span>{formatPrice(taxBreakdown.adminFeeTaxAmount)}</span>
      </div>

      <div className="flex justify-between">
        <span>Delivery fee</span>
        <span>{formatPrice(taxBreakdown.deliveryFeeAmount)}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Delivery fee VAT (25%)</span>
        <span>{formatPrice(taxBreakdown.deliveryFeeTaxAmount)}</span>
      </div>

      {companyDiscountPercentage > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Company Discount ({companyDiscountPercentage}%)</span>
          <span>-{formatPrice((taxBreakdown.adminFeeDiscount + taxBreakdown.deliveryFeeDiscount))}</span>
        </div>
      )}

      {discountInfo && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount Code ({discountInfo.percentage}%)</span>
          <span>Applied to: {discountInfo.applies_to?.join(', ')}</span>
        </div>
      )}

      <div className="border-t pt-2 flex justify-between font-bold">
        <span>Total</span>
        <span>{formatPrice(taxBreakdown.totalAmount)}</span>
      </div>
    </div>
  );
};
