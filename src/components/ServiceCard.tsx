import React from 'react';
import type { CartItem, EnhancedService } from '../types/services';

type ServiceCardProps = {
    service: EnhancedService;
    index: number;
    onAddToCart: (item: Omit<CartItem, 'quantity'> & { type: 'service' }) => void;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onAddToCart }) => {
    // Determine if there's an active offer
    const hasOffer = service.prices?.some(price => {
        if (!price.offerDiscount || !price.offerEnd) return false;

        try {
            const offerEndDate = new Date(price.offerEnd);
            return offerEndDate > new Date();
        } catch {
            return false;
        }
    });

    // Get the best available price (with offer if available)
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
        <div className={`
      relative bg-white rounded-xl p-4 flex flex-col items-center text-center
      shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200
      ${hasOffer ? 'border-2 border-green-400' : ''}
    `}>
            {/* Offer Badge */}
            {hasOffer && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {bestPrice?.offerDiscount}% OFF
                </div>
            )}

            {/* Service Icon */}
            {service.serviceAppIcon && (
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-4">
                    <img
                        src={service.serviceAppIcon}
                        alt="service icon"
                        className="w-8 h-8"
                    />
                </div>
            )}

            {/* Service Details */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {service.serviceName}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {service.serviceDetail}
            </p>

            {/* Pricing Info */}
            <div className="mb-3">
                <span className="text-xl font-bold text-globalPrimary">
                    {displayPriceTag}
                </span>
                {service.priceType === 'hourly' && (
                    <span className="text-xs text-gray-500 ml-1">/hour</span>
                )}
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={() => onAddToCart({
                    _id: service._id,
                    name: service.serviceName,
                    price: displayPrice,
                    image: service.serviceWebImage,
                    icon: service.serviceAppIcon,
                    type: 'service'
                })}
                className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
                Add to Cart
            </button>
        </div>
    );
};

export default ServiceCard;