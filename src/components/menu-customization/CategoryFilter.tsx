
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onSelectCategory(null)}
          className="text-sm"
        >
          All Items
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onSelectCategory(category)}
            className="text-sm"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};
