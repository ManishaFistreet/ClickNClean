import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import type { EnhancedService } from "../types/services";
import { fetchServices } from "../api/ServiceApi";
import UserMenu from "./UserMenu";
import WelcomeModal from "./WelcomeModal";
import Button from "./Button";
import LocationSelectorModal from "./LocationSelectorModal";

type NavbarProps = {
  cartCount: number;
  onCartClick: () => void;
};

const Navbar = ({ cartCount, onCartClick }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Record<string, EnhancedService[]>>({});
  const [hoveredServiceImage, setHoveredServiceImage] = useState<string | null>(null);
  const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    return localStorage.getItem("selectedCategory") || null;
  });

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState("Choose Location");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchServices()
      .then((res) => {
        const grouped = res.reduce((acc: Record<string, EnhancedService[]>, service: EnhancedService) => {
          const category = service.serviceCategory || "Others";
          if (!acc[category]) acc[category] = [];
          acc[category].push(service);
          return acc;
        }, {});
        setCategories(grouped);
      })
      .catch((err) => console.error("Failed to fetch services", err));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      const { address } = JSON.parse(saved);
      setUserLocation(address);
    }
  }, []);

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setUserLocation(address);
    localStorage.setItem("userLocation", JSON.stringify({ address, lat, lng }));
    setShowLocationModal(false); // ✅ close modal after selecting
  };

  const filteredCategories = selectedCategory
    ? { [selectedCategory]: categories[selectedCategory] }
    : {};

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    localStorage.setItem("selectedCategory", category);
  };

  const handleChangeCategory = () => {
    setSelectedCategory(null);
  };

  return (
    <>
      {!selectedCategory && (
        <WelcomeModal
          categories={Object.keys(categories)}
          onSelectCategory={handleSelectCategory}
        />
      )}

      <div className="fixed top-0 left-0 w-full z-50">
        {/* SubHeader */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-2 px-4 text-sm text-gray-600">
            <div className="flex items-center gap-6 flex-wrap text-gray-700">
              {/* 📍 Location Picker */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setShowLocationModal(true)}
              >
                <span className="text-globalPrimary">📍</span>
                <span className="ml-1 text-sm font-medium text-gray-700 truncate max-w-[200px]">
                  {userLocation}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-globalPrimary">🕗</span>
                <span>8:00am - 10:00pm Mon - Sun</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-globalPrimary">📞</span>
                <span>800-123-4567</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2 md:mt-0 text-gray-500">
              <a href="#"><i className="fab fa-facebook hover:text-globalPrimary"></i></a>
              <a href="#"><i className="fab fa-twitter hover:text-globalPrimary"></i></a>
              <a href="#"><i className="fab fa-instagram hover:text-globalPrimary"></i></a>
              <a href="#"><i className="fab fa-youtube hover:text-globalPrimary"></i></a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <header className={`transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-globalWhiteTexture"}`}>
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold whitespace-nowrap bg-[linear-gradient(115deg,#88b448,#214738,#34735b)] text-transparent bg-clip-text">
              ClickNClean
            </div>

            <nav className="hidden md:flex gap-6 text-gray-800 font-medium mx-auto">
              <Link to="/" className="hover:text-globalPrimary transition font-bold">Home</Link>
              <Link to="#plans" className="hover:text-globalPrimary transition font-bold">Plans</Link>

              {/* Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => {
                  setMegaMenuOpen(false);
                  setHoveredServiceImage(null);
                }}
              >
                <span className="hover:text-globalPrimary transition font-bold cursor-pointer">
                  Services
                </span>

                {isMegaMenuOpen && selectedCategory && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[1000px] bg-white border-none rounded-xl shadow-xl p-6 z-50 flex gap-6">
                    <div className="w-2/3 grid grid-cols-2 gap-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                      {Object.entries(filteredCategories).map(([category, services]) => (
                        <div key={category}>
                          <h4 className="text-lg font-semibold text-globalPrimary mb-3">{category}</h4>
                          <ul className="space-y-1.5">
                            {services.map((service) =>
                              service._id ? (
                                <li
                                  key={service._id}
                                  className="text-md text-gray-700 hover:text-globalPrimary transition-all hover:pl-1 cursor-pointer"
                                  onMouseEnter={() => setHoveredServiceImage(service.serviceWebImage ?? null)}
                                >
                                  <Link
                                    to={`/service/${service._id}`}
                                    onClick={() => setMegaMenuOpen(false)}
                                    className="block text-sm text-gray-700 hover:text-globalPrimary transition"
                                  >
                                    {service.serviceName}
                                  </Link>
                                </li>
                              ) : null
                            )}
                          </ul>
                          <Button variant="default" className="mt-6" onClick={handleChangeCategory}>
                            Change Service Category
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Right Image Preview */}
                    <div className="w-1/3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-3">
                      {hoveredServiceImage ? (
                        <img
                          src={hoveredServiceImage}
                          alt="Preview"
                          className="w-full h-full max-h-64 object-contain rounded"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src = "/default-service.jpg")
                          }
                        />
                      ) : (
                        <p className="text-gray-400 text-sm italic text-center px-2">
                          Hover a service to preview its image
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <a href="#offers" className="hover:text-globalPrimary transition font-bold">Offers</a>
              <Link to="/about-us" className="hover:text-globalPrimary font-bold">About</Link>
            </nav>

            {/* Right - Cart & User */}
            <div className="hidden md:flex items-center gap-6">
              <UserMenu />
              <div className="relative cursor-pointer" onClick={onCartClick}>
                <button className="relative">
                  <ShoppingCart className="w-6 h-6 text-[#37755C]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 text-globalSecondary text-sm px-1.5 py-0.5 bg-globalAccent rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Modal triggered only by user click */}
      {showLocationModal && (
        <LocationSelectorModal
          onClose={() => setShowLocationModal(false)}
          onLocationSelect={handleLocationSelect}
        />
      )}
    </>
  );
};

export default Navbar;
