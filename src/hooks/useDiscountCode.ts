
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDiscountCode = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountInfo, setDiscountInfo] = useState<{
    percentage: number;
    applies_to?: string[];
  } | null>(null);
  const { toast } = useToast();

  const validateDiscountCode = async (code: string) => {
    if (!code) return;
    
    setIsValidating(true);
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .lte('valid_from', new Date().toISOString())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setDiscountCode(code);
        setDiscountInfo({
          percentage: data.percentage,
          applies_to: data.discount_applies_to
        });
        toast({
          title: "Discount applied",
          description: `${data.percentage}% discount has been applied to your order.`
        });
      } else {
        setDiscountCode(null);
        setDiscountInfo(null);
        toast({
          title: "Invalid discount code",
          description: "This discount code is invalid or has expired.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error validating discount code:', err);
      toast({
        title: "Error",
        description: "Failed to validate discount code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const clearDiscount = () => {
    setDiscountCode(null);
    setDiscountInfo(null);
  };

  return {
    discountCode,
    discountInfo,
    isValidating,
    validateDiscountCode,
    clearDiscount
  };
};
