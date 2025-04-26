
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EventType } from "@/types/supabase";

interface EventTypeFormProps {
  eventType: Partial<EventType>;
  onChange: (eventType: Partial<EventType>) => void;
}

export const EventTypeForm: React.FC<EventTypeFormProps> = ({ eventType, onChange }) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input
          id="name"
          value={eventType.name || ''}
          onChange={(e) => onChange({ ...eventType, name: e.target.value })}
          className="col-span-3"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Textarea
          id="description"
          value={eventType.description || ''}
          onChange={(e) => onChange({ ...eventType, description: e.target.value })}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="icon" className="text-right">Icon</Label>
        <Input
          id="icon"
          value={eventType.icon || ''}
          onChange={(e) => onChange({ ...eventType, icon: e.target.value })}
          className="col-span-3"
          placeholder="Icon name or URL"
        />
      </div>
    </>
  );
};
