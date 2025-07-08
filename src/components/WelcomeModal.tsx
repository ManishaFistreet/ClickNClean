import { useState } from 'react';

interface WelcomeModalProps {
    categories: string[];
    onSelectCategory: (category:string) => void;
}

const WelcomeModal = ({categories, onSelectCategory}:WelcomeModalProps) => {
    const [show, setShow] = useState(true);
   const handleCategoryClick = (category: string) => {
    onSelectCategory(category);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center text-globalPrimary">Welcome!</h2>
        <p className="text-sm text-gray-700 text-center mb-4">Please select a service category to get started:</p>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="py-2 px-3 bg-globalPrimary text-white rounded-lg hover:bg-opacity-90 text-sm"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;