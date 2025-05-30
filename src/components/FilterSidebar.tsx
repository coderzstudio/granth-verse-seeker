
import React from 'react';
import { Language, Category } from '@/types/book';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  languages: Language[];
  categories: Category[];
  selectedLanguage: string;
  selectedCategory: string;
  onLanguageChange: (language: string) => void;
  onCategoryChange: (category: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  languages,
  categories,
  selectedLanguage,
  selectedCategory,
  onLanguageChange,
  onCategoryChange,
}) => {
  const clearFilters = () => {
    onLanguageChange('');
    onCategoryChange('');
  };

  const hasActiveFilters = selectedLanguage || selectedCategory;

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

      {/* Language Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Language</h4>
        <div className="space-y-2">
          {languages.map((language) => (
            <label key={language.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="language"
                value={language.name}
                checked={selectedLanguage === language.name}
                onChange={(e) => onLanguageChange(e.target.checked ? language.name : '')}
                className="mr-2 text-orange-600"
              />
              <span className="text-sm text-gray-700">{language.name}</span>
            </label>
          ))}
        </div>
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
