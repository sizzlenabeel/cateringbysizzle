
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, MapPin } from "lucide-react";

// Event type options
const eventTypes = [
  { id: "breakfast", label: "Breakfast", icon: "☕" },
  { id: "lunch", label: "Lunch", icon: "🍲" },
  { id: "dinner", label: "Dinner", icon: "🍽️" },
  { id: "mingle", label: "Mingle", icon: "🥂" },
  { id: "fika", label: "Fika", icon: "🧁" },
];

// Serving style options
const servingStyles = [
  { id: "buffet", label: "Buffet Spread" },
  { id: "individual", label: "Individual Portions" },
];

// Sample menu data with sub-products
const menuItems = [
  {
    id: "menu1",
    name: "Continental Breakfast",
    description: "A light breakfast spread with pastries and fruits",
    price: "$15 per person",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3",
    eventType: "breakfast",
    isVegan: false,
    subProducts: [
      { id: "sub1", name: "Croissants", isVegan: false },
      { id: "sub2", name: "Fresh Fruit Platter", isVegan: true },
      { id: "sub3", name: "Yogurt Parfait", isVegan: false },
      { id: "sub4", name: "Coffee & Tea", isVegan: true },
    ]
  },
  {
    id: "menu2",
    name: "Vegan Breakfast Bowl",
    description: "Nutrient-packed breakfast with grains and fresh produce",
    price: "$18 per person",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3",
    eventType: "breakfast",
    isVegan: true,
    subProducts: [
      { id: "sub5", name: "Overnight Oats", isVegan: true },
      { id: "sub6", name: "Chia Pudding", isVegan: true },
      { id: "sub7", name: "Fresh Berries", isVegan: true },
      { id: "sub8", name: "Plant Milk Options", isVegan: true },
    ]
  },
  {
    id: "menu3",
    name: "Executive Lunch Box",
    description: "Complete boxed lunch for business meetings",
    price: "$22 per person",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3",
    eventType: "lunch",
    isVegan: false,
    subProducts: [
      { id: "sub9", name: "Gourmet Sandwich", isVegan: false },
      { id: "sub10", name: "Garden Salad", isVegan: true },
      { id: "sub11", name: "Artisan Chips", isVegan: true },
      { id: "sub12", name: "Chocolate Chip Cookie", isVegan: false },
    ]
  },
  {
    id: "menu4",
    name: "Vegan Lunch Box",
    description: "Plant-based lunch option with fresh ingredients",
    price: "$24 per person",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3",
    eventType: "lunch",
    isVegan: true,
    subProducts: [
      { id: "sub13", name: "Hummus Wrap", isVegan: true },
      { id: "sub14", name: "Quinoa Salad", isVegan: true },
      { id: "sub15", name: "Vegetable Crisps", isVegan: true },
      { id: "sub16", name: "Vegan Brownie", isVegan: true },
    ]
  },
  {
    id: "menu5",
    name: "Afternoon Fika Basket",
    description: "Swedish-inspired coffee break treats",
    price: "$12 per person",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3",
    eventType: "fika",
    isVegan: false,
    subProducts: [
      { id: "sub17", name: "Cinnamon Buns", isVegan: false },
      { id: "sub18", name: "Almond Cookies", isVegan: false },
      { id: "sub19", name: "Fresh Berries", isVegan: true },
      { id: "sub20", name: "Coffee Service", isVegan: true },
    ]
  },
  {
    id: "menu6",
    name: "Evening Mingle Platter",
    description: "Selection of finger foods for networking events",
    price: "$28 per person",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3",
    eventType: "mingle",
    isVegan: false,
    subProducts: [
      { id: "sub21", name: "Cheese Selection", isVegan: false },
      { id: "sub22", name: "Charcuterie", isVegan: false },
      { id: "sub23", name: "Artisan Crackers", isVegan: true },
      { id: "sub24", name: "Marinated Olives", isVegan: true },
    ]
  },
  {
    id: "menu7",
    name: "Elegant Dinner Buffet",
    description: "Full dinner service with multiple courses",
    price: "$45 per person",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3",
    eventType: "dinner",
    isVegan: false,
    subProducts: [
      { id: "sub25", name: "Roast Beef Tenderloin", isVegan: false },
      { id: "sub26", name: "Garlic Mashed Potatoes", isVegan: false },
      { id: "sub27", name: "Seasonal Vegetables", isVegan: true },
      { id: "sub28", name: "Artisan Dinner Rolls", isVegan: false },
    ]
  },
];

// This is a placeholder for the order flow implementation
// It will be fully functional once we connect to Supabase
const OrderFlow = () => {
  const { toast } = useToast();
  const [step, setStep] = useState("event-type");
  const [eventType, setEventType] = useState("");
  const [servingStyle, setServingStyle] = useState("");
  const [showVeganOnly, setShowVeganOnly] = useState(false);
  const [filteredMenus, setFilteredMenus] = useState(menuItems);

  // Placeholder company data (will come from auth/database)
  const companyDetails = {
    name: "Acme Corp",
    address: "123 Business St, Stockholm, 10044",
    contact: "info@acmecorp.com"
  };

  // Filter menus based on selections
  useEffect(() => {
    let filtered = menuItems;
    
    if (eventType) {
      filtered = filtered.filter(item => item.eventType === eventType);
    }
    
    if (showVeganOnly) {
      filtered = filtered.filter(item => item.isVegan);
    }
    
    setFilteredMenus(filtered);
  }, [eventType, showVeganOnly]);

  // Show protected route notice (temp until auth is implemented)
  useEffect(() => {
    toast({
      title: "Protected Route",
      description: "This page will require authentication once Supabase is connected.",
    });
  }, [toast]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar - Fixed throughout the order process */}
        <div className="sticky top-16 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex flex-wrap gap-4 md:gap-6">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-catering-secondary" />
                  <span>Delivery: 10:00 AM</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-catering-secondary" />
                  <span>Date: May 1, 2025</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-catering-secondary" />
                  <span>{companyDetails.address}</span>
                </div>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="vegan-mode" 
                    checked={showVeganOnly}
                    onCheckedChange={setShowVeganOnly}
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
              <TabsTrigger value="event-type" disabled={step !== "event-type"}>
                1. Event Type
              </TabsTrigger>
              <TabsTrigger 
                value="serving-style" 
                disabled={!eventType || step === "event-type"}
              >
                2. Serving Style
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="event-type" className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">What type of event are you catering for?</h2>
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
                          ${eventType === type.id 
                            ? 'border-catering-secondary bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">{type.icon}</div>
                          <h3 className="font-medium">{type.label}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="serving-style" className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">How would you like your food served?</h2>
                  <RadioGroup 
                    value={servingStyle} 
                    onValueChange={setServingStyle}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {servingStyles.map((style) => (
                      <div key={style.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={style.id} id={style.id} />
                        <Label htmlFor={style.id} className="text-base cursor-pointer">{style.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-6">Available Menus</h2>
                
                {filteredMenus.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No menus match your current selection. Please try different options.
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMenus.map((menu) => (
                    <Card key={menu.id} className="overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={menu.image} 
                          alt={menu.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium">{menu.name}</h3>
                          {menu.isVegan && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Vegan
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{menu.description}</p>
                        <p className="font-medium text-catering-secondary mb-4">{menu.price}</p>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Includes:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {menu.subProducts.map((subProduct) => (
                              <li key={subProduct.id} className="flex items-center">
                                <span>{subProduct.name}</span>
                                {subProduct.isVegan && (
                                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">V</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Button className="w-full bg-orange-600 hover:bg-orange-500">
                          Select Menu
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default OrderFlow;

