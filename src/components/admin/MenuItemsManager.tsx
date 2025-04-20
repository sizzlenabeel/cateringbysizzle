
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MenuItem } from "@/types/supabase";
import { PlusCircle, Edit, Trash, Link } from "lucide-react";

const MenuItemsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<Partial<MenuItem> | null>(null);

  // Fetch all menu items
  const { data: menuItems, isLoading } = useQuery({
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

  // Create or update menu item mutation
  const mutation = useMutation({
    mutationFn: async (menuItem: Partial<MenuItem>) => {
      if (menuItem.id) {
        // Update existing menu item
        const { data, error } = await supabase
          .from('menu_items')
          .update({
            name: menuItem.name,
            description: menuItem.description,
            base_price: menuItem.base_price,
            is_vegan: menuItem.is_vegan,
            minimum_quantity: menuItem.minimum_quantity,
            image_url: menuItem.image_url
          })
          .eq('id', menuItem.id)
          .select();
          
        if (error) throw error;
        return data;
      } else {
        // Create new menu item
        const { data, error } = await supabase
          .from('menu_items')
          .insert({
            name: menuItem.name,
            description: menuItem.description,
            base_price: menuItem.base_price,
            is_vegan: menuItem.is_vegan || false,
            minimum_quantity: menuItem.minimum_quantity || 5,
            image_url: menuItem.image_url
          })
          .select();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      setIsOpen(false);
      setCurrentMenuItem(null);
      toast({
        title: "Success",
        description: "Menu item saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save menu item: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete menu item mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      setIsDeleteDialogOpen(false);
      setCurrentMenuItem(null);
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete menu item: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMenuItem && currentMenuItem.name && currentMenuItem.base_price !== undefined) {
      mutation.mutate(currentMenuItem);
    } else {
      toast({
        title: "Validation Error",
        description: "Name and base price are required",
        variant: "destructive",
      });
    }
  };

  const openNewMenuItemDialog = () => {
    setCurrentMenuItem({
      name: "",
      description: "",
      base_price: 0,
      is_vegan: false,
      minimum_quantity: 5,
      image_url: ""
    });
    setIsOpen(true);
  };

  const openEditMenuItemDialog = (menuItem: MenuItem) => {
    setCurrentMenuItem({ ...menuItem });
    setIsOpen(true);
  };

  const openDeleteDialog = (menuItem: MenuItem) => {
    setCurrentMenuItem(menuItem);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (currentMenuItem?.id) {
      deleteMutation.mutate(currentMenuItem.id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Menu Item Management</h2>
        <Button onClick={openNewMenuItemDialog}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Menu Item
        </Button>
      </div>

      {isLoading ? (
        <div>Loading menu items...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Min. Quantity</TableHead>
                <TableHead>Vegan</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems && menuItems.length > 0 ? (
                menuItems.map((menuItem) => (
                  <TableRow key={menuItem.id}>
                    <TableCell>{menuItem.name}</TableCell>
                    <TableCell>{menuItem.base_price} kr</TableCell>
                    <TableCell>{menuItem.minimum_quantity || 5}</TableCell>
                    <TableCell>{menuItem.is_vegan ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditMenuItemDialog(menuItem)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openDeleteDialog(menuItem)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No menu items found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentMenuItem?.id ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={currentMenuItem?.name || ''}
                  onChange={(e) => setCurrentMenuItem({ ...currentMenuItem, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={currentMenuItem?.description || ''}
                  onChange={(e) => setCurrentMenuItem({ ...currentMenuItem, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="basePrice" className="text-right">Base Price (kr)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={currentMenuItem?.base_price || ''}
                  onChange={(e) => setCurrentMenuItem({ 
                    ...currentMenuItem, 
                    base_price: parseFloat(e.target.value) 
                  })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minQuantity" className="text-right">Min. Quantity</Label>
                <Input
                  id="minQuantity"
                  type="number"
                  value={currentMenuItem?.minimum_quantity || 5}
                  onChange={(e) => setCurrentMenuItem({ 
                    ...currentMenuItem, 
                    minimum_quantity: parseInt(e.target.value) 
                  })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isVegan" className="text-right">Vegan</Label>
                <Input
                  id="isVegan"
                  type="checkbox"
                  checked={currentMenuItem?.is_vegan || false}
                  onChange={(e) => setCurrentMenuItem({ 
                    ...currentMenuItem, 
                    is_vegan: e.target.checked 
                  })}
                  className="col-span-1 h-5 w-5"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={currentMenuItem?.image_url || ''}
                  onChange={(e) => setCurrentMenuItem({ ...currentMenuItem, image_url: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete <strong>{currentMenuItem?.name}</strong>?</p>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuItemsManager;
