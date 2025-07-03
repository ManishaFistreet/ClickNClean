import React from 'react';
import type { CartItem, EnhancedPackage } from '../types/services';

type PackageCardProps = {
  pkg: EnhancedPackage;
  onAddToCart: (item: Omit<CartItem, 'quantity'> & { type: 'package' }) => void;
};

const PackageCard: React.FC<PackageCardProps> = ({ pkg, onAddToCart }) => {
  // Calculate regular price (sum of individual service prices)
  const calculateRegularPrice = () => {
    if (!pkg.includedServices || pkg.includedServices.length === 0) {
      return pkg.packagePrice * 1.2; // Fallback if no services included
    }

    return pkg.includedServices.reduce((sum, service) => {
      // Use showoffPrice if available, otherwise currentActivePrice
      const servicePrice = service?.showoffPriceTag || service.currentActivePrice;
      return sum + servicePrice;
    }, 0);
  };

  const regularPrice = calculateRegularPrice();
  const packagePrice = pkg.packagePrice;
  const savings = regularPrice - packagePrice;
  const savingsPercentage = regularPrice > 0 
    ? Math.round((savings / regularPrice) * 100) 
    : 0;

  const hasDiscount = savings > 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-blue-100">
      {/* Package Image with Savings Badge */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={pkg.packageImageWeb}
          alt={pkg.packageName}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-package-image.jpg';
          }}
        />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            Save {savingsPercentage}%
          </div>
        )}
      </div>

      {/* Package Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.packageName}</h3>
        <p className="text-gray-600 mb-4">{pkg.packageDetail}</p>
        
        {/* Pricing Section */}
        <div className="mb-4">
          <div className="flex items-end">
            <span className="text-2xl font-bold text-blue-600">
              ₹{packagePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ₹{regularPrice.toLocaleString()}
              </span>
            )}
          </div>
          {hasDiscount && (
            <div className="text-sm text-green-600">
              You save ₹{savings.toLocaleString()}
            </div>
          )}
        </div>

        {/* Included Services */}
        {pkg.includedServices && pkg.includedServices.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Includes:</h4>
            <ul className="space-y-2">
              {pkg.includedServices.map(service => {
                const serviceRegularPrice = service?.showoffPriceTag;
                const serviceDiscountedPrice = service.currentActivePrice;
                const hasServiceDiscount = serviceRegularPrice > serviceDiscountedPrice;

                return (
                  <li key={service._id} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm text-gray-600 block">{service.serviceName}</span>
                      <div className="flex items-center">
                        <span className="text-xs font-medium">
                          ₹{serviceDiscountedPrice.toLocaleString()}
                        </span>
                        {hasServiceDiscount && (
                          <span className="ml-1 text-xs text-gray-500 line-through">
                            ₹{serviceRegularPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Package Features */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {pkg.column1 && (
            <div className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {pkg.column1}
            </div>
          )}
          {pkg.column2 && (
            <div className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {pkg.column2}
            </div>
          )}
          {pkg.column3 && (
            <div className="flex items-center text-sm text-gray-700 col-span-2">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {pkg.column3}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart({
            _id: pkg._id,
            name: pkg.packageName,
            price: pkg.packagePrice,
            image: pkg.packageImageWeb,
            type: 'package',
            includedServices: pkg.includedServices
          })}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Add Package
        </button>
      </div>
    </div>
  );
};

export default PackageCard;