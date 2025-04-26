
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

export const calculateOrderTaxes = (
  subtotal: number,
  discountCode?: {
    percentage: number;
    applies_to?: string[];
  }
): OrderTaxBreakdown => {
  const subtotalPreTax = subtotal;
  const productTaxAmount = subtotalPreTax * TAX_RATES.PRODUCT_TAX;
  
  // Calculate admin fee and its tax
  let adminFeeAmount = subtotalPreTax * TAX_RATES.ADMIN_FEE_PERCENTAGE;
  let adminFeeDiscount = 0;
  
  // Calculate delivery fee and its tax
  let deliveryFeeAmount = TAX_RATES.DELIVERY_FEE;
  let deliveryFeeDiscount = 0;

  // Apply discounts if applicable
  if (discountCode) {
    const discountPercentage = discountCode.percentage / 100;
    const appliesTo = discountCode.applies_to || ['products', 'admin_fee', 'delivery_fee'];

    if (appliesTo.includes('admin_fee')) {
      adminFeeDiscount = adminFeeAmount * discountPercentage;
      adminFeeAmount -= adminFeeDiscount;
    }

    if (appliesTo.includes('delivery_fee')) {
      deliveryFeeDiscount = deliveryFeeAmount * discountPercentage;
      deliveryFeeAmount -= deliveryFeeDiscount;
    }
  }

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
