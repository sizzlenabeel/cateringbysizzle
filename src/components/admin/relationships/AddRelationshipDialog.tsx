
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MenuItem, SubProduct, EventType, ServingStyle } from "@/types/supabase";

interface AddRelationshipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  type: "sub-products" | "event-types" | "serving-styles";
  menuItems: MenuItem[];
  selectedMenuItemId: string;
  onMenuItemSelect: (value: string) => void;
  subProducts?: SubProduct[];
  eventTypes?: EventType[];
  servingStyles?: ServingStyle[];
  selectedSubProductId?: string;
  selectedEventTypeId?: string;
  selectedServingStyleId?: string;
  onSubProductSelect?: (value: string) => void;
  onEventTypeSelect?: (value: string) => void;
  onServingStyleSelect?: (value: string) => void;
  isDefault?: boolean;
  onIsDefaultChange?: (value: boolean) => void;
}

const AddRelationshipDialog = ({
  isOpen,
  onClose,
  onAdd,
  type,
  menuItems,
  selectedMenuItemId,
  onMenuItemSelect,
  subProducts,
  eventTypes,
  servingStyles,
  selectedSubProductId,
  selectedEventTypeId,
  selectedServingStyleId,
  onSubProductSelect,
  onEventTypeSelect,
  onServingStyleSelect,
  isDefault,
  onIsDefaultChange,
}: AddRelationshipDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Relationship</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="menu-item">Menu Item</Label>
            <Select value={selectedMenuItemId} onValueChange={onMenuItemSelect}>
              <SelectTrigger id="menu-item">
                <SelectValue placeholder="Select a menu item" />
              </SelectTrigger>
              <SelectContent>
                {menuItems?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type === "sub-products" && subProducts && onSubProductSelect && (
            <>
              <div className="space-y-2">
                <Label htmlFor="sub-product">Sub Product</Label>
                <Select value={selectedSubProductId} onValueChange={onSubProductSelect}>
                  <SelectTrigger id="sub-product">
                    <SelectValue placeholder="Select a sub product" />
                  </SelectTrigger>
                  <SelectContent>
                    {subProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-default"
                  checked={isDefault}
                  onChange={(e) => onIsDefaultChange?.(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="is-default" className="text-sm font-normal">
                  Is Default Option
                </Label>
              </div>
            </>
          )}

          {type === "event-types" && eventTypes && onEventTypeSelect && (
            <div className="space-y-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select value={selectedEventTypeId} onValueChange={onEventTypeSelect}>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Select an event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {type === "serving-styles" && servingStyles && onServingStyleSelect && (
            <div className="space-y-2">
              <Label htmlFor="serving-style">Serving Style</Label>
              <Select value={selectedServingStyleId} onValueChange={onServingStyleSelect}>
                <SelectTrigger id="serving-style">
                  <SelectValue placeholder="Select a serving style" />
                </SelectTrigger>
                <SelectContent>
                  {servingStyles.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onAdd}>Add Relationship</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRelationshipDialog;
