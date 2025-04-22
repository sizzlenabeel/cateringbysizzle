import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMenuData } from "@/hooks/useMenuData";
import { seedSampleMenuItems } from "@/services/adminService";
import Layout from "@/components/layout/Layout";
import { EventTypeSelector } from "@/components/order-flow/EventTypeSelector";
import { ServingStyleSelector } from "@/components/order-flow/ServingStyleSelector";
import { DeliveryOptions } from "@/components/order-flow/DeliveryOptions";
import { MenuItems } from "@/components/order-flow/MenuItems";
import { VeganToggle } from "@/components/order-flow/VeganToggle";

const addressOptions = [
  { id: "addr1", name: "Main Office", address: "123 Business St, Stockholm, 10044" },
  { id: "addr2", name: "Branch Office", address: "456 Corporate Ave, Stockholm, 10067" },
];

const OrderFlow = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState("event-type");
  const [deliveryTime, setDeliveryTime] = useState("10:00");
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(addressOptions[0]);
  const [newAddress, setNewAddress] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);
  const [company, setCompany] = useState<any>(null);

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

  useEffect(() => {
    const fetchCompany = async () => {
      if (!user?.id) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
        .single();
      if (profile?.company_id) {
        const { data: comp } = await supabase
          .from("companies")
          .select("*")
          .eq("id", profile.company_id)
          .single();
        setCompany(comp);
      }
    };
    fetchCompany();
  }, [user?.id]);

  const handleEventTypeSelect = (typeId: string) => {
    setEventType(typeId);
    setStep("serving-style");
  };

  const handleAddressSelect = (address: typeof addressOptions[0]) => {
    setSelectedAddress(address);
    setShowAddAddress(false);
  };

  const handleAddNewAddress = () => {
    if (newAddress.trim() !== "") {
      const newAddressObj = {
        id: `addr${addressOptions.length + 1}`,
        name: `New Address ${addressOptions.length + 1}`,
        address: newAddress
      };
      addressOptions.push(newAddressObj);
      setSelectedAddress(newAddressObj);
      setShowAddAddress(false);
      setNewAddress("");
    }
  };

  const handleSeedSampleData = async () => {
    setIsSeeding(true);
    try {
      const success = await seedSampleMenuItems();
      if (success) {
        toast({
          title: "Sample menus added",
          description: "Sample menu items have been added to the database",
          variant: "default"
        });
        await refetchMenuItems();
      } else {
        toast({
          title: "Error adding sample menus",
          description: "An error occurred while adding sample menu items",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error seeding sample data:", error);
      toast({
        title: "Error adding sample menus",
        description: "An error occurred while adding sample menu items",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        {company && (
          <div className="mb-8 bg-orange-50 border border-orange-200 rounded p-4 flex flex-col md:flex-row items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-orange-700">Company: {company.name}</div>
              <div className="text-sm text-gray-600">Org No: {company.organization_number}</div>
              <div className="text-sm text-gray-600">Address: {company.address}</div>
              {company.billing_email && (
                <div className="text-sm text-gray-600">Billing email: {company.billing_email}</div>
              )}
            </div>
          </div>
        )}
        <div className="min-h-screen bg-gray-50">
          <div className="sticky top-16 z-10 bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row justify-between">
                <DeliveryOptions
                  deliveryTime={deliveryTime}
                  deliveryDate={deliveryDate}
                  selectedAddress={selectedAddress}
                  addresses={addressOptions}
                  showAddAddress={showAddAddress}
                  newAddress={newAddress}
                  onTimeChange={setDeliveryTime}
                  onDateChange={setDeliveryDate}
                  onAddressSelect={handleAddressSelect}
                  onShowAddAddress={setShowAddAddress}
                  onNewAddressChange={setNewAddress}
                  onAddNewAddress={handleAddNewAddress}
                />
                <div className="flex items-center mt-4 md:mt-0">
                  <VeganToggle
                    isVegan={filters.isVegan === true}
                    onToggle={(checked) => setVeganOnly(checked ? true : undefined)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto py-8 px-4">
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
                    onSeedSampleData={handleSeedSampleData}
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
                    onSeedSampleData={handleSeedSampleData}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderFlow;
