import React from 'react';
import { Category } from '../types';
import RequestExamplesMenu from './RequestExamplesMenu';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onHistoryClick: () => void;
  onExampleClick: (example: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onHistoryClick,
  onExampleClick,
}) => {
  return (
    <nav className="bg-white rounded-xl p-2 shadow-sm border border-border animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <ul className="flex flex-col gap-1">
        {categories.map((category, index) => (
          <li key={category.id}>
            <button
              onClick={() => onCategoryChange(category.id)}
              className={`
                w-full text-left px-4 py-3 rounded-lg
                text-sm sm:text-base font-medium transition-all duration-300
                relative group
                animate-scale-in
                ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white border-l-4 border-primary shadow-md font-semibold'
                    : 'text-foreground hover:bg-primary/5 hover:text-primary border-l-4 border-transparent hover:border-primary/30'
                }
              `}
              style={{ animationDelay: `${0.4 + index * 0.05}s` }}
            >
              <span className="relative z-10 flex items-center">
                <span className="flex-1">{category.name}</span>
                {selectedCategory === category.id && (
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                )}
              </span>
            </button>
          </li>
        ))}
        <li className="mt-2 pt-2 border-t border-border">
          <RequestExamplesMenu
            categories={categories}
            selectedCategory={selectedCategory}
            onExampleClick={onExampleClick}
          />
        </li>
        <li className="mt-2 pt-2 border-t border-border">
          <button
            onClick={onHistoryClick}
            className="w-full text-left px-4 py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 text-foreground hover:bg-primary/5 hover:text-primary border-l-4 border-transparent hover:border-primary/30 animate-scale-in"
            style={{ animationDelay: `${0.4 + categories.length * 0.05}s` }}
          >
            <span className="relative z-10 flex items-center">
              <span className="flex-1">История запросов</span>
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default CategorySelector;
