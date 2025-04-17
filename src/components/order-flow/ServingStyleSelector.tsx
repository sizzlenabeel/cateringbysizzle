
import React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ServingStyle } from "@/types/supabase";

interface ServingStyleSelectorProps {
  servingStyles: ServingStyle[];
  selectedServingStyleId?: string;
  isLoading: boolean;
  onSelect: (styleId: string) => void;
}

export const ServingStyleSelector = ({
  servingStyles,
  selectedServingStyleId,
  isLoading,
  onSelect
}: ServingStyleSelectorProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-catering-secondary" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-6">How would you like your food served?</h2>
        <RadioGroup 
          value={selectedServingStyleId} 
          onValueChange={onSelect}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {servingStyles.map((style) => (
            <div key={style.id} className="flex items-center space-x-2">
              <RadioGroupItem value={style.id} id={style.id} />
              <Label htmlFor={style.id} className="text-base cursor-pointer">{style.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
