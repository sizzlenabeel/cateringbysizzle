
export const TAX_RATES = {
  PRODUCT_TAX: 0.12, // 12% VAT on food products
  SERVICE_TAX: 0.25, // 25% VAT on services (admin fee and delivery)
  ADMIN_FEE_PERCENTAGE: 0.05, // 5% administrative fee
  DELIVERY_FEE: 450, // Fixed delivery fee in SEK
} as const;

export interface OrderTaxBreakdown {
  subtotalPreTax: number;
  productTaxAmount: number;
  adminFeeAmount: number;
  adminFeeTaxAmount: number;
  adminFeeDiscount: number;
  deliveryFeeAmount: number;
  deliveryFeeTaxAmount: number;
  deliveryFeeDiscount: number;
  totalAmount: number;
}

export interface DiscountInfo {
  percentage: number;
  applies_to?: string[];
}

export const calculateOrderTaxes = (
  subtotal: number,
  discountInfo?: DiscountInfo | null,
  companyDiscountPercentage: number = 0
): OrderTaxBreakdown => {
  const subtotalPreTax = subtotal;
  const productTaxAmount = subtotalPreTax * TAX_RATES.PRODUCT_TAX;
  
  // Calculate admin fee before any discounts
  let adminFeeAmount = subtotalPreTax * TAX_RATES.ADMIN_FEE_PERCENTAGE;
  let adminFeeDiscount = 0;
  
  // Calculate delivery fee before any discounts
  let deliveryFeeAmount = TAX_RATES.DELIVERY_FEE;
  let deliveryFeeDiscount = 0;

  // Apply discounts if applicable
  const applyDiscount = (amount: number, discountPercentage: number) => {
    return amount * (discountPercentage / 100);
  };

  // First check for company-wide discount
  if (companyDiscountPercentage > 0) {
    // Company discount applies to everything by default
    adminFeeDiscount = applyDiscount(adminFeeAmount, companyDiscountPercentage);
    deliveryFeeDiscount = applyDiscount(deliveryFeeAmount, companyDiscountPercentage);
  }

  // Then check for specific discount code which might override company discount if higher
  if (discountInfo) {
    const { percentage, applies_to = ['products', 'admin_fee', 'delivery_fee'] } = discountInfo;
    
    if (applies_to.includes('admin_fee')) {
      const codeDiscount = applyDiscount(adminFeeAmount, percentage);
      // Use the higher discount between company and code discount
      adminFeeDiscount = Math.max(adminFeeDiscount, codeDiscount);
    }

    if (applies_to.includes('delivery_fee')) {
      const codeDiscount = applyDiscount(deliveryFeeAmount, percentage);
      // Use the higher discount between company and code discount
      deliveryFeeDiscount = Math.max(deliveryFeeDiscount, codeDiscount);
    }
  }

  // Apply the discounts
  adminFeeAmount -= adminFeeDiscount;
  deliveryFeeAmount -= deliveryFeeDiscount;

  // Calculate taxes after discounts
  const adminFeeTaxAmount = adminFeeAmount * TAX_RATES.SERVICE_TAX;
  const deliveryFeeTaxAmount = deliveryFeeAmount * TAX_RATES.SERVICE_TAX;

  const totalAmount = 
    subtotalPreTax + 
    productTaxAmount + 
    adminFeeAmount + 
    adminFeeTaxAmount + 
    deliveryFeeAmount + 
    deliveryFeeTaxAmount;

  return {
    subtotalPreTax,
    productTaxAmount,
    adminFeeAmount,
    adminFeeTaxAmount,
    adminFeeDiscount,
    deliveryFeeAmount,
    deliveryFeeTaxAmount,
    deliveryFeeDiscount,
    totalAmount
  };
};
