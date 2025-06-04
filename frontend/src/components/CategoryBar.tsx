import { useState } from 'react';
import { useVideos, Category } from '../context/VideoContext';

interface CategoryBarProps {
  onCategorySelect: (categoryId: string) => void;
}

const CategoryBar = ({ onCategorySelect }: CategoryBarProps) => {
  const { categories } = useVideos();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    onCategorySelect(categoryId === selectedCategory ? 'all' : categoryId);
  };

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex space-x-16 px-6 min-w-max ">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`category-icon bg-[#B3E5FC] ${selectedCategory === category.id ? 'ring-2 ring-primary-dark' : ''}`}
          >
            <span className="text-lg font-bold">{category.icon}</span>
          </button>
        ))}
      </div>
      <div className="flex space-x-16 px-6 mt-2 min-w-max">
        {categories.map((category) => (
          <div key={category.id} className="text-center w-16 md:w-20 text-xs">
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;