
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SubProduct } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import { AdminDataTable } from "./shared/AdminDataTable";
import { ConfirmDeleteDialog } from "./shared/ConfirmDeleteDialog";
import { AdminFormDialog } from "./shared/AdminFormDialog";
import { ProductForm } from "./products/ProductForm";
import { useCrudMutation } from "@/hooks/admin/useCrudMutation";

const ProductsManager = () => {
  const { toast } = useToast();
  
  // Fetch all products
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sub_products')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });

  const {
    currentItem: currentProduct,
    setCurrentItem: setCurrentProduct,
    isFormOpen,
    setIsFormOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    openNewItemForm,
    openEditItemForm,
    openDeleteDialog,
    handleDeleteConfirm,
    createOrUpdateMutation,
    deleteMutation
  } = useCrudMutation<SubProduct>({
    tableName: 'sub_products',
    queryKey: ['admin-products'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProduct && currentProduct.name && currentProduct.price !== undefined) {
      createOrUpdateMutation.mutate(currentProduct);
    } else {
      toast({
        title: "Validation Error",
        description: "Name and price are required",
        variant: "destructive",
      });
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category", cell: (product: SubProduct) => product.category || 'Uncategorized' },
    { header: "Price", accessorKey: (product: SubProduct) => `${product.price} kr` },
    { header: "Vegan", accessorKey: (product: SubProduct) => product.is_vegan ? 'Yes' : 'No' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product Management</h2>
        <Button onClick={() => openNewItemForm({ name: "", description: "", price: 0, category: "", is_vegan: false })}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      <AdminDataTable
        data={products || []}
        columns={columns}
        isLoading={isLoading}
        onEdit={openEditItemForm}
        onDelete={openDeleteDialog}
      />

      <AdminFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        title={currentProduct?.id ? 'Edit Product' : 'Add New Product'}
        isSubmitting={createOrUpdateMutation.isPending}
      >
        <ProductForm
          product={currentProduct || {}}
          onChange={setCurrentProduct}
        />
      </AdminFormDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        itemName={currentProduct?.name || ""}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default ProductsManager;
