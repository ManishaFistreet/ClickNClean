import React, { useState, useEffect } from 'react';
import type { CartItemBase, EnhancedPackage, EnhancedService, PackageService, ServiceMaster, ServicePrice } from '../types/services';
import PackageCard from '../components/PackageCard';
import ServiceCard from '../components/ServiceCard';
import { fetchPackages, fetchPrices, fetchServices } from '../api/ServiceApi';

type Props = {
  onAddToCart: (item: CartItemBase) => void;
};

const ServicesSection = ({ onAddToCart }: Props) => {
  const [services, setServices] = useState<EnhancedService[]>([]);
  const [packages, setPackages] = useState<EnhancedPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch all data in parallel
        const [servicesData, pricesData, packagesData] = await Promise.all([
          fetchServices(),
          fetchPrices(),
          fetchPackages()
        ]);

        // Rest of your data processing logic...
        const enhancedServices = servicesData.map((service : ServiceMaster) => {
          const servicePrices = pricesData.filter(
            (price: ServicePrice) => price.serviceCode === service.serviceCode && price.priceActiveStatus
          );
          return {
            ...service,
            prices: servicePrices,
            currentActivePrice: servicePrices[0]?.actualPrice || service.currentActivePrice
          };
        });

        const enhancedPackages = packagesData.map((pkg: PackageService) => {
          const includedServices = enhancedServices.filter(
            (service: EnhancedService) => service.serviceCode === pkg.mappedServiceCode
          );
          const includedPrices = pricesData.filter(
            (price : ServicePrice) => price.pkgUniqueId === pkg.uniqueId && price.priceActiveStatus
          );

          const packagePrice = includedServices.length > 0
            ? includedServices.reduce((sum: number, service: EnhancedService) => sum + service.currentActivePrice, 0)
            : pkg.packagePrice || 0;

          return {
            ...pkg,
            includedServices,
            includedPrices,
            packagePrice
          };
        });

        setServices(enhancedServices.filter((service: ServiceMaster) => service.serviceActiveStatus));
        setPackages(enhancedPackages);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError('Failed to connect to the server. Please make sure the backend is running.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading services: {error}
      </div>
    );
  }

  // Group services by category
  const servicesByCategory = services.reduce((acc: Record<string, EnhancedService[]>, service) => {
    if (!acc[service.serviceCategory]) {
      acc[service.serviceCategory] = [];
    }
    acc[service.serviceCategory].push(service);
    return acc;
  }, {});

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Featured Packages Section */}
      {packages.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-globalPrimary text-center mb-8">
            Special Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg._id}
                pkg={pkg}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      )}

      {/* Services by Category */}
      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <div key={category} className="mb-12">
          <h2 className="text-3xl font-bold text-globalPrimary text-center mb-8">
            {category} Services
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryServices.map((service, index) => (
              <ServiceCard
                key={service._id}
                service={service}
                index={index}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ServicesSection;