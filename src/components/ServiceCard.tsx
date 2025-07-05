import React from 'react';
import type { CartItem, EnhancedService } from '../types/services';

type ServiceCardProps = {
  service: EnhancedService;
  index: number;
  onAddToCart: (item: Omit<CartItem, 'quantity'> & { type: 'service' }) => void;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onAddToCart }) => {
  const hasOffer = service.prices?.some(price => {
    if (!price.offerDiscount || !price.offerEnd) return false;
    try {
      const offerEndDate = new Date(price.offerEnd);
      return offerEndDate > new Date();
    } catch {
      return false;
    }
  });

  const bestPrice = service.prices?.reduce((best, current) => {
    const currentDiscount = current.offerDiscount || 0;
    const bestDiscount = best.offerDiscount || 0;
    return currentDiscount > bestDiscount ? current : best;
  }, service.prices[0]);

  const displayPrice = bestPrice?.actualPrice || service.currentActivePrice;
  const displayPriceTag = bestPrice
    ? `₹${displayPrice}${hasOffer ? ` (${bestPrice.offerDiscount}% off)` : ''}`
    : service.showoffPriceTag;

  return (
    <div
      className={`
        relative bg-gradient-to-br from-globalWhiteTexture to-globalOliveLight
        rounded-2xl p-4 flex flex-col text-center
        shadow-md hover:shadow-lg transition-all duration-300
        border-[3px] ${hasOffer ? 'border-globalAccent' : 'border-transparent'}
      `}
    >
      {/* Offer Badge */}
      {hasOffer && (
        <div className="absolute top-2 right-2 bg-globalAccent text-globalSecondary text-xs font-bold px-2 py-1 rounded-full z-10">
          {bestPrice?.offerDiscount}% OFF
        </div>
      )}

      {/* Icon Badge */}
      {service.serviceAppIcon && (
        <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center z-10">
          <img
            src={service.serviceAppIcon}
            alt="service icon"
            className="w-5 h-5"
          />
        </div>
      )}

      {/* Image */}
      {service.serviceWebImage && (
        <img
          src={service.serviceWebImage}
          alt={service.serviceName}
          className="w-full h-40 object-cover rounded-xl mb-4"
        />
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-globalSecondary mb-1">
        {service.serviceName}
      </h3>

      {/* Description */}
      <p className="text-sm text-globalText mb-3 line-clamp-2 px-2">
        {service.serviceDetail}
      </p>

      {/* Price */}
      <div className="mb-4">
        <span className="text-xl font-bold text-globalPrimary">
          {displayPriceTag}
        </span>
        {service.priceType === 'hourly' && (
          <span className="text-xs text-gray-500 ml-1">/hour</span>
        )}
      </div>

      {/* Learn more / Add to cart */}
      <button
        onClick={() =>
          onAddToCart({
            _id: service._id,
            name: service.serviceName,
            price: displayPrice,
            image: service.serviceWebImage,
            icon: service.serviceAppIcon,
            type: 'service',
          })
        }
        className="mt-auto flex items-center justify-between text-globalPrimary bg-white rounded-full px-4 py-2 text-sm font-medium border border-[#E0E0E0] hover:shadow transition"
      >
        Book Service
        <svg
          className="ml-2 w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default ServiceCard;