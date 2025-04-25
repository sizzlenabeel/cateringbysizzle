
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle, Trash } from "lucide-react";
import AddRelationshipDialog from "./AddRelationshipDialog";

const SubProductRelationships = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [selectedSubProductId, setSelectedSubProductId] = useState("");
  const [isDefault, setIsDefault] = useState(false);

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

  const closeDialog = () => {
    setIsOpen(false);
    setSelectedMenuItemId("");
    setSelectedSubProductId("");
    setIsDefault(false);
  };

  const handleAddRelationship = () => {
    if (!selectedMenuItemId || !selectedSubProductId) {
      toast({
        title: "Validation Error",
        description: "Please select both a menu item and a sub product",
        variant: "destructive",
      });
      return;
    }
    addSubProductRelMutation.mutate();
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

      <AddRelationshipDialog
        isOpen={isOpen}
        onClose={closeDialog}
        onAdd={handleAddRelationship}
        type="sub-products"
        menuItems={menuItems || []}
        selectedMenuItemId={selectedMenuItemId}
        onMenuItemSelect={setSelectedMenuItemId}
        subProducts={subProducts}
        selectedSubProductId={selectedSubProductId}
        onSubProductSelect={setSelectedSubProductId}
        isDefault={isDefault}
        onIsDefaultChange={setIsDefault}
      />
    </div>
  );
};

export default SubProductRelationships;
