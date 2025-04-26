
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SubProduct } from "@/types/supabase";
import { PlusCircle } from "lucide-react";
import { useCrudMutation } from "@/hooks/admin/useCrudMutation";
import { AdminDataTable, AdminDataTableColumn } from "@/components/admin/common/AdminDataTable";
import { ConfirmDeleteDialog } from "@/components/admin/common/ConfirmDeleteDialog";
import { AdminFormDialog } from "@/components/admin/common/AdminFormDialog";
import { ProductForm } from "@/components/admin/products/ProductForm";

const ProductsManager = () => {
  // Fetch all products
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sub_products')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as SubProduct[];
    }
  });

  const {
    isOpen,
    isDeleteDialogOpen,
    currentItem,
    setCurrentItem,
    mutation,
    deleteMutation,
    openNewItemDialog,
    openEditItemDialog,
    openDeleteDialog,
    handleDeleteConfirm,
  } = useCrudMutation<SubProduct>({
    tableName: 'sub_products',
    queryKey: ['admin-products'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentItem && currentItem.name && currentItem.price !== undefined) {
      mutation.mutate(currentItem);
    }
  };

  const columns: AdminDataTableColumn<SubProduct>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (product) => product.category || 'Uncategorized'
    },
    {
      header: "Price",
      accessorKey: (product) => `${product.price} kr`
    },
    {
      header: "Vegan",
      accessorKey: "is_vegan",
      cell: (product) => product.is_vegan ? 'Yes' : 'No'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product Management</h2>
        <Button onClick={() => openNewItemDialog({
          name: "",
          description: "",
          price: 0,
          category: "",
          is_vegan: false
        })}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      <AdminDataTable
        data={products || []}
        columns={columns}
        isLoading={isLoading}
        onEdit={openEditItemDialog}
        onDelete={openDeleteDialog}
        emptyMessage="No products found"
      />

      {/* Create/Edit Dialog */}
      <AdminFormDialog
        isOpen={isOpen}
        onClose={() => setCurrentItem(null)}
        onSubmit={handleSubmit}
        title={currentItem?.id ? 'Edit Product' : 'Add New Product'}
        isSubmitting={mutation.isPending}
      >
        <ProductForm
          product={currentItem || {}}
          onChange={setCurrentItem}
        />
      </AdminFormDialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setCurrentItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        itemName={currentItem?.name || ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ProductsManager;
