import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import ServicesSection from "./pages/ServicesSection";
import Footer from "./components/Footer";
import ReviewSection from "./pages/Reviews";
import AboutUs from "./pages/AboutUs";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import './App.css';
import type { CartItem, CartItemBase } from "./types/services";
import MasterRoute from "./MasterRoute";
import CartPage from "./pages/CartSection";

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const masterRoute = location.pathname.startsWith("/master");

  const handleAddToCart = (item: CartItemBase) => {
    setCart((prev) => {
      const existing = prev.find((c) => c._id === item._id);
      if (existing) {
        return prev.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    navigate("/cart");
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!masterRoute && (
        <Navbar cartCount={cart.length} onCartClick={() => navigate("/cart")} />
      )}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <ServicesSection onAddToCart={handleAddToCart} />
                <ReviewSection />
              </>
            }
          />
          <Route path="/about-us" element={<AboutUs />} />
          <Route
            path="/service/:serviceId"
            element={<ServiceDetailPage onAddToCart={handleAddToCart} />}
          />
          <Route path="/master/*" element={<MasterRoute />} />
          <Route
            path="/cart"
            element={<CartPage cart={cart} onRemoveFromCart={handleRemoveFromCart} />}
          />
        </Routes>
      </main>
      {!masterRoute && <Footer />}
    </div>
  );
}

export default App;