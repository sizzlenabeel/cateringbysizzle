// Refactored OrderFlow, now composes new components.

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { useOrderAddresses } from "@/hooks/useOrderAddresses";
import { useToast } from "@/components/ui/use-toast";
import { DeliveryOptions } from "@/components/order-flow/DeliveryOptions";
import { VeganToggle } from "@/components/order-flow/VeganToggle";
import { OrderCompanyInfoBox } from "@/components/order-flow/OrderCompanyInfoBox";
import { OrderTabsContent } from "@/components/order-flow/OrderTabsContent";
import { addDays } from "date-fns";
import { seedSampleMenuItems } from "@/services/adminService";

// Set default date to 48 hours in the future
const getDefaultDate = () => {
  const now = new Date();
  return addDays(now, 2);
};

const OrderFlow = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isVegan, setIsVegan] = useState(false);

  const [deliveryTime, setDeliveryTime] = useState("10:00");
  const [deliveryDate, setDeliveryDate] = useState<Date>(getDefaultDate());
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);

  // Address/Company logic centralized:
  const { 
    company, addresses, selectedAddress, setSelectedAddress, isLoadingAddresses, addAddress 
  } = useOrderAddresses(user?.id);

  const handleAddNewAddress = async () => {
    if (newAddress.trim() !== "") {
      const res = await addAddress(newAddress);
      if (res && res.error) {
        toast({
          title: "Error adding address",
          description: "Failed to save the new address.",
          variant: "destructive"
        });
      } else {
        setShowAddAddress(false);
        setNewAddress("");
      }
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
        {company && <OrderCompanyInfoBox company={company} />}
        <div className="min-h-screen bg-gray-50">
          <div className="sticky top-16 z-10 bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row justify-between">
                {isLoadingAddresses ? (
                  <div>Loading delivery options...</div>
                ) : (
                  <DeliveryOptions
                    deliveryTime={deliveryTime}
                    deliveryDate={deliveryDate}
                    selectedAddress={selectedAddress || { id: "loading", name: "Loading...", address: "Loading..." }}
                    addresses={addresses}
                    showAddAddress={showAddAddress}
                    newAddress={newAddress}
                    onTimeChange={setDeliveryTime}
                    onDateChange={setDeliveryDate}
                    onAddressSelect={setSelectedAddress}
                    onShowAddAddress={setShowAddAddress}
                    onNewAddressChange={setNewAddress}
                    onAddNewAddress={handleAddNewAddress}
                  />
                )}
                <div className="flex items-center mt-4 md:mt-0">
                  <VeganToggle
                    isVegan={isVegan}
                    onToggle={setIsVegan}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto py-8 px-4">
            <OrderTabsContent
              isSeeding={isSeeding}
              onSeedSampleData={handleSeedSampleData}
              isVegan={isVegan}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderFlow;
