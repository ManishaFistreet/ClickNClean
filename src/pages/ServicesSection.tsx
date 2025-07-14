import { useState, useEffect } from 'react';
import type {
  EnhancedPackage,
  EnhancedService,
  PackageService,
  ServiceMaster,
  ServicePrice
} from '../types/services';
import PackageCard from '../components/PackageCard';
import ServiceCard from '../components/ServiceCard';
import { fetchPackages, fetchPrices, fetchServices } from '../api/ServiceApi';
import Slider from 'react-slick';

type Props = {
  onAddToCart: (item: {
    _id: string;
    name: string;
    price: number;
    image: string;
  }) => void;
};

const ServicesSection = ({ onAddToCart }: Props) => {
  const [services, setServices] = useState<EnhancedService[]>([]);
  const [packages, setPackages] = useState<EnhancedPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [servicesData, pricesData, packagesData] = await Promise.all([
          fetchServices(),
          fetchPrices(),
          fetchPackages()
        ]);

        const enhancedServices = servicesData.map((service: ServiceMaster) => {
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
            (price: ServicePrice) => price.pkgUniqueId === pkg.uniqueId && price.priceActiveStatus
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

        setServices(
          enhancedServices.filter((service: ServiceMaster) => service.serviceActiveStatus)
        );
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

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="mb-20">
        <h1 className='text-md font-bold text-black text-center'>WHAT WE OFFER</h1>
        <h2 className="text-xl font-bold text-globalPrimary text-center mb-10">
          A cleaning service that’s professional and affordable
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {services
            .filter(service => {
              const selectedCategory = localStorage.getItem("selectedCategory");
              return selectedCategory ? service.serviceCategory === selectedCategory : true;
            })
            .map((service, index) => (
              <ServiceCard
                key={service._id}
                service={service}
                index={index}
                onAddToCart={() =>
                  onAddToCart({
                    _id: service._id,
                    name: service.serviceName,
                    price: service.currentActivePrice,
                    image: service.serviceWebImage || "/default-service.jpg",
                  })
                }
              />
            ))}
        </div>
      </div>

      {packages.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-center mb-10">
            <div className="flex-grow border-t border-gray-300"></div>
            <h2 className="mx-4 text-3xl font-bold text-globalPrimary text-center whitespace-nowrap">
              Special Packages
            </h2>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="relative px-4">
            <Slider
              {...settings}
              className="custom-slick-slider"
            >
              {packages.map((pkg) => (
                <div key={pkg._id} className="px-3">
                  <PackageCard
                    pkg={pkg}
                    onAddToCart={() =>
                      onAddToCart({
                        _id: pkg._id,
                        name: pkg.packageName,
                        price: pkg.packagePrice,
                        image:
                          pkg.includedServices?.[0]?.serviceWebImage || "/default-service.jpg",
                      })
                    }
                  />
                </div>
              ))}

            </Slider>
          </div>
        </div>
      )}


    </section>
  );
};

export default ServicesSection;