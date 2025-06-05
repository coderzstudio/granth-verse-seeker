
import React from 'react';
import { Category } from '@/types/book';
import { Filter } from 'lucide-react';

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const clearFilters = () => {
    onCategoryChange('');
  };

  const hasActiveFilters = selectedCategory;

  return (
    <div className="bg-white rounded-lg shadow-md border border-orange-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-orange-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-orange-600 hover:text-orange-800 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.name}
                checked={selectedCategory === category.name}
                onChange={(e) => onCategoryChange(e.target.checked ? category.name : '')}
                className="mr-2 text-orange-600"
              />
              <span className="text-sm text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
