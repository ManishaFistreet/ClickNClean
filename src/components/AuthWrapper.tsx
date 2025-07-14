import React, { useEffect, useState } from "react";
import {
  sendOtpApi,
  verifyOtpApi,
  registerUserApi,
} from "../api/ServiceApi";
import type { User } from "../types/services";

interface AuthModalProps {
  onSuccess: (user: User | null, token: string) => void;
  onClose: () => void;
  mode?: 'login' | 'register';
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "user" | "service_person";
  serviceDetails?: {
    categories: string[];
    experienceYears: number;
  };
}
const AuthWrapper = ({ onSuccess, onClose }: AuthModalProps) => {
  const [step, setStep] = useState<"phone" | "otp" | "register">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    serviceDetails: {
      categories: "",
      experienceYears: "",
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
      }
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      setError("");
      const res = await verifyOtpApi(phone, otp);

      if (!res.success) {
        setError("Verification failed");
        return;
      }

      const { isRegistered, token, user } = res;

      if (isRegistered) {
        if (!token || !user) {
          setError("Missing user data or token after verification.");
          return;
        }

        localStorage.setItem("token", token);
        onSuccess(user, token);
      } else {
        setStep("register");
      }
    } catch (err) {
      console.error("OTP Error:", err);
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || "OTP verification failed");
    }
  };


  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const payload: RegisterPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone,
        role: formData.role as "user" | "service_person",
      };

      if (formData.role === "service_person") {
        payload.serviceDetails = {
          categories: formData.serviceDetails.categories
            .split(",")
            .map((c) => c.trim()),
          experienceYears: Number(formData.serviceDetails.experienceYears),
        };
      }

      const res = await registerUserApi(payload);
      console.log("Register response:", res); // Debug

      if (!res.success || !res.token || !res.user) {
        setError("Registration failed.");
        return;
      }

      localStorage.setItem("token", res.token);
      onSuccess(res.user, res.token);
      const profileRes = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${res.token}`,
        },
      });

      const profileData = await profileRes.json();
      console.log("Profile after register:", profileData); // Debug

      if (profileData.success && profileData.user) {
        onSuccess(profileData.user, res.token);
      } else {
        setError("Could not fetch user profile after registration.");
      }
    } catch (err) {
      console.error("Registration error:", err); // Debug
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(
        axiosError.response?.data?.message || "Registration failed unexpectedly"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl relative">
        <button className="absolute right-4 top-3 text-gray-500" onClick={onClose}>✕</button>

        <div className="transition-opacity duration-300">
          {step === "phone" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-[#173958]">Enter Phone Number</h2>
              {error && <p className="text-red-600 mb-3">{error}</p>}
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border px-4 py-2 rounded mb-3"
              />
              <button className="w-full bg-[#173958] text-white py-2 rounded" onClick={sendOtp}>
                Send OTP
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-[#173958]">Verify OTP</h2>
              {error && <p className="text-red-600 mb-3">{error}</p>}
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border px-4 py-2 rounded mb-3"
              />
              <button className="w-full bg-[#173958] text-white py-2 rounded" onClick={verifyOtp}>
                Verify
              </button>
              {canResend ? (
                <p className="text-sm text-blue-600 mt-2 cursor-pointer" onClick={sendOtp}>
                  Resend OTP
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-2">Resend in {resendTimer}s</p>
              )}
            </>
          )}

          {step === "register" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-[#173958]">Complete Registration</h2>
              {error && <p className="text-red-600 mb-3">{error}</p>}
              <form onSubmit={register} className="space-y-3">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                  className="w-full border px-4 py-2 rounded"
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  className="w-full border px-4 py-2 rounded"
                  required
                />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password"
                  className="w-full border px-4 py-2 rounded"
                  required
                />

                <select
                  className="w-full border px-4 py-2 rounded"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                >
                  <option value="user">User</option>
                  <option value="service_person">Service Person</option>
                </select>

                {formData.role === "service_person" && (
                  <>
                    <input
                      type="text"
                      placeholder="Categories (comma separated)"
                      value={formData.serviceDetails.categories}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          serviceDetails: {
                            ...prev.serviceDetails,
                            categories: e.target.value,
                          },
                        }))
                      }
                      className="w-full border px-4 py-2 rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Years of Experience"
                      value={formData.serviceDetails.experienceYears}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          serviceDetails: {
                            ...prev.serviceDetails,
                            experienceYears: e.target.value,
                          },
                        }))
                      }
                      className="w-full border px-4 py-2 rounded"
                      required
                    />
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#173958] text-white py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


export default AuthWrapper;