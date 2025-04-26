
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
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-xl">
      <CardContent className="pt-6">
        <h2 className="text-3xl font-semibold mb-8 text-white text-center">What type of event are you catering for?</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {eventTypes.map((type) => (
            <div 
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`
                relative group overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105
                ${selectedEventTypeId === type.id 
                  ? 'bg-gradient-to-r from-catering-secondary to-catering-accent border-0' 
                  : 'bg-white/10 backdrop-blur-lg hover:bg-white/20'
                }
              `}
            >
              <div className="p-6 text-center cursor-pointer">
                <div className={`text-5xl mb-4 transition-transform duration-300 group-hover:scale-110 
                  ${selectedEventTypeId === type.id ? 'text-white' : 'text-catering-secondary'}`}>
                  {type.icon}
                </div>
                <h3 className={`font-medium text-lg tracking-wide
                  ${selectedEventTypeId === type.id ? 'text-white' : 'text-gray-100'}`}>
                  {type.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
