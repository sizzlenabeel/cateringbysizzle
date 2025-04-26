
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
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-xl">
      <CardContent className="pt-6">
        <h2 className="text-3xl font-semibold mb-8 text-white text-center">How would you like your food served?</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {servingStyles.map((style) => (
            <div
              key={style.id}
              onClick={() => onSelect(style.id)}
              className={`
                relative group overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105
                ${selectedServingStyleId === style.id 
                  ? 'bg-gradient-to-r from-catering-secondary to-catering-accent border-0' 
                  : 'bg-white/10 backdrop-blur-lg hover:bg-white/20'
                }
              `}
            >
              <div className="p-6 text-center cursor-pointer">
                <div className={`text-5xl mb-4 transition-transform duration-300 group-hover:scale-110 
                  ${selectedServingStyleId === style.id ? 'text-white' : 'text-catering-secondary'}`}>
                  {style.icon || '🍽️'}
                </div>
                <h3 className={`font-medium text-lg tracking-wide
                  ${selectedServingStyleId === style.id ? 'text-white' : 'text-gray-100'}`}>
                  {style.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
