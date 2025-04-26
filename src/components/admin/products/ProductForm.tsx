
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SubProduct } from "@/types/supabase";

interface ProductFormProps {
  product: Partial<SubProduct>;
  onChange: (product: Partial<SubProduct>) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onChange }) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input
          id="name"
          value={product.name || ''}
          onChange={(e) => onChange({ ...product, name: e.target.value })}
          className="col-span-3"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Textarea
          id="description"
          value={product.description || ''}
          onChange={(e) => onChange({ ...product, description: e.target.value })}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">Category</Label>
        <Input
          id="category"
          value={product.category || ''}
          onChange={(e) => onChange({ ...product, category: e.target.value })}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">Price (kr)</Label>
        <Input
          id="price"
          type="number"
          value={product.price || ''}
          onChange={(e) => onChange({ 
            ...product, 
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
          checked={product.is_vegan || false}
          onChange={(e) => onChange({ 
            ...product, 
            is_vegan: e.target.checked 
          })}
          className="col-span-1 h-5 w-5"
        />
      </div>
    </>
  );
};
