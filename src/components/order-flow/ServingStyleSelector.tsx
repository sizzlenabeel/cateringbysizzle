
import React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {servingStyles.map((style) => (
            <div
              key={style.id}
              onClick={() => onSelect(style.id)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${selectedServingStyleId === style.id 
                  ? 'border-catering-secondary bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{style.icon || '🍽️'}</div>
                <h3 className="font-medium">{style.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
