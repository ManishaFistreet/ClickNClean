import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { ServiceMaster } from "../types/services";
import Button from "../components/Button";
import { fetchServiceById } from "../api/ServiceApi";

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState<ServiceMaster | null>(null);

  useEffect(() => {
    if (serviceId) {
      console.log("Service ID from URL:", serviceId);

      fetchServiceById(serviceId)
        .then(setService)
        .catch((error) => console.error("Error fetching service:", error));
    }
  }, [serviceId]);

  if (!service) {
    return <p className="text-center mt-20 text-gray-600">Loading service details...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 mt-24 grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
      {/* Left: Image */}
      <div className="bg-gray-100 rounded-xl overflow-hidden h-[300px] w-full flex items-center justify-center">
        <img
          src={service.serviceWebImage || "/default-service.jpg"}
          alt={service.serviceName}
          className="w-full h-auto object-contain rounded"
        />
      </div>

      {/* Right: Service Details */}
   <div className="flex flex-col gap-3 justify-center">
  <h1 className="text-3xl font-bold text-gray-800">{service.serviceName}</h1>

  {/* Price */}
  <div className="flex gap-1 items-start">
    <span className="w-24 font-medium text-gray-700 whitespace-nowrap">Price:</span>
    <span className="text-lg text-green-600 font-semibold">₹ {service.currentActivePrice}</span>
  </div>

  {/* Details */}
  <div className="flex gap-1 items-start">
    <span className="w-24 font-medium text-gray-700 whitespace-nowrap">Details:</span>
    <p className="text-gray-600">{service.serviceDetail || "No description available."}</p>
  </div>

  {/* Category */}
  {service.serviceCategory && (
    <div className="flex gap-1 items-start">
      <span className="w-24 font-medium text-gray-700 whitespace-nowrap">Category:</span>
      <span>{service.serviceCategory}</span>
    </div>
  )}

  {/* Duration */}
  {service.minHours && service.maxHours && (
    <div className="flex gap-1 items-start">
      <span className="w-24 font-medium text-gray-700 whitespace-nowrap">Duration:</span>
      <span>{service.minHours}-{service.maxHours} HRS</span>
    </div>
  )}

  <Button variant="primary" className="mt-6 flex items-center gap-2 w-fit">
    <ShoppingCart className="w-5 h-5" />
    Add to Cart
  </Button>
</div>
    </div>
  );
};


export default ServiceDetailPage;
