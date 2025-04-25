
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle, Trash } from "lucide-react";
import AddRelationshipDialog from "./AddRelationshipDialog";

const ServingStyleRelationships = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [selectedServingStyleId, setSelectedServingStyleId] = useState("");

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

  const closeDialog = () => {
    setIsOpen(false);
    setSelectedMenuItemId("");
    setSelectedServingStyleId("");
  };

  const handleAddRelationship = () => {
    if (!selectedMenuItemId || !selectedServingStyleId) {
      toast({
        title: "Validation Error",
        description: "Please select both a menu item and a serving style",
        variant: "destructive",
      });
      return;
    }
    addServingStyleRelMutation.mutate();
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

      <AddRelationshipDialog
        isOpen={isOpen}
        onClose={closeDialog}
        onAdd={handleAddRelationship}
        type="serving-styles"
        menuItems={menuItems || []}
        selectedMenuItemId={selectedMenuItemId}
        onMenuItemSelect={setSelectedMenuItemId}
        servingStyles={servingStyles}
        selectedServingStyleId={selectedServingStyleId}
        onServingStyleSelect={setSelectedServingStyleId}
      />
    </div>
  );
};

export default ServingStyleRelationships;
