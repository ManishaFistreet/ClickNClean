import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react"; 
import { fetchServices } from "../api/ServiceApi";
import Button from "../components/Button";

export type SubService = {
  _id: string;
  name: string;
  price: number;
};

export type Category = {
  _id: string;
  name: string;
  subServices: SubService[];
};

type ServicesAndCartProps = {
  cart: CartItem[];
  onAddToCart: (item: SubService) => void;
  onRemoveFromCart: (id: string) => void;
};

export type CartItem = SubService & { quantity: number };

const ServicesAndCart = ({ cart, onAddToCart, onRemoveFromCart }: ServicesAndCartProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchServices()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch services", err));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT - SERVICES */}
        <div className="col-span-2 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400">
          {categories.map((category) => (
            <div key={category._id} className="mb-10">
              <h2 className="text-xl font-semibold text-primary-700 mb-4">{category.name}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {category.subServices.map((service) => (
                  <div
                    key={service._id}
                    className="border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition"
                  >
                    <h3 className="font-medium text-lg mb-2">{service.name}</h3>
                    <p className="text-primary-600 font-bold mb-3">₹{service.price}</p>
                    <Button
                      onClick={() => onAddToCart(service)}
                      className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700"
                    >
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - CART */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary-700 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Cart
            </h2>
            <span className="text-sm text-gray-500">{cart.length} item(s)</span>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} x {item.quantity}
                    </p>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 text-sm"
                    onClick={() => onRemoveFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="text-right font-bold text-lg text-primary-700 border-t pt-3">
                Total: ₹{total}
              </div>

              <button className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesAndCart;