import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { EnhancedService } from "../types/services";
import { fetchServices } from "../api/ServiceApi";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import WelcomeModal from "./WelcomeModal";

type NavbarProps = {
  cartCount: number;
  onCartClick: () => void;
};

const Navbar = ({ cartCount, onCartClick }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Record<string, EnhancedService[]>>({});
  const [hoveredServiceImage, setHoveredServiceImage] = useState<string | null>(null);
  const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchServices()
      .then((res) => {
        console.log("Response for service menu", res);
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

  const filteredCategories = selectedCategory
    ? { [selectedCategory]: categories[selectedCategory] }
    : {};

  return (
    <>
      {!selectedCategory && (
        <WelcomeModal
          categories={Object.keys(categories)}
          onSelectCategory={(category) => setSelectedCategory(category)}
        />
      )}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-globalWhiteTexture"}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left - Logo */}
          <div className="text-2xl font-bold whitespace-nowrap bg-[linear-gradient(115deg,#88b448,#214738,#34735b)] text-transparent bg-clip-text">
            ClickNClean
          </div>

          {/* Center - Nav Links */}
          <nav className="hidden md:flex gap-6 text-gray-800 font-medium mx-auto">
            <a href="/" className="hover:text-globalPrimary transition font-bold">Home</a>
            <a href="#plans" className="hover:text-globalPrimary transition font-bold">Plans</a>

            {/* Services Hover Mega Menu */}
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
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[1000px] bg-white border rounded-xl shadow-xl p-6 z-50 flex gap-6">
                  {/* LEFT: Categories & Services */}
                  <div className="w-2/3 grid grid-cols-3 gap-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                    {Object.entries(filteredCategories).map(([category, services]) => (
                      <div key={category}>
                        <h4 className="text-lg font-semibold text-globalPrimary mb-3">{category}</h4>
                        <ul className="space-y-1.5">
                          {services.map((service) => (
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
                              </li>) : null
                          ))}
                        </ul>

                      </div>
                    ))}
                  </div>

                  {/* RIGHT: Image Preview */}
                  <div className="w-1/3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-3">
                    {hoveredServiceImage ? (
                      <img
                        src={hoveredServiceImage}
                        alt="Preview"
                        className="w-full h-auto max-h-64 object-contain rounded"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src = "/default-service.jpg")
                        }
                      />
                    ) : (
                      <p className="text-gray-400 text-sm italic text-center px-2">Hover a service to preview its image</p>
                    )}
                  </div>
                </div>
              )}

            </div>

            <a href="#offers" className="hover:text-globalPrimary transition font-bold">Offers</a>
            <Link to="/about-us" className="hover:text-globalPrimary font-bold">About</Link>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <UserMenu />
            <div className="flex flex-col items-center relative cursor-pointer" onClick={onCartClick}>
              <button onClick={onCartClick} className="relative">
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
    </>
  );
};

export default Navbar;
