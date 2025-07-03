import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import ServicesSection from "./pages/ServicesSection";
import CartModal from "./pages/CartSection";
import Footer from "./components/Footer";
import ReviewSection from "./pages/Reviews";
import './App.css';
import type { CartItem, CartItemBase } from "./types/services";

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  return (
   <div className="min-h-screen flex flex-col font-sans">
      {/* Content area that grows */}
      <main className="flex-grow">
        <Navbar cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />
        <HeroSection />
        <ServicesSection onAddToCart={handleAddToCart}  />
      </main>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
      />
      <ReviewSection/>

      {/* Footer always sticks to bottom */}
      <Footer />
    </div>
  );
}

export default App;