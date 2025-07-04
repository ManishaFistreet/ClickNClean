import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { ShoppingCart } from "@mui/icons-material";
import Button from "./Button";
import { Link } from "react-router-dom";

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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-globalWhiteTexture"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left - Logo */}
        ✨
        <div className="text-2xl font-bold whitespace-nowrap bg-[linear-gradient(115deg,#88b448,#214738,#34735b)] text-transparent bg-clip-text">
         ClickNClean
        </div>

        {/* Center - Nav Links */}
        <nav className="hidden md:flex gap-6 text-gray-800 font-medium mx-auto">
          <a href="#plans" className="hover:text-globalPrimary transition font-bold">Plans</a>
          <a href="#services" className="hover:text-globalPrimary transition font-bold">Services</a>
          <a href="#offers" className="hover:text-globalPrimary transition font-bold">Offers</a>
          <Link to="/about" className="hover:text-globalPrimary font-bold">About</Link>
          <a href="#login" className="hover:text-globalPrimary transition flex items-center gap-1 font-bold">
            Log In <FaUserCircle className="text-xl" />
          </a>
        </nav>

        {/* Right - Book Now + Cart */}
         <div className="hidden md:flex items-center gap-4">
      <Button variant="primary">
        Book Now
      </Button>
      <div className="relative cursor-pointer">
        <button onClick={onCartClick} className="relative">
          <ShoppingCart className="w-6 h-6 text-[#37755C]" />
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