import { useState, useRef, useEffect } from "react";
import { LuCircleUserRound } from "react-icons/lu";
const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <a
        href="#login"
        onClick={(e) => {
          e.preventDefault();
          setOpen((prev) => !prev);
        }}
        className="hover:text-globalPrimary transition flex-col
         items-center gap-1 font-bold"
      >
        <LuCircleUserRound className="text-xl" />
      </a>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <button className="w-full bg-globalPrimary text-white py-2 rounded hover:bg-opacity-90 transition">
              Sign In
            </button>
            <p className="text-sm text-gray-500 mt-2">
              New customer?{" "}
              <a href="#start" className="text-globalPrimary underline">
                Start here
              </a>
            </p>
          </div>
          <ul className="p-2 space-y-2 text-sm text-gray-700">
            <li>
              <a href="#profile" className="block hover:text-globalPrimary">
                My Profile
              </a>
            </li>
            <li>
              <a href="#orders" className="block hover:text-globalPrimary">
                My Orders
              </a>
            </li>
            <li>
              <a href="#address" className="block hover:text-globalPrimary">
                Saved Address
              </a>
            </li>
            <li>
              <a href="#help" className="block hover:text-globalPrimary">
                Help Desk
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;