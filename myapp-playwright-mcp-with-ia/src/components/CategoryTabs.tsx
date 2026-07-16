import { Category } from '@/types/menu';
import { categories } from '@/data/products';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-200',
            activeCategory === category.id
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-card text-muted-foreground hover:bg-secondary'
          )}
        >
          <span className="text-lg">{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
}
