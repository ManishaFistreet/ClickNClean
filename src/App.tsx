// Update your App.tsx
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import ServicesSection from "./pages/ServicesSection";
import Footer from "./components/Footer";
import ReviewSection from "./pages/Reviews";
import AboutUs from "./pages/AboutUs";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import type { CartItem, CartItemBase } from "./types/services";
import MasterRoute from "./MasterRoute";
import CartPage from "./pages/CartSection";
import MyOrders from "./pages/MyOrders";
import AuthWrapper from "./components/AuthWrapper";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const masterRoute = location.pathname.startsWith("/master");

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

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
        <>
          
          <Navbar cartCount={cart.length} onCartClick={() => navigate("/cart")} />
        </>
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
            element={
              <CartPage cart={cart} onRemoveFromCart={handleRemoveFromCart} />
            }
          />
          <Route path="/my-bookings" element={<MyOrders />} />
          <Route path="/register" element={<RegisterRouteWrapper />} />
        </Routes>
      </main>
      {!masterRoute && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;

// 👇 Inline wrapper for register route
const RegisterRouteWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const phone = params.get("phone") || "";

  return (
    <AuthWrapper
      phoneProp={phone}
      onSuccess={(user, token) => {
        if (user && token) {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);
            toast.success("Registration successful! 🎉");
        }
        navigate("/");
      }}
      onClose={() => navigate("/")}
    />
  );
};