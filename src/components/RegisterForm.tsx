import { useState } from "react";
import axios from "axios";
import type { User } from "../types/services";

interface RegisterFormProps {
  phone: string;
  onSuccess: (user: User, token: string) => void;
}

const RegisterForm = ({ phone, onSuccess }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/user/register", {
        ...formData,
        phone,
        role: "user",
      });

      const { success, user, token } = response.data;

      if (success) {
        localStorage.setItem("token", token);
        onSuccess(user, token);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch packages');
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md max-w-md w-full">
      <h2 className="text-xl font-bold text-[#173958] mb-4">Complete Registration</h2>

      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#173958] text-white py-2 rounded hover:bg-[#173958]/90 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;