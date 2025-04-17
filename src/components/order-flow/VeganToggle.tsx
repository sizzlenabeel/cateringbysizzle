
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface VeganToggleProps {
  isVegan: boolean;
  onToggle: (checked: boolean) => void;
}

export const VeganToggle = ({ isVegan, onToggle }: VeganToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="vegan-mode" 
        checked={isVegan}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-green-600"
      />
      <Label htmlFor="vegan-mode" className="text-sm font-medium">
        Vegan Options Only
      </Label>
    </div>
  );
};
