import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { ShoppingCart } from "@mui/icons-material";
import Button from "./Button";

type NavbarProps = {
  cartCount: number;
  onCartClick: () => void;
};

const Navbar = ({ cartCount, onCartClick }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="text-xl font-semibold text-primary-700 whitespace-nowrap">
          ✨ ClickNClean
        </div>

        {/* Center - Nav Links */}
        <nav className="hidden md:flex gap-6 text-gray-800 font-medium mx-auto">
          <a href="#plans" className="hover:text-primary-600 transition">Plans</a>
          <a href="#services" className="hover:text-primary-600 transition">Services</a>
          <a href="#offers" className="hover:text-primary-600 transition">Offers</a>
          <a href="#about" className="hover:text-primary-600 transition">About</a>
          <a href="#login" className="hover:text-primary-600 transition flex items-center gap-1">
            Log In <FaUserCircle className="text-xl" />
          </a>
        </nav>

        {/* Right - Book Now + Cart */}
        <div className="hidden md:flex items-center gap-4 whitespace-nowrap">
          <Button>Book Now</Button>
          <div className="relative cursor-pointer">
            <button onClick={onCartClick} className="relative">
              <ShoppingCart className="w-6 h-6 text-primary-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Navbar;