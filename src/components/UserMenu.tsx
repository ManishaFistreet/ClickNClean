import { useEffect, useRef, useState } from "react";
import { LuCircleUserRound } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/services";
import AuthWrapper from "./AuthWrapper";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <a
        href="#user"
        onClick={(e) => {
          e.preventDefault();
          setOpen((prev) => !prev);
        }}
        className="hover:text-globalPrimary transition flex-col items-center gap-1 font-bold"
      >
        <LuCircleUserRound className="text-xl" />
      </a>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {user ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Hello, {user.name || "User"}
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-opacity-90 transition"
                >
                  Logout
                </button>
              </div>
              <ul className="p-2 space-y-2 text-sm text-gray-700">
                <li>
                  <a href="#profile" className="block hover:text-globalPrimary">
                    My Profile
                  </a>
                </li>
                <li>
                  <a href="/my-bookings" className="block hover:text-globalPrimary">
                    My Bookings
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
            </>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-globalPrimary text-white py-2 rounded hover:bg-opacity-90 transition"
                >
                  Sign In
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  New customer?{" "}
                  <span
                    className="text-globalPrimary underline cursor-pointer"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Start here
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      )}
      {showAuthModal && (
        <AuthWrapper
          onClose={() => setShowAuthModal(false)}
          onSuccess={(user) => {
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            setShowAuthModal(false);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default UserMenu;