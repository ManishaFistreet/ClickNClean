import { ShoppingCart } from "lucide-react";
import type { CartItem } from "../types/services";
import Button from "../components/Button";
import close from "../assets/icons/close.svg";
import deleted from "../assets/icons/delete.svg"

type Props = {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveFromCart: (id: string) => void;
};

const CartDrawer = ({ isOpen, onClose, cart, onRemoveFromCart }: Props) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay below navbar */}
      <div
        className={`fixed left-0 right-0 bottom-0 top-[80px] bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={onClose}
      ></div>

      {/* Drawer from top */}
      <div
        className={`fixed right-0 top-[80px] h-[calc(100%-80px)] w-full max-w-md bg-white z-50 shadow-xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2 text-primary-700">
              <ShoppingCart className="w-5 h-5" />
              Your Cart
            </h2>
            <img src={close}
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-800"
            style={{height:'30px', width:'30px', cursor:'pointer'}}
            />
          </div>

          {/* Scrollable Cart Content */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <p className="text-gray-700 text-md">Your cart is empty.</p>
            ) : (
              cart.map((item, index) => (
                <div
                  key={item._id}
                  className={`flex justify-between items-center pb-2 ${index !== cart.length - 1 ? "border-b" : ""
                    }`}
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} x {item.quantity}
                    </p>
                  </div>
                  
                  <img src={deleted} 
                    onClick={() => onRemoveFromCart(item._id)}
                    style={{width:'20px',height:'20px', cursor:'pointer', color:'red'}}
                  />
                  
                
                </div>
              ))
            )}
          </div>

          {/* Total + Checkout + OR + Add More (sticky bottom) */}
          {cart.length > 0 && (
            <div className="border-t p-6">
              <div className="text-right font-bold text-lg text-primary-700 mb-4">
                Total: ₹{total}
              </div>
              <Button variant="secondary" className="w-full">
                Checkout
              </Button>

              {/* OR Divider */}
              <div className="inline-flex items-center justify-center w-full my-6 relative">
                <hr className="w-64 h-px bg-gray-200 border-0 dark:bg-gray-700" />
                <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
                  OR
                </span>
              </div>

              <Button variant="secondary" className="w-full">
                Add More Service
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
