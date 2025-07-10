import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import close from "../assets/icons/close.svg";
import deleted from "../assets/icons/delete.svg";
import { fetchCouponCode } from "../api/ServiceApi";
import type { Coupon } from "../types/services";
import Button from "../components/Button";

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

  useEffect(() => {
    fetchCouponCode().then(setCoupons);
  }, []);

  const handleApplyCoupon = () => {
    const matched = coupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase()
    );
    if (matched) {
      setAppliedCoupon(matched);
    } else {
      alert("Invalid coupon code");
    }
  };

  const discount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? (total * appliedCoupon.discountValue) / 100
      : appliedCoupon.discountValue
    : 0;

  const finalTotal = total - discount;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-[#37755C]">
          <ShoppingCart className="w-5 h-5" />
          Your Cart
        </h2>
        <img
          src={close}
          alt="Close"
          className="cursor-pointer"
          style={{ width: 30, height: 30 }}
          onClick={() => navigate(-1)}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Table */}
        <div className="w-full lg:w-2/3">
          <table className="w-full text-sm border">
            <thead>
              <tr className="border-b text-left text-gray-700 font-semibold">
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

        {/* Summary Section */}
        <div className="w-full lg:w-1/3 bg-gray-50 p-6 border rounded-md space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">Coupon Code</h4>
            <p className="text-sm text-gray-600 mb-2">
              {appliedCoupon
                ? `Applied: ${appliedCoupon.code} (${appliedCoupon.discountType === "percentage"
                  ? appliedCoupon.discountValue + "% off"
                  : "₹" + appliedCoupon.discountValue + " off"
                })`
                : "Enter your coupon code below"}
            </p>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter Coupon Code"
              className="w-full border px-3 py-2 rounded text-sm mb-3"
            />
            <Button
              onClick={handleApplyCoupon}
              className="w-full bg-[#173958] hover:bg-[#173958]/90 text-white text-sm"
            >
              APPLY COUPON
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

            <div className="flex gap-2 mt-4">
              <Button variant="outline"  onClick={()=>navigate('/')}>
                Add more
              </Button>
              <Button variant="outline" >
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
