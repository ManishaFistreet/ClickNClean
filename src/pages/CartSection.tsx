import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import close from "../assets/icons/close.svg";
import deleted from "../assets/icons/delete.svg";
import { createBooking, fetchCoupons } from "../api/ServiceApi";
import type { Coupon, User } from "../types/services";
import Button from "../components/Button";
import confetti from "canvas-confetti";
import AuthWrapper from "../components/AuthWrapper";
import { toast } from "react-toastify";

type CartItem = {
  _id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

type Props = {
  cart: CartItem[];
  onRemoveFromCart: (id: string) => void;
};

const CartPage = ({ cart, onRemoveFromCart }: Props) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [couponCode, setCouponCode] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [pendingScheduleData, setPendingScheduleData] = useState<{ date: string; time: string } | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduledAddress, setScheduledAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    const savedCoupon = localStorage.getItem("appliedCoupon");
    if (savedCoupon) {
      const parsedCoupon = JSON.parse(savedCoupon);
      setAppliedCoupon(parsedCoupon);
      setCouponCode(parsedCoupon.code);
    }
  }, []);

  useEffect(() => {
    if (cart.length === 0 && appliedCoupon) handleRemoveCoupon();
  }, [cart, appliedCoupon]);

  useEffect(() => {
    if (total > 0) fetchCoupons(total).then(setCoupons);
  }, [total]);

  const handleApplyCoupon = () => {
    const matched = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    if (matched) {
      setAppliedCoupon(matched);
      localStorage.setItem("appliedCoupon", JSON.stringify(matched));
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    } else {
      alert("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    localStorage.removeItem("appliedCoupon");
  };

  const discount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? (total * appliedCoupon.discountValue) / 100
      : appliedCoupon.discountValue
    : 0;

  const finalTotal = total - discount;


  const handleSchedule = async () => {
    if (!scheduledDate || !scheduledTime || !scheduledAddress) {
      alert("Please fill all schedule details");
      return;
    }

    if (!user) {
      setPendingScheduleData({ date: scheduledDate, time: scheduledTime });
      setShowScheduleModal(false);
      setShowAuthModal(true);
      return;
    }

    const payload = {
      userId: user.id,
      services: cart.map((item) => ({
        serviceId: item._id,
        quantity: item.quantity,
      })),
      schedule: {
        date: scheduledDate,
        time: scheduledTime,
      },
      address: {
        street: scheduledAddress.street,
        city: scheduledAddress.city,
        state: scheduledAddress.state,
        zip: scheduledAddress.zip,
      },
      couponCode: appliedCoupon?.code || null,
    };
    console.log("Booking payload:", payload);


    const bookingRes = await createBooking(payload);

    if (bookingRes.success) {
      toast.success("Your booking has been placed successfully!");
      navigate("/my-bookings");
    } else {
      toast.error(bookingRes.message || "Booking failed");
    }
  };
  const handleLoginSuccess = (loggedInUser: User | null, token: string) => {
    if (!loggedInUser) return;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setShowAuthModal(false);

    if (pendingScheduleData) {
      setScheduledDate(pendingScheduleData.date);
      setScheduledTime(pendingScheduleData.time);
      setPendingScheduleData(null);
      setTimeout(() => setShowScheduleModal(true), 300);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">

      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-[#173958]">Available Coupons</h3>
            {coupons.length === 0 ? (
              <p className="text-sm text-gray-500">No coupons available for this order value.</p>
            ) : (
              <ul className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin">
                {coupons.map((coupon) => (
                  <li
                    key={coupon._id}
                    className={`border p-3 rounded hover:bg-gray-100 cursor-pointer ${appliedCoupon?._id === coupon._id ? "bg-green-100 border-green-500" : ""}`}
                    onClick={() => {
                      setAppliedCoupon(coupon);
                      setCouponCode(coupon.code);
                      setShowCouponModal(false);
                      localStorage.setItem("appliedCoupon", JSON.stringify(coupon));
                      confetti({
                        particleCount: 200,
                        spread: 90,
                        origin: { y: 0.6 },
                      });
                    }}
                  >
                    <div className="font-medium text-[#37755C]">{coupon.code}</div>
                    <div className="text-sm text-gray-600">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}% off`
                        : `₹${coupon.discountValue} off}`}
                      {coupon.minOrderValue && (
                        <span className="ml-2">(Min ₹{coupon.minOrderValue})</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="default" onClick={() => setShowCouponModal(false)} className="mt-4 w-full">
              Close
            </Button>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold text-[#173958] mb-4">When would you like us to come?</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                <input
                  type="text"
                  value={scheduledAddress.street}
                  onChange={(e) =>
                    setScheduledAddress((prev) => ({ ...prev, street: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={scheduledAddress.city}
                  onChange={(e) =>
                    setScheduledAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={scheduledAddress.state}
                  onChange={(e) =>
                    setScheduledAddress((prev) => ({ ...prev, state: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  value={scheduledAddress.zip}
                  onChange={(e) =>
                    setScheduledAddress((prev) => ({ ...prev, zip: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="Zip Code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>
              <p className="text-center text-gray-500 text-sm">We will confirm your service request within 24 hours.</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="default" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
              <Button variant="secondary" onClick={handleSchedule}>Confirm</Button>
            </div>
          </div>
        </div>
      )}

      {showAuthModal && (
        <AuthWrapper
          mode="login"
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-[#37755C]">
          <ShoppingCart className="w-5 h-5" />
          Your Cart
        </h2>
        <img
          src={close}
          alt="Close"
          className="cursor-pointer w-[30px] h-[30px]"
          onClick={() => navigate(-1)}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <table className="w-full text-sm bg-white shadow-md">
            <thead>
              <tr className="bg-white border-b rounded-md overflow-hidden text-left text-gray-700 font-semibold">
                <th className="py-2 px-2">Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    Your cart is empty.
                  </td>
                </tr>
              ) : (
                cart.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="py-3 px-2 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-contain"
                      />
                      <span className="font-medium">{item.name}</span>
                    </td>
                    <td className="text-gray-700">₹{item.price.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="w-12 border rounded text-center"
                      />
                    </td>
                    <td className="text-gray-800 font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td>
                      <img
                        src={deleted}
                        alt="delete"
                        onClick={() => onRemoveFromCart(item._id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="w-full lg:w-1/3 bg-gray-50 p-6 border-white shadow-lg rounded-md space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">Coupon Code</h4>
            {appliedCoupon && (
              <div className="mt-2 text-sm text-green-700 flex items-center justify-between">
                <span>
                  🎉 Coupon <strong>{appliedCoupon.code}</strong> applied
                </span>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-red-600 text-xs underline"
                >
                  Remove
                </button>
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter Coupon Code"
                className="w-full border px-3 py-2 rounded text-sm"
              />
              <Button
                variant="secondary"
                onClick={handleApplyCoupon}
                className="bg-[#173958] hover:bg-[#173958]/90 text-white text-sm"
              >
                Apply
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowCouponModal(true)}
              className="mt-3 w-full text-sm"
            >
              Show Available Coupons
            </Button>
          </div>
          <div className="text-sm space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Cart Subtotal:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>- ₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span>Cart Total:</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-4 justify-center mt-4">
              <Button variant="default" onClick={() => navigate('/')}>
                Add more
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (user) {
                    setShowScheduleModal(true);
                  } else {
                    setScheduledDate("");
                    setScheduledTime("");
                    setShowAuthModal(true);
                  }
                }}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;