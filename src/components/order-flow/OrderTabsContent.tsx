
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { EventTypeSelector } from "./EventTypeSelector";
import { ServingStyleSelector } from "./ServingStyleSelector";
import { MenuItems } from "./MenuItems";
import { VeganToggle } from "./VeganToggle";
import { useMenuData } from "@/hooks/useMenuData";

type Props = {
  isSeeding: boolean;
  onSeedSampleData: () => void;
};

export const OrderTabsContent = ({ isSeeding, onSeedSampleData }: Props) => {
  const [step, setStep] = useState<"event-type" | "serving-style">("event-type");
  const {
    eventTypes,
    servingStyles,
    menuItems,
    filters,
    setEventType,
    setServingStyle,
    setVeganOnly,
    isLoading,
    refetchMenuItems
  } = useMenuData();

  const handleEventTypeSelect = (typeId: string) => {
    setEventType(typeId);
    setStep("serving-style");
  };

  return (
    <Tabs value={step} onValueChange={setStep} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="event-type">1. Event Type</TabsTrigger>
        <TabsTrigger value="serving-style">2. Serving Style</TabsTrigger>
      </TabsList>
      
      <TabsContent value="event-type" className="space-y-8">
        <EventTypeSelector
          eventTypes={eventTypes}
          selectedEventTypeId={filters.eventTypeId}
          isLoading={isLoading}
          onSelect={handleEventTypeSelect}
        />
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Browse All Available Menus</h2>
          <MenuItems
            menuItems={menuItems}
            isLoading={isLoading}
            isSeeding={isSeeding}
            onSeedSampleData={onSeedSampleData}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="serving-style" className="space-y-8">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            className="flex items-center gap-1"
            onClick={() => setStep("event-type")}
          >
            <ChevronLeft className="h-4 w-4" /> 
            Back to Event Type
          </Button>
        </div>
        <ServingStyleSelector
          servingStyles={servingStyles}
          selectedServingStyleId={filters.servingStyleId}
          isLoading={isLoading}
          onSelect={setServingStyle}
        />
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Available Menus</h2>
          <MenuItems
            menuItems={menuItems}
            isLoading={isLoading}
            isSeeding={isSeeding}
            onSeedSampleData={onSeedSampleData}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};
