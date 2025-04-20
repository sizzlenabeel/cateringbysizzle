
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { MenuItem, SubProduct, EventType, ServingStyle } from "@/types/supabase";
import { PlusCircle, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const RelationshipsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("sub-products");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>("");
  const [selectedSubProductId, setSelectedSubProductId] = useState<string>("");
  const [selectedEventTypeId, setSelectedEventTypeId] = useState<string>("");
  const [selectedServingStyleId, setSelectedServingStyleId] = useState<string>("");
  const [isDefault, setIsDefault] = useState(false);

  // Fetch all menu items
  const { data: menuItems } = useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch all sub products
  const { data: subProducts } = useQuery({
    queryKey: ['admin-sub-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sub_products')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch all event types
  const { data: eventTypes } = useQuery({
    queryKey: ['admin-event-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_types')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch all serving styles
  const { data: servingStyles } = useQuery({
    queryKey: ['admin-serving-styles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('serving_styles')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch menu item relationships
  const { data: menuItemSubProducts, refetch: refetchSubProductRels } = useQuery({
    queryKey: ['admin-menu-item-sub-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_item_sub_products')
        .select(`
          id,
          is_default,
          menu_item_id,
          sub_product_id,
          menu_items (name),
          sub_products (name)
        `);
        
      if (error) throw error;
      return data;
    }
  });

  const { data: menuItemEventTypes, refetch: refetchEventTypeRels } = useQuery({
    queryKey: ['admin-menu-item-event-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_item_event_types')
        .select(`
          id,
          menu_item_id,
          event_type_id,
          menu_items (name),
          event_types (name)
        `);
        
      if (error) throw error;
      return data;
    }
  });

  const { data: menuItemServingStyles, refetch: refetchServingStyleRels } = useQuery({
    queryKey: ['admin-menu-item-serving-styles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_item_serving_styles')
        .select(`
          id,
          menu_item_id,
          serving_style_id,
          menu_items (name),
          serving_styles (name)
        `);
        
      if (error) throw error;
      return data;
    }
  });

  // Add menu item - sub product relationship
  const addSubProductRelMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('menu_item_sub_products')
        .insert({
          menu_item_id: selectedMenuItemId,
          sub_product_id: selectedSubProductId,
          is_default: isDefault
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetchSubProductRels();
      closeDialog();
      toast({
        title: "Success",
        description: "Relationship added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add relationship: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Add menu item - event type relationship
  const addEventTypeRelMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('menu_item_event_types')
        .insert({
          menu_item_id: selectedMenuItemId,
          event_type_id: selectedEventTypeId
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetchEventTypeRels();
      closeDialog();
      toast({
        title: "Success",
        description: "Relationship added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add relationship: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Add menu item - serving style relationship
  const addServingStyleRelMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('menu_item_serving_styles')
        .insert({
          menu_item_id: selectedMenuItemId,
          serving_style_id: selectedServingStyleId
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetchServingStyleRels();
      closeDialog();
      toast({
        title: "Success",
        description: "Relationship added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add relationship: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete relationship mutations
  const deleteSubProductRelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_item_sub_products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      refetchSubProductRels();
      toast({
        title: "Success",
        description: "Relationship removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to remove relationship: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteEventTypeRelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_item_event_types')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      refetchEventTypeRels();
      toast({
        title: "Success",
        description: "Relationship removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to remove relationship: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteServingStyleRelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_item_serving_styles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      refetchServingStyleRels();
      toast({
        title: "Success",
        description: "Relationship removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to remove relationship: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const openDialog = () => {
    setIsOpen(true);
    resetForm();
  };

  const closeDialog = () => {
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedMenuItemId("");
    setSelectedSubProductId("");
    setSelectedEventTypeId("");
    setSelectedServingStyleId("");
    setIsDefault(false);
  };

  const handleAddRelationship = () => {
    if (!selectedMenuItemId) {
      toast({
        title: "Validation Error",
        description: "Please select a menu item",
        variant: "destructive",
      });
      return;
    }

    if (selectedTab === "sub-products" && selectedSubProductId) {
      addSubProductRelMutation.mutate();
    } else if (selectedTab === "event-types" && selectedEventTypeId) {
      addEventTypeRelMutation.mutate();
    } else if (selectedTab === "serving-styles" && selectedServingStyleId) {
      addServingStyleRelMutation.mutate();
    } else {
      toast({
        title: "Validation Error",
        description: "Please make all required selections",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Relationship Management</h2>
        <Button onClick={openDialog}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Relationship
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="sub-products">Sub Products</TabsTrigger>
          <TabsTrigger value="event-types">Event Types</TabsTrigger>
          <TabsTrigger value="serving-styles">Serving Styles</TabsTrigger>
        </TabsList>

        <TabsContent value="sub-products">
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Menu Item</TableHead>
                  <TableHead>Sub Product</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItemSubProducts && menuItemSubProducts.length > 0 ? (
                  menuItemSubProducts.map((rel: any) => (
                    <TableRow key={rel.id}>
                      <TableCell>{rel.menu_items?.name}</TableCell>
                      <TableCell>{rel.sub_products?.name}</TableCell>
                      <TableCell>{rel.is_default ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteSubProductRelMutation.mutate(rel.id)}
                          disabled={deleteSubProductRelMutation.isPending}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No relationships found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="event-types">
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Menu Item</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItemEventTypes && menuItemEventTypes.length > 0 ? (
                  menuItemEventTypes.map((rel: any) => (
                    <TableRow key={rel.id}>
                      <TableCell>{rel.menu_items?.name}</TableCell>
                      <TableCell>{rel.event_types?.name}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteEventTypeRelMutation.mutate(rel.id)}
                          disabled={deleteEventTypeRelMutation.isPending}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">No relationships found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="serving-styles">
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Menu Item</TableHead>
                  <TableHead>Serving Style</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItemServingStyles && menuItemServingStyles.length > 0 ? (
                  menuItemServingStyles.map((rel: any) => (
                    <TableRow key={rel.id}>
                      <TableCell>{rel.menu_items?.name}</TableCell>
                      <TableCell>{rel.serving_styles?.name}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteServingStyleRelMutation.mutate(rel.id)}
                          disabled={deleteServingStyleRelMutation.isPending}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">No relationships found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Relationship Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Relationship</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="menu-item">Menu Item</Label>
              <Select
                value={selectedMenuItemId}
                onValueChange={setSelectedMenuItemId}
              >
                <SelectTrigger id="menu-item">
                  <SelectValue placeholder="Select a menu item" />
                </SelectTrigger>
                <SelectContent>
                  {menuItems?.map((item: MenuItem) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTab === "sub-products" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="sub-product">Sub Product</Label>
                  <Select
                    value={selectedSubProductId}
                    onValueChange={setSelectedSubProductId}
                  >
                    <SelectTrigger id="sub-product">
                      <SelectValue placeholder="Select a sub product" />
                    </SelectTrigger>
                    <SelectContent>
                      {subProducts?.map((product: SubProduct) => (
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
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is-default" className="text-sm font-normal">
                    Is Default Option
                  </Label>
                </div>
              </>
            )}

            {selectedTab === "event-types" && (
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select
                  value={selectedEventTypeId}
                  onValueChange={setSelectedEventTypeId}
                >
                  <SelectTrigger id="event-type">
                    <SelectValue placeholder="Select an event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes?.map((type: EventType) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedTab === "serving-styles" && (
              <div className="space-y-2">
                <Label htmlFor="serving-style">Serving Style</Label>
                <Select
                  value={selectedServingStyleId}
                  onValueChange={setSelectedServingStyleId}
                >
                  <SelectTrigger id="serving-style">
                    <SelectValue placeholder="Select a serving style" />
                  </SelectTrigger>
                  <SelectContent>
                    {servingStyles?.map((style: ServingStyle) => (
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
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleAddRelationship}>Add Relationship</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RelationshipsManager;
