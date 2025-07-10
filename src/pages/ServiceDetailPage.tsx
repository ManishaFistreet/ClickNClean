import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Button from '../components/Button';
import { ShoppingCart } from "lucide-react";
import type { CartItemBase, ServiceMaster, SubService } from "../types/services";
import { fetchServiceById, fetchSubServices } from "../api/ServiceApi";

type Props = {
  onAddToCart: (item: CartItemBase) => void;
};

const ServiceDetailPage = ({ onAddToCart }: Props) => {
  const { serviceId } = useParams();
  const [service, setService] = useState<ServiceMaster | null>(null);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (serviceId) {
      fetchServiceById(serviceId)
        .then(setService)
        .catch((error) => console.error("Error fetching service:", error));

      fetchSubServices(serviceId)
        .then(setSubServices)
        .catch((err) => console.error("Error fetching subservices:", err));
    }
  }, [serviceId]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  if (!service) {
    return (
      <p className="text-center mt-20 text-gray-600 text-lg font-medium">
        Loading service details...
      </p>
    );
  }

  const handleMainServiceAdd = () => {
    onAddToCart({
      _id: service._id,
      name: service.serviceName,
      price: service.currentActivePrice,
      image: service.serviceWebImage || "/default-service.jpg",
    });
    navigate("/cart");
  };

  const handleSubServiceAdd = (sub: SubService) => {
    onAddToCart({
      _id: sub._id,
      name: sub.name,
      price: sub.price || 0,
      image: sub.image || "/default-subservice.jpg",
    });
    navigate("/cart");
  };

  return (
    <>
      {/* MAIN SERVICE DETAIL */}
      <div className="max-w-6xl mx-auto px-6 py-10 mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Image Section */}
        <div className="bg-gray-100 rounded-xl h-[320px] w-full flex items-center justify-center shadow-md">
          <img
            src={service.serviceWebImage || "/default-service.jpg"}
            alt={service.serviceName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{service.serviceName}</h1>

          <p className="text-gray-600 text-sm">{service.serviceDetail || "No description available."}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Price: </span>
              <span className="text-green-600 font-semibold">₹ {service.currentActivePrice}</span>
            </div>

            {service.serviceCategory && (
              <div>
                <span className="font-semibold text-gray-700">Category: </span>
                {service.serviceCategory}
              </div>
            )}

            {service.minHours && service.maxHours && (
              <div>
                <span className="font-semibold text-gray-700">Duration: </span>
                {service.minHours} - {service.maxHours} HRS
              </div>
            )}
          </div>

          <Button
            variant="primary"
            className="mt-4 flex items-center gap-2 w-fit"
            onClick={handleMainServiceAdd}
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </Button>
        </div>
      </div>

      {Array.isArray(subServices) && subServices.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <div className="flex items-center justify-center mb-10">
            <div className="flex-grow border-t border-gray-300"></div>
            <h2 className="mx-4 text-xl font-bold text-globalPrimary text-center whitespace-nowrap">
              Add more services
            </h2>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Slider {...sliderSettings} className="custom-slick-slider">
            {subServices.map((sub) => (
              <div key={sub._id} className="px-2">
                <div className="bg-white border rounded-xl shadow hover:shadow-md transition p-3 w-[200px] h-[260px] mx-auto flex flex-col justify-between">

                  {sub.image && (
                    <img
                      src={sub.image}
                      alt={sub.name}
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src = "/default-subservice.jpg")
                      }
                      className="h-24 w-full object-cover rounded mb-2"
                    />
                  )}

                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-800 truncate">
                      {sub.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {sub.description || "No description available."}
                    </p>
                  </div>

                  <div className="mt-2">
                    <span className="text-xs text-green-700 font-medium block">
                      ₹ {sub.price || 0}
                    </span>
                    <Button
                      variant="outline"
                      className="text-xs mt-1 flex items-center gap-1 justify-center w-full"
                      onClick={() => handleSubServiceAdd(sub)}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}

    </>
  );
};

export default ServiceDetailPage;