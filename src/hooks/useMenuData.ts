
import { useQuery } from "@tanstack/react-query";
import { fetchEventTypes, fetchMenuItems, fetchServingStyles } from "@/services/menuService";
import { useState } from "react";
import { EventType, MenuItemWithRelations, ServingStyle } from "@/types/supabase";

export function useMenuData() {
  const [filters, setFilters] = useState<{
    eventTypeId?: string;
    servingStyleId?: string;
    isVegan?: boolean;
  }>({});
  
  // Fetch event types
  const { 
    data: eventTypes = [], 
    isLoading: isLoadingEventTypes 
  } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: fetchEventTypes
  });
  
  // Fetch serving styles
  const { 
    data: servingStyles = [], 
    isLoading: isLoadingServingStyles 
  } = useQuery({
    queryKey: ['servingStyles'],
    queryFn: fetchServingStyles
  });
  
  // Fetch menu items with filters
  const { 
    data: menuItems = [], 
    isLoading: isLoadingMenuItems,
    refetch: refetchMenuItems,
  } = useQuery({
    queryKey: ['menuItems', filters],
    queryFn: () => fetchMenuItems(filters)
  });
  
  // Methods to update filters
  const setEventType = (eventTypeId?: string) => {
    setFilters(prev => ({ ...prev, eventTypeId }));
  };
  
  const setServingStyle = (servingStyleId?: string) => {
    setFilters(prev => ({ ...prev, servingStyleId }));
  };
  
  const setVeganOnly = (isVegan?: boolean) => {
    setFilters(prev => ({ ...prev, isVegan }));
  };
  
  return {
    eventTypes,
    servingStyles,
    menuItems,
    isLoading: isLoadingEventTypes || isLoadingServingStyles || isLoadingMenuItems,
    filters,
    setEventType,
    setServingStyle,
    setVeganOnly,
    refetchMenuItems
  };
}
