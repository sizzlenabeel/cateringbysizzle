
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle, Trash } from "lucide-react";
import AddRelationshipDialog from "./AddRelationshipDialog";

const EventTypeRelationships = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [selectedEventTypeId, setSelectedEventTypeId] = useState("");

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

  const closeDialog = () => {
    setIsOpen(false);
    setSelectedMenuItemId("");
    setSelectedEventTypeId("");
  };

  const handleAddRelationship = () => {
    if (!selectedMenuItemId || !selectedEventTypeId) {
      toast({
        title: "Validation Error",
        description: "Please select both a menu item and an event type",
        variant: "destructive",
      });
      return;
    }
    addEventTypeRelMutation.mutate();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Relationship
        </Button>
      </div>

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

      <AddRelationshipDialog
        isOpen={isOpen}
        onClose={closeDialog}
        onAdd={handleAddRelationship}
        type="event-types"
        menuItems={menuItems || []}
        selectedMenuItemId={selectedMenuItemId}
        onMenuItemSelect={setSelectedMenuItemId}
        eventTypes={eventTypes}
        selectedEventTypeId={selectedEventTypeId}
        onEventTypeSelect={setSelectedEventTypeId}
      />
    </div>
  );
};

export default EventTypeRelationships;
