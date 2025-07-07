import React from 'react';
import type { CartItem, EnhancedPackage } from '../types/services';

type PackageCardProps = {
  pkg: EnhancedPackage;
  onAddToCart: (item: Omit<CartItem, 'quantity'> & { type: 'package' }) => void;
};

const PackageCard: React.FC<PackageCardProps> = ({ pkg, onAddToCart }) => {
  const calculateRegularPrice = () => {
    if (!pkg.includedServices || pkg.includedServices.length === 0) {
      return pkg.packagePrice * 1.2;
    }
    return pkg.includedServices.reduce((sum, service) => {
      const servicePrice = service?.showoffPriceTag || service.currentActivePrice;
      return sum + servicePrice;
    }, 0);
  };

  const regularPrice = calculateRegularPrice();
  const savings = regularPrice - pkg.packagePrice;
  const hasDiscount = savings > 0;

  return (
    <div className="bg-gradient-to-br from-globalWhiteTexture via-globalOliveLight to-[#fcffed] rounded-2xl p-5 border-[3px] border-globalAccent shadow-md hover:shadow-xl transition-all duration-300 w-full h-full flex flex-col items-center text-center min-h-[550px]">
      
      {/* Rounded Icon Image */}
      <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg bg-white border-[3px] border-globalAccent mb-4">
        <img
          src={pkg.packageImageWeb}
          alt={pkg.packageName}
          className="object-cover w-full h-full"
          onError={(e) => ((e.target as HTMLImageElement).src = '/default-package-image.jpg')}
        />
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-bold text-globalPrimary mb-1">{pkg.packageName}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pkg.packageDetail}</p>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-end justify-center gap-2">
          <span className="text-xl font-bold text-globalPrimary">
            ₹{pkg.packagePrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ₹{regularPrice.toLocaleString()}
            </span>
          )}
        </div>
        {hasDiscount && (
          <p className="text-sm text-green-600 font-medium">
            You save ₹{savings.toLocaleString()}
          </p>
        )}
      </div>

      {/* Features List */}
      <ul className="w-full mb-5 space-y-3 text-sm text-gray-700">
        {[pkg.column1, pkg.column2, pkg.column3]
          .filter(Boolean)
          .map((feature, idx) => (
            <li
              key={idx}
              className="flex items-start border-b border-globalOliveLight pb-2"
            >
              <svg
                className="w-5 h-5 text-green-600 mt-1 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
      </ul>

      {/* Add to Cart Button */}
      <button
        onClick={() =>
          onAddToCart({
            _id: pkg._id,
            name: pkg.packageName,
            price: pkg.packagePrice,
            image: pkg.packageImageWeb,
            type: 'package',
            includedServices: pkg.includedServices,
          })
        }
        className="mt-auto w-full bg-gradient-to-r from-globalAccent to-[#9fbf5c] text-globalSecondary font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        Add Package
      </button>
    </div>
  );
};

export default PackageCard;