
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Type for data objects with an optional id
type WithOptionalId = {
  id?: string;
};

// Define allowed table names based on Supabase database schema
type TableName = keyof Database["public"]["Tables"];

export function useCrudMutation<TData extends WithOptionalId>({
  tableName,
  queryKey,
}: {
  tableName: TableName;
  queryKey: string[];
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<TData> | null>(null);

  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (item: Partial<TData>) => {
      if (item.id) {
        // Update existing item
        const { id, ...updateData } = item;
        const { data, error } = await supabase
          .from(tableName)
          .update(updateData as any)
          .eq('id', id)
          .select();
          
        if (error) throw error;
        return data[0] as unknown as TData;
      } else {
        // Create new item
        const { data, error } = await supabase
          .from(tableName)
          .insert(item as any)
          .select();
          
        if (error) throw error;
        return data[0] as unknown as TData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setIsOpen(false);
      setCurrentItem(null);
      toast({
        title: "Success",
        description: "Item saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to save item: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setIsDeleteDialogOpen(false);
      setCurrentItem(null);
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete item: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const openNewItemDialog = (initialData: Partial<TData> = {}) => {
    setCurrentItem(initialData);
    setIsOpen(true);
  };

  const openEditItemDialog = (item: TData) => {
    setCurrentItem({ ...item });
    setIsOpen(true);
  };

  const openDeleteDialog = (item: TData) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (currentItem?.id) {
      deleteMutation.mutate(currentItem.id);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentItem,
    setCurrentItem,
    mutation,
    deleteMutation,
    openNewItemDialog,
    openEditItemDialog,
    openDeleteDialog,
    handleDeleteConfirm,
  };
}
