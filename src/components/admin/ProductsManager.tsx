
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { SubProduct } from "@/types/supabase";
import { PlusCircle, Edit, Trash } from "lucide-react";

const ProductsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<SubProduct> | null>(null);

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

  // Create or update product mutation
  const mutation = useMutation({
    mutationFn: async (product: Partial<SubProduct>) => {
      if (product.id) {
        // Update existing product
        const { data, error } = await supabase
          .from('sub_products')
          .update({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            is_vegan: product.is_vegan
          })
          .eq('id', product.id)
          .select();
          
        if (error) throw error;
        return data;
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('sub_products')
          .insert({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            is_vegan: product.is_vegan || false
          })
          .select();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsOpen(false);
      setCurrentProduct(null);
      toast({
        title: "Success",
        description: "Product saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save product: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sub_products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsDeleteDialogOpen(false);
      setCurrentProduct(null);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProduct && currentProduct.name && currentProduct.price !== undefined) {
      mutation.mutate(currentProduct);
    } else {
      toast({
        title: "Validation Error",
        description: "Name and price are required",
        variant: "destructive",
      });
    }
  };

  const openNewProductDialog = () => {
    setCurrentProduct({
      name: "",
      description: "",
      price: 0,
      category: "",
      is_vegan: false
    });
    setIsOpen(true);
  };

  const openEditProductDialog = (product: SubProduct) => {
    setCurrentProduct({ ...product });
    setIsOpen(true);
  };

  const openDeleteDialog = (product: SubProduct) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (currentProduct?.id) {
      deleteMutation.mutate(currentProduct.id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product Management</h2>
        <Button onClick={openNewProductDialog}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {isLoading ? (
        <div>Loading products...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Vegan</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category || 'Uncategorized'}</TableCell>
                    <TableCell>{product.price} kr</TableCell>
                    <TableCell>{product.is_vegan ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditProductDialog(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openDeleteDialog(product)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No products found</TableCell>
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
            <DialogTitle>{currentProduct?.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={currentProduct?.name || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={currentProduct?.description || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Input
                  id="category"
                  value={currentProduct?.category || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price (kr)</Label>
                <Input
                  id="price"
                  type="number"
                  value={currentProduct?.price || ''}
                  onChange={(e) => setCurrentProduct({ 
                    ...currentProduct, 
                    price: parseFloat(e.target.value) 
                  })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isVegan" className="text-right">Vegan</Label>
                <Input
                  id="isVegan"
                  type="checkbox"
                  checked={currentProduct?.is_vegan || false}
                  onChange={(e) => setCurrentProduct({ 
                    ...currentProduct, 
                    is_vegan: e.target.checked 
                  })}
                  className="col-span-1 h-5 w-5"
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
            <p>Are you sure you want to delete <strong>{currentProduct?.name}</strong>?</p>
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

export default ProductsManager;
