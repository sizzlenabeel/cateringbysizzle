
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DiscountCodeInputProps {
  onApplyDiscount: (code: string) => Promise<void>;
  isValidating: boolean;
  discountCode: string | null;
  onClear: () => void;
}

export const DiscountCodeInput = ({
  onApplyDiscount,
  isValidating,
  discountCode,
  onClear
}: DiscountCodeInputProps) => {
  const [inputCode, setInputCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode) {
      onApplyDiscount(inputCode);
    }
  };

  if (discountCode) {
    return (
      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
        <span className="text-sm text-green-700">Code applied: {discountCode}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onClear();
            setInputCode('');
          }}
        >
          Remove
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter discount code"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={isValidating || !inputCode}
        variant="secondary"
      >
        {isValidating ? 'Validating...' : 'Apply'}
      </Button>
    </form>
  );
};
