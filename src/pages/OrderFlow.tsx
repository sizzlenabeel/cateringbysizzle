
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Clock, Calendar as CalendarIcon, MapPin, Plus, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMenuData } from "@/hooks/useMenuData";
import { EventType, MenuItemWithRelations, ServingStyle } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { seedSampleMenuItems } from "@/services/adminService";

// Sample addresses data (will come from database later)
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

  // Handle address selection
  const handleAddressSelect = (address: typeof addressOptions[0]) => {
    setSelectedAddress(address);
    setShowAddAddress(false);
  };

  // Handle new address addition
  const handleAddNewAddress = () => {
    if (newAddress.trim() !== "") {
      const newAddressObj = {
        id: `addr${addressOptions.length + 1}`,
        name: `New Address ${addressOptions.length + 1}`,
        address: newAddress
      };
      // In reality, this would be saved to the database
      addressOptions.push(newAddressObj);
      setSelectedAddress(newAddressObj);
      setShowAddAddress(false);
      setNewAddress("");
    }
  };

  // Handle seeding sample data
  const handleSeedSampleData = async () => {
    setIsSeeding(true);
    try {
      const success = await seedSampleMenuItems();
      if (success) {
        toast({
          title: "Sample menus added",
          description: "Sample menu items have been added to the database",
          variant: "success"
        });
        // Refresh menu items
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

  const renderMenuItems = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-catering-secondary" />
          <span className="ml-2 text-lg">Loading menus...</span>
        </div>
      );
    }

    if (menuItems.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-6">
            No menus match your current selection. Please try different options or add sample menu items.
          </p>
          <Button 
            onClick={handleSeedSampleData} 
            className="bg-catering-secondary"
            disabled={isSeeding}
          >
            {isSeeding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Adding Sample Menus...
              </>
            ) : (
              <>Add Sample Menu Items</>
            )}
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((menu) => (
          <Card key={menu.id} className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src={menu.image_url || "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666"} 
                alt={menu.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">{menu.name}</h3>
                {menu.is_vegan && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Vegan
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{menu.description}</p>
              <p className="font-medium text-catering-secondary mb-4">${Number(menu.base_price).toFixed(2)} per person</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {menu.sub_products
                    .filter(subProduct => subProduct.is_default)
                    .slice(0, 3)
                    .map((subProduct) => (
                      <li key={subProduct.id} className="flex items-center">
                        <span>{subProduct.name}</span>
                        {subProduct.is_vegan && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">V</span>
                        )}
                      </li>
                    ))}
                  {menu.sub_products.filter(sp => sp.is_default).length > 3 && (
                    <li className="text-catering-secondary">+ more items</li>
                  )}
                </ul>
              </div>
              
              <Link to={`/menu/${menu.id}`}>
                <Button className="w-full bg-orange-600 hover:bg-orange-500">
                  Customize Menu
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar - Fixed throughout the order process */}
        <div className="sticky top-16 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex flex-wrap gap-4 md:gap-6">
                {/* Delivery Time Selector */}
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-catering-secondary" />
                  <Input
                    type="time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-32 h-8 text-sm"
                  />
                </div>
                
                {/* Delivery Date Selector */}
                <div className="flex items-center text-sm">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-8 text-sm flex items-center gap-2 font-normal",
                        )}
                      >
                        <CalendarIcon className="h-4 w-4 text-catering-secondary" />
                        <span>{format(deliveryDate, "PPP")}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={(date) => date && setDeliveryDate(date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Address Selector */}
                <div className="flex items-center text-sm relative">
                  <Popover open={showAddAddress} onOpenChange={setShowAddAddress}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-8 text-sm flex items-center gap-2 font-normal"
                      >
                        <MapPin className="h-4 w-4 text-catering-secondary" />
                        <span className="truncate max-w-[180px]">{selectedAddress.address}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <div className="p-4 space-y-4">
                        <h4 className="font-medium">Select Address</h4>
                        <div className="space-y-2">
                          {addressOptions.map((addr) => (
                            <button
                              key={addr.id}
                              onClick={() => handleAddressSelect(addr)}
                              className={`w-full text-left p-2 rounded-md text-sm ${
                                selectedAddress.id === addr.id 
                                  ? "bg-purple-50 border border-catering-secondary" 
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div className="font-medium">{addr.name}</div>
                              <div className="text-gray-600 text-xs">{addr.address}</div>
                            </button>
                          ))}
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex flex-col gap-2">
                            <Input
                              placeholder="Enter a new address"
                              value={newAddress}
                              onChange={(e) => setNewAddress(e.target.value)}
                            />
                            <Button 
                              onClick={handleAddNewAddress}
                              className="w-full flex items-center gap-1"
                            >
                              <Plus className="h-4 w-4" />
                              Add New Address
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="vegan-mode" 
                    checked={filters.isVegan === true}
                    onCheckedChange={(checked) => setVeganOnly(checked ? true : undefined)}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <Label htmlFor="vegan-mode" className="text-sm font-medium">
                    Vegan Options Only
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Flow Content */}
        <div className="container mx-auto py-8 px-4">
          <Tabs value={step} onValueChange={setStep} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="event-type">
                1. Event Type
              </TabsTrigger>
              <TabsTrigger value="serving-style">
                2. Serving Style
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="event-type" className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">What type of event are you catering for?</h2>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-catering-secondary" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {eventTypes.map((type) => (
                        <div 
                          key={type.id}
                          onClick={() => {
                            setEventType(type.id);
                            setStep("serving-style");
                          }}
                          className={`
                            p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${filters.eventTypeId === type.id 
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
                  )}
                </CardContent>
              </Card>

              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-6">Browse All Available Menus</h2>
                {renderMenuItems()}
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
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">How would you like your food served?</h2>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-catering-secondary" />
                    </div>
                  ) : (
                    <RadioGroup 
                      value={filters.servingStyleId} 
                      onValueChange={setServingStyle}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {servingStyles.map((style) => (
                        <div key={style.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={style.id} id={style.id} />
                          <Label htmlFor={style.id} className="text-base cursor-pointer">{style.name}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </CardContent>
              </Card>

              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-6">Available Menus</h2>
                {renderMenuItems()}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default OrderFlow;
