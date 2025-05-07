import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IEventCategory } from '@/interfaces';

interface CategoryFilterProps {
  categories: IEventCategory[];
  selectedCategory: IEventCategory | null;
  onSelectCategory: (category: IEventCategory | null) => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategorySelect = (category: IEventCategory | null) => {
    onSelectCategory(category);
    setIsOpen(false);
  };

  // Format category name for display
  const formatCategoryName = (categoryName: string) => {
    return categoryName?.charAt(0).toUpperCase() + categoryName.slice(1);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          {selectedCategory
            ? formatCategoryName(selectedCategory.name)
            : 'All Categories'}
        </Button>

        <div className="hidden md:flex flex-wrap gap-2">
          <Button
            key="all"
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategorySelect(null)}
          >
            All Events
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={
                selectedCategory?.id === category.id ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => handleCategorySelect(category)}
              className="capitalize"
            >
              {formatCategoryName(category.name)}
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile category dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 z-10 w-48 mt-2 bg-white rounded-md shadow-lg md:hidden">
          <div className="py-1">
            <button
              className={`w-full text-left px-4 py-2 text-sm ${selectedCategory === null
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => handleCategorySelect(null)}
            >
              All Events
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`w-full text-left px-4 py-2 text-sm capitalize ${selectedCategory?.id === category.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => handleCategorySelect(category)}
              >
                {formatCategoryName(category.name)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
