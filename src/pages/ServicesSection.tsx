import { useEffect, useState } from "react";
import { fetchServices } from "../api/ServiceApi";
import Button from "../components/Button";
import type { Category, SubService } from "./ServicesAncCart";

type Props = {
  onAddToCart: (item: SubService) => void;
};

const ServicesSection = ({ onAddToCart }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchServices()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch services", err));
  }, []);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {categories.map((category) => (
        <div key={category._id} className="mb-12">
          <h2 className="text-2xl font-bold text-primary-700 mb-6 text-center uppercase tracking-wide">
            {category.name}
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {category.subServices.map((service) => (
              <div
                key={service._id}
                className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 bg-gray-200">
                  {/* <img
                    src={service.imageUrl || "/default-service.jpg"} // fallback image
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  /> */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition" />
                </div>

                <div className="absolute bottom-0 w-full bg-white/80 backdrop-blur-md px-4 py-3">
                  <h3 className="font-semibold text-gray-800 text-lg">{service.name}</h3>
                  <p className="text-primary-600 font-bold text-sm mb-2">₹{service.price}</p>
                  <Button
                    onClick={() => onAddToCart(service)}
                    className="bg-primary-600 text-white w-full py-1.5 rounded hover:bg-primary-700"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ServicesSection;
