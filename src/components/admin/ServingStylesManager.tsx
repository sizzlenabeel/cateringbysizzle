
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
import { ServingStyle } from "@/types/supabase";
import { PlusCircle, Edit, Trash } from "lucide-react";

const ServingStylesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentServingStyle, setCurrentServingStyle] = useState<Partial<ServingStyle> | null>(null);

  // Fetch all serving styles
  const { data: servingStyles, isLoading } = useQuery({
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

  // Create or update serving style mutation
  const mutation = useMutation({
    mutationFn: async (servingStyle: Partial<ServingStyle>) => {
      if (servingStyle.id) {
        // Update existing serving style
        const { data, error } = await supabase
          .from('serving_styles')
          .update({
            name: servingStyle.name,
            description: servingStyle.description
          })
          .eq('id', servingStyle.id)
          .select();
          
        if (error) throw error;
        return data;
      } else {
        // Create new serving style
        const { data, error } = await supabase
          .from('serving_styles')
          .insert({
            name: servingStyle.name,
            description: servingStyle.description
          })
          .select();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-serving-styles'] });
      setIsOpen(false);
      setCurrentServingStyle(null);
      toast({
        title: "Success",
        description: "Serving style saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save serving style: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete serving style mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('serving_styles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-serving-styles'] });
      setIsDeleteDialogOpen(false);
      setCurrentServingStyle(null);
      toast({
        title: "Success",
        description: "Serving style deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete serving style: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentServingStyle && currentServingStyle.name) {
      mutation.mutate(currentServingStyle);
    } else {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
    }
  };

  const openNewServingStyleDialog = () => {
    setCurrentServingStyle({
      name: "",
      description: ""
    });
    setIsOpen(true);
  };

  const openEditServingStyleDialog = (servingStyle: ServingStyle) => {
    setCurrentServingStyle({ ...servingStyle });
    setIsOpen(true);
  };

  const openDeleteDialog = (servingStyle: ServingStyle) => {
    setCurrentServingStyle(servingStyle);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (currentServingStyle?.id) {
      deleteMutation.mutate(currentServingStyle.id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Serving Style Management</h2>
        <Button onClick={openNewServingStyleDialog}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Serving Style
        </Button>
      </div>

      {isLoading ? (
        <div>Loading serving styles...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servingStyles && servingStyles.length > 0 ? (
                servingStyles.map((servingStyle) => (
                  <TableRow key={servingStyle.id}>
                    <TableCell>{servingStyle.name}</TableCell>
                    <TableCell>{servingStyle.description || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditServingStyleDialog(servingStyle)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openDeleteDialog(servingStyle)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No serving styles found</TableCell>
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
            <DialogTitle>{currentServingStyle?.id ? 'Edit Serving Style' : 'Add New Serving Style'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={currentServingStyle?.name || ''}
                  onChange={(e) => setCurrentServingStyle({ ...currentServingStyle, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={currentServingStyle?.description || ''}
                  onChange={(e) => setCurrentServingStyle({ ...currentServingStyle, description: e.target.value })}
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
            <p>Are you sure you want to delete <strong>{currentServingStyle?.name}</strong>?</p>
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

export default ServingStylesManager;
