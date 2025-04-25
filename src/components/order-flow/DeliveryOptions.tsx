import React from "react";
import { Clock, CalendarIcon, MapPin, Plus } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
interface Address {
  id: string;
  name: string;
  address: string;
}
interface DeliveryOptionsProps {
  deliveryTime: string;
  deliveryDate: Date;
  selectedAddress: Address;
  addresses: Address[];
  showAddAddress: boolean;
  newAddress: string;
  onTimeChange: (time: string) => void;
  onDateChange: (date: Date) => void;
  onAddressSelect: (address: Address) => void;
  onShowAddAddress: (show: boolean) => void;
  onNewAddressChange: (address: string) => void;
  onAddNewAddress: () => void;
}
export const DeliveryOptions = ({
  deliveryTime,
  deliveryDate,
  selectedAddress,
  addresses,
  showAddAddress,
  newAddress,
  onTimeChange,
  onDateChange,
  onAddressSelect,
  onShowAddAddress,
  onNewAddressChange,
  onAddNewAddress
}: DeliveryOptionsProps) => {
  return <div className="flex flex-wrap gap-4 md:gap-6">
      <div className="flex items-center text-sm">
        <Clock className="h-4 w-4 mr-2 text-catering-secondary bg-slate-50" />
        <Input type="time" value={deliveryTime} onChange={e => onTimeChange(e.target.value)} className="w-32 h-8 text-sm" />
      </div>
      
      <div className="flex items-center text-sm">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("h-8 text-sm flex items-center gap-2 font-normal")}>
              <CalendarIcon className="h-4 w-4 text-catering-secondary" />
              <span>{format(deliveryDate, "PPP")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={deliveryDate} onSelect={date => date && onDateChange(date)} initialFocus className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex items-center text-sm relative">
        <Popover open={showAddAddress} onOpenChange={onShowAddAddress}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 text-sm flex items-center gap-2 font-normal">
              <MapPin className="h-4 w-4 text-catering-secondary" />
              <span className="truncate max-w-[180px]">{selectedAddress.address}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <div className="p-4 space-y-4">
              <h4 className="font-medium">Select Address</h4>
              <div className="space-y-2">
                {addresses.map(addr => <button key={addr.id} onClick={() => onAddressSelect(addr)} className={`w-full text-left p-2 rounded-md text-sm ${selectedAddress.id === addr.id ? "bg-purple-50 border border-catering-secondary" : "hover:bg-gray-50"}`}>
                    <div className="font-medium">{addr.name}</div>
                    <div className="text-gray-600 text-xs">{addr.address}</div>
                  </button>)}
              </div>
              <div className="pt-2 border-t">
                <div className="flex flex-col gap-2">
                  <Input placeholder="Enter a new address" value={newAddress} onChange={e => onNewAddressChange(e.target.value)} />
                  <Button onClick={onAddNewAddress} className="w-full flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Add New Address
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>;
};