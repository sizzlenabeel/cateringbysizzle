
import React from "react";
import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MenuItemWithRelations } from "@/types/supabase";

interface MenuItemsProps {
  menuItems: MenuItemWithRelations[];
  isLoading: boolean;
  isSeeding: boolean;
  onSeedSampleData: () => void;
}

export const MenuItems = ({
  menuItems,
  isLoading,
  isSeeding,
  onSeedSampleData
}: MenuItemsProps) => {
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
          onClick={onSeedSampleData} 
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
