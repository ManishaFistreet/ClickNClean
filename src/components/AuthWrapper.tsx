import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { sendOtpApi, verifyOtpApi, registerUserApi } from "../api/ServiceApi";
import type { User } from "../types/services";
import sp from "../assets/images/housekeeping.jpg"
interface AuthWrapperProps {
  onSuccess: (user: User | null, token: string) => void;
  onClose?: () => void;
  mode?: "login" | "register";
  phoneProp?: string;
  onRequireRegister?: (phone: string) => void;
}

const AuthWrapper = ({
  onSuccess,
  onClose,
  mode = "login",
  phoneProp,
  onRequireRegister,
}: AuthWrapperProps) => {
  const location = useLocation();
  const queryPhone = new URLSearchParams(location.search).get("phone");

  const [phone, setPhone] = useState(phoneProp || queryPhone || "");
  const [step, setStep] = useState<"phone" | "otp" | "register">(
    mode === "register" || queryPhone ? "register" : "phone"
  );
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    street: "",
    zipCode: "",
    state: "",
    role: "user",
    serviceDetails: {
      categories: "",
      experienceYears: "",
      availability: {
        days: "",
        timeSlots: "",
      },
    },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step === "otp" && resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
    if (resendTimer <= 0) setCanResend(true);
  }, [step, resendTimer]);

  const sendOtp = async () => {
    try {
      setError("");
      const res = await sendOtpApi(phone);
      if (res.success) {
        setStep("otp");
        setResendTimer(60);
        setCanResend(false);
      } else {
        setError("Failed to send OTP.");
      }
    } catch {
      setError("Failed to send OTP.");
    }
  };

  const verifyOtp = async () => {
    try {
      setError("");
      const res = await verifyOtpApi(phone, otp);
      if (!res.success) {
        setError("OTP verification failed.");
        return;
      }

      const { isRegistered, token, user } = res;

      if (isRegistered && token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        onSuccess(user, token);
      } else {
        if (onRequireRegister) {
          onRequireRegister(phone);
        } else {
          setStep("register");
        }
      }
    } catch {
      setError("OTP verification failed.");
    }
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone,
        city: formData.city,
        street: formData.street,
        zipCode: formData.zipCode,
        state: formData.state,
        role: formData.role,
      };

      if (formData.role === "service_person") {
        payload.serviceDetails = {
          categories: formData.serviceDetails.categories.split(","),
          experienceYears: Number(formData.serviceDetails.experienceYears),
          availability: {
            days: formData.serviceDetails.availability.days.split(","),
            timeSlots: formData.serviceDetails.availability.timeSlots.split(","),
          },
        };
      }

      const res = await registerUserApi(payload);

      if (res.success && res.token && res.user) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        onSuccess(res.user, res.token);
      } else {
        setError("Registration failed.");
      }
    } catch {
      setError("Registration failed unexpectedly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Phone/OTP Modal */}
      {(step === "phone" || step === "otp") && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl relative">
            <button className="absolute right-4 top-3 text-gray-500" onClick={onClose}>
              ✕
            </button>

            {step === "phone" && (
              <>
                <h2 className="text-[20px] font-bold mb-4 text-[#28A745]">Enter Phone Number</h2>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border px-4 py-2 rounded mb-3"
                  placeholder="Phone"
                />
                <button
                  onClick={sendOtp}
                  className="w-full bg-[#28A745] text-white py-2 rounded"
                >
                  Send OTP
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <h2 className="text-[20px]font-bold mb-4 text-[#28A745]">Enter OTP</h2>
                {error && <p className="text-red-600 mb-2">{error}</p>}
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border px-4 py-2 rounded mb-3"
                  placeholder="OTP"
                />
                <button
                  onClick={verifyOtp}
                  className="w-full bg-[#28A745] text-white py-2 rounded"
                >
                  Verify OTP
                </button>
                {canResend ? (
                  <p className="text-sm mt-2 text-blue-600 cursor-pointer" onClick={sendOtp}>
                    Resend OTP
                  </p>
                ) : (
                  <p className="text-sm mt-2 text-gray-500">Resend in {resendTimer}s</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Register Form */}
      {step === "register" && (
        <div
          className="relative flex min-h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${sp})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#37755C]/80 z-0" />

          {/* Left Side */}
          <div className="w-1/2 hidden lg:flex items-center justify-center p-12 text-white z-10">
            <div className="max-w-md">
              <h1 className="text-4xl font-bold leading-tight mb-4">
                Best & Trusted Cleaning App
              </h1>
              <p className="text-white/80 text-lg">
                Join us and experience top-rated cleaning services across your city.
                Reliable, fast, and verified professionals at your doorstep.
              </p>
            </div>
          </div>

          {/* Right Side Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 z-10">
            <div className="w-full max-w-md mt-10 bg-[#2a4f3e]  backdrop-blur-md border border-white/20 p-8 rounded-xl shadow-xl text-white">

              <h2 className="text-2xl font-bold mb-2">Register Yourself</h2>
              <p className="text-sm text-white/70 mb-6">
                Please fill out this form to apply for a cleaning position.
              </p>

              {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

              <form onSubmit={register} className="space-y-6">
                {/* Full Name */}
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded border border-white/30 bg-transparent placeholder-white text-white"
                  placeholder="Full Name"
                  required
                />

                {/* Email */}
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded border border-white/30 bg-transparent placeholder-white text-white"
                  placeholder="Email"
                  required
                />

                {/* Address */}
                <input
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-4 py-3 rounded border border-white/30 bg-transparent placeholder-white text-white"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="px-4 py-3 rounded border border-white/30 bg-transparent placeholder-white text-white"
                    required
                  />
                  <input
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="px-4 py-3 rounded border border-white/30 bg-transparent placeholder-white text-white"
                    required
                  />
                  <input
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="px-4 py-3 rounded border border-white/30 bg-transparent placeholder-white text-white"
                    required
                  />
                </div>

                {/* Role */}
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 rounded border border-white/30 bg-transparent text-white"
                >
                  <option value="user" className="text-black">User</option>
                  <option value="service_person" className="text-black">Service Person</option>
                </select>

                {/* Conditional Service Fields */}
                {formData.role === "service_person" && (
                  <>
                    <input
                      placeholder="Service Categories (comma separated)"
                      value={formData.serviceDetails.categories}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serviceDetails: {
                            ...formData.serviceDetails,
                            categories: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 rounded border border-white/30 bg-transparent placeholder-white text-white"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Experience (in years)"
                      value={formData.serviceDetails.experienceYears}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serviceDetails: {
                            ...formData.serviceDetails,
                            experienceYears: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 rounded border border-white/30 bg-transparent placeholder-white text-white"
                      required
                    />
                    <input
                      placeholder="Available Days (e.g. Mon,Tue)"
                      value={formData.serviceDetails.availability.days}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serviceDetails: {
                            ...formData.serviceDetails,
                            availability: {
                              ...formData.serviceDetails.availability,
                              days: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-4 py-3 rounded border border-white/30 bg-transparent placeholder-white text-white"
                      required
                    />
                    <input
                      placeholder="Available Time Slots (e.g. 10am-1pm)"
                      value={formData.serviceDetails.availability.timeSlots}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serviceDetails: {
                            ...formData.serviceDetails,
                            availability: {
                              ...formData.serviceDetails.availability,
                              timeSlots: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-4 py-3 rounded border border-white/30 bg-transparent placeholder-white text-white"
                      required
                    />
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#28A745] text-white font-semibold py-3 rounded hover:bg-yellow-500 transition"
                >
                  {loading ? "Registering..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default AuthWrapper;
