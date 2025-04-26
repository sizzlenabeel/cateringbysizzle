
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CrudMutationOptions<TData> {
  tableName: string;
  queryKey: string[];
  onSuccess?: (data: TData) => void;
}

export const useCrudMutation = <TData extends { id?: string }>({
  tableName,
  queryKey,
  onSuccess,
}: CrudMutationOptions<TData>) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentItem, setCurrentItem] = useState<Partial<TData> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const createOrUpdateMutation = useMutation({
    mutationFn: async (item: Partial<TData>) => {
      if (item.id) {
        // Update existing item
        const { id, ...updateData } = item;
        const { data, error } = await supabase
          .from(tableName)
          .update(updateData)
          .eq("id", id)
          .select();

        if (error) throw error;
        return data[0];
      } else {
        // Create new item
        const { data, error } = await supabase
          .from(tableName)
          .insert(item)
          .select();

        if (error) throw error;
        return data[0];
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey });
      setIsFormOpen(false);
      setCurrentItem(null);
      toast({
        title: "Success",
        description: `Item saved successfully`,
      });
      if (onSuccess) onSuccess(data as TData);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(tableName).delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setIsDeleteDialogOpen(false);
      setCurrentItem(null);
      toast({
        title: "Success",
        description: `Item deleted successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const openNewItemForm = (initialData?: Partial<TData>) => {
    setCurrentItem(initialData || {});
    setIsFormOpen(true);
  };

  const openEditItemForm = (item: TData) => {
    setCurrentItem({ ...item });
    setIsFormOpen(true);
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
    currentItem,
    setCurrentItem,
    isFormOpen,
    setIsFormOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    openNewItemForm,
    openEditItemForm,
    openDeleteDialog,
    handleDeleteConfirm,
    createOrUpdateMutation,
    deleteMutation,
  };
};
