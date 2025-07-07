// src/pages/ServiceDetailPage.tsx
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
    <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Image */}
      <div className="bg-gray-100 rounded-xl p-4">
        <img
          src={service.serviceWebImage || "/default-service.jpg"}
          alt={service.serviceName}
          className="w-full h-auto object-contain rounded"
        />
      </div>

      {/* Right: Info */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-800">{service.serviceName}</h1>
        <p className="text-lg text-green-600 font-semibold">₹ {service.currentActivePrice}</p>
        <p className="text-gray-600">{service.serviceDetail || "No description available."}</p>

        <ul className="text-sm text-gray-500 space-y-1 mt-2">
          {service.serviceCategory && <li><strong>Category:</strong> {service.serviceCategory}</li>}
          {service.minHours && service.maxHours && <li><strong>Duration:</strong> {service.minHours}-{service.maxHours} HRS</li>}
        </ul>

        <Button variant="primary" className="mt-6 flex items-center gap-2 w-fit">
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ServiceDetailPage;