import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Check, Plus, Minus } from "lucide-react";
import { menuItems, MenuItem, SubProduct, eventTypes } from "@/data/menuData";

const MenuCustomization = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const menuItem = menuItems.find(item => item.id === id);

  const [customizedMenu, setCustomizedMenu] = useState<{
    menu: MenuItem | null,
    selectedSubProducts: string[],
    totalPrice: number,
  }>({
    menu: null,
    selectedSubProducts: [],
    totalPrice: 0,
  });

  useEffect(() => {
    if (menuItem) {
      const defaultSelectedSubProducts = menuItem.subProducts
        .filter(subProduct => subProduct.isDefault)
        .map(subProduct => subProduct.id);
      
      setCustomizedMenu({
        menu: menuItem,
        selectedSubProducts: defaultSelectedSubProducts,
        totalPrice: calculateTotalPrice(menuItem, defaultSelectedSubProducts),
      });
    }
  }, [menuItem]);

  const calculateTotalPrice = (menu: MenuItem, selectedIds: string[]): number => {
    const basePrice = menu.basePrice;
    
    const defaultSubProducts = menu.subProducts.filter(sp => sp.isDefault);
    const defaultIds = defaultSubProducts.map(sp => sp.id);
    
    let priceAdjustment = 0;
    
    selectedIds.forEach(id => {
      if (!defaultIds.includes(id)) {
        const subProduct = menu.subProducts.find(sp => sp.id === id);
        if (subProduct) {
          priceAdjustment += subProduct.price;
        }
      }
    });
    
    defaultIds.forEach(id => {
      if (!selectedIds.includes(id)) {
        const subProduct = menu.subProducts.find(sp => sp.id === id);
        if (subProduct) {
          priceAdjustment -= subProduct.price;
        }
      }
    });
    
    return basePrice + priceAdjustment;
  };

  const toggleSubProduct = (subProductId: string) => {
    if (!customizedMenu.menu) return;
    
    const newSelectedSubProducts = customizedMenu.selectedSubProducts.includes(subProductId)
      ? customizedMenu.selectedSubProducts.filter(id => id !== subProductId)
      : [...customizedMenu.selectedSubProducts, subProductId];
    
    setCustomizedMenu({
      ...customizedMenu,
      selectedSubProducts: newSelectedSubProducts,
      totalPrice: calculateTotalPrice(customizedMenu.menu, newSelectedSubProducts)
    });
  };

  const handleAddToCart = () => {
    toast({
      title: "Menu added to order",
      description: "Your customized menu has been added to your order.",
    });
    navigate("/order");
  };

  if (!customizedMenu.menu) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <p>Menu not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col space-y-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/order")}
              className="flex items-center gap-1 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Menu Selection
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 overflow-hidden rounded-lg">
              <img 
                src={customizedMenu.menu.image} 
                alt={customizedMenu.menu.name}
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{customizedMenu.menu.name}</h1>
                <p className="text-gray-600 mb-4">{customizedMenu.menu.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {customizedMenu.menu.eventTypes.map(eventType => (
                    <span key={eventType} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {eventTypes.find(et => et.id === eventType)?.label || eventType}
                    </span>
                  ))}
                  {customizedMenu.menu.isVegan && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Vegan
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-lg font-medium">Total Price:</span>
                  <span className="text-2xl font-bold text-purple-700">
                    ${customizedMenu.totalPrice.toFixed(2)}
                    <span className="text-sm text-gray-500 ml-1">per person</span>
                  </span>
                </div>
                <Button 
                  className="w-full mt-2 bg-orange-600 hover:bg-orange-500"
                  onClick={handleAddToCart}
                >
                  Add to Order
                </Button>
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Customize Your Menu</h2>
              <p className="text-gray-600 mb-6">
                Select or deselect items to customize your menu. The price will update automatically.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-3">Included Items</h3>
                  <div className="space-y-3">
                    {customizedMenu.menu.subProducts
                      .filter(subProduct => subProduct.isDefault)
                      .map(subProduct => (
                        <SubProductItem 
                          key={subProduct.id}
                          subProduct={subProduct}
                          isSelected={customizedMenu.selectedSubProducts.includes(subProduct.id)}
                          onToggle={toggleSubProduct}
                        />
                      ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-3">Optional Add-ons</h3>
                  <div className="space-y-3">
                    {customizedMenu.menu.subProducts
                      .filter(subProduct => !subProduct.isDefault)
                      .map(subProduct => (
                        <SubProductItem 
                          key={subProduct.id}
                          subProduct={subProduct}
                          isSelected={customizedMenu.selectedSubProducts.includes(subProduct.id)}
                          onToggle={toggleSubProduct}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

type SubProductItemProps = {
  subProduct: SubProduct;
  isSelected: boolean;
  onToggle: (id: string) => void;
};

const SubProductItem = ({ subProduct, isSelected, onToggle }: SubProductItemProps) => {
  return (
    <div className={`
      flex items-center justify-between p-3 rounded-lg border 
      ${isSelected ? 'border-purple-400 bg-purple-50' : 'border-gray-200'}
      transition-all hover:border-purple-300
    `}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Checkbox 
            checked={isSelected} 
            id={`checkbox-${subProduct.id}`}
            onCheckedChange={() => onToggle(subProduct.id)}
          />
        </div>
        <div>
          <label 
            htmlFor={`checkbox-${subProduct.id}`}
            className="font-medium cursor-pointer flex items-center"
          >
            {subProduct.name}
            {subProduct.isVegan && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                Vegan
              </span>
            )}
          </label>
          <p className="text-sm text-gray-600">{subProduct.description}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="font-medium text-purple-700">${subProduct.price.toFixed(2)}</span>
        {isSelected ? (
          <button 
            onClick={() => onToggle(subProduct.id)}
            className="ml-3 p-1 text-red-500 hover:bg-red-50 rounded"
            aria-label="Remove item"
          >
            <Minus className="h-4 w-4" />
          </button>
        ) : (
          <button 
            onClick={() => onToggle(subProduct.id)}
            className="ml-3 p-1 text-green-500 hover:bg-green-50 rounded"
            aria-label="Add item"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuCustomization;
