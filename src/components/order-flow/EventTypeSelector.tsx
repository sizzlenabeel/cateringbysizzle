
import React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EventType } from "@/types/supabase";

interface EventTypeSelectorProps {
  eventTypes: EventType[];
  selectedEventTypeId?: string;
  isLoading: boolean;
  onSelect: (typeId: string) => void;
}

export const EventTypeSelector = ({ 
  eventTypes, 
  selectedEventTypeId, 
  isLoading, 
  onSelect 
}: EventTypeSelectorProps) => {
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
        <h2 className="text-2xl font-semibold mb-6">What type of event are you catering for?</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {eventTypes.map((type) => (
            <div 
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${selectedEventTypeId === type.id 
                  ? 'border-catering-secondary bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{type.icon}</div>
                <h3 className="font-medium">{type.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
