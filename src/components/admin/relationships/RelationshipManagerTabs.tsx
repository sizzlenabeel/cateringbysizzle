
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubProductRelationships from "./SubProductRelationships";
import EventTypeRelationships from "./EventTypeRelationships";
import ServingStyleRelationships from "./ServingStyleRelationships";

const RelationshipManagerTabs = () => {
  const [selectedTab, setSelectedTab] = useState("sub-products");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Relationship Management</h2>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="sub-products">Sub Products</TabsTrigger>
          <TabsTrigger value="event-types">Event Types</TabsTrigger>
          <TabsTrigger value="serving-styles">Serving Styles</TabsTrigger>
        </TabsList>

        <TabsContent value="sub-products">
          <SubProductRelationships />
        </TabsContent>
        
        <TabsContent value="event-types">
          <EventTypeRelationships />
        </TabsContent>
        
        <TabsContent value="serving-styles">
          <ServingStyleRelationships />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelationshipManagerTabs;
