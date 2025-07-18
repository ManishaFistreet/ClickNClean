import axios from "axios";
import type { AddShowcasePayload } from "../erp/Master/AddAdvertisementForm";
import type { PriceFormValues, Booking, BookingPayload, Coupon, ServiceShowcase, User } from "../types/services";
import type { OrderBookingFormValues } from "../types/services"
import type { LoginLog } from "../types/services";

const BASE_URL = "http://18.60.181.218:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendOtpApi = async (phone: string) => {
  const res = await api.post("/user/send-otp", { phone });
  return res.data;
};

export const verifyOtpApi = async (phone: string, otp: string) => {
  const res = await api.post("/user/verify-otp", { phone, otp });
  return res.data;
};

export const registerUserApi = async (data: {
  name: string;
  email: string;
  phone: string;
  role: string;
}) => {
  const res = await api.post<{
    message: string; success: boolean; user: User; token: string
  }>(
    "/user/register",
    data
  );
  return res.data;
};

export const fetchServices = async () => {
  try {
    const res = await api.get("/service-master");
    return res.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export const fetchPackages = async () => {
  try {
    const res = await api.get("/package");
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
};

export const fetchPrices = async () => {
  try {
    const res = await api.get("/service-price");
    return res.data;
  } catch (error) {
    console.error("Error fetching prices:", error);
    return [];
  }
};
export const addPrice = async (data: PriceFormValues): Promise<void> => {
  const response = await api.post('/service-price', data);
  return response.data;
};

export const fetchReviews = async () => {
  try {
    const res = await api.get("/reviews");
    return res.data;
  } catch (error) {
    console.error("Error fetching Reviews", error);
    return [];
  }
};

export const fetchServiceById = async (id: string) => {
  try {
    const res = await api.get(`/service-master/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching service:", error);
    throw error;
  }
};

export const fetchShowcase = async (): Promise<ServiceShowcase[]> => {
  const res = await api.get("/showcase");
  return res.data;
};

export const addShowcaseAd = async (payload: AddShowcasePayload) => {
  try {
    const res = await api.post("/showcase", payload);
    return res.data;
  } catch (error) {
    console.error("Error in submitting advertisement", error);
    throw error;
  }
};

export const fetchAllUsers = async () => {
  try {
    const res = await api.get("/user/all");
    return res.data;

  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export const fetchServicePersons = async () => {
  try {
    const res = await api.get('/user/service-person/all');
    return res.data.servicePersons;
  } catch (error) {
    console.error("Error fetching service persons:", error);
    return [];
  }
};

export const fetchOrderBooking = async (): Promise<OrderBookingFormValues[]> => {
  const res = await api.get("/bookings");
  return res.data;
};

export const fetchLoginLogs = async (): Promise<LoginLog[]> => {
  try {
    const response = await api.get("/loginlogs");
    return response.data;
  } catch (error) {
    console.error("Error fetching LoginListing:", error);
    return [];
  }
}

export const createLoginLog = async (data: LoginLog): Promise<void> => {
  await api.post("/loginlogs", data);
};

export const addServices = async (formData: FormData): Promise<void> => {
  const res = await api.post("/service-master", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const fetchSubServices = async (serviceId: string) => {
  try {
    const res = await api.get("/sub-services", {
      params: { serviceId },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching sub-services", error);
    return [];
  }
};

export const fetchCoupons = async (cartValue: number) => {
  try {
    const res = await api.get("/coupons/list");
    return res.data.filter(
      (coupon: Coupon) => !coupon.minOrderValue || coupon.minOrderValue <= cartValue
    );
  } catch (error) {
    console.error("Error fetching sub-services", error);
    throw error;
  }
}

export const createBooking = async (data: BookingPayload): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.post("/bookings/create", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      message: "Failed to create booking",
    };
  }
};

export const fetchAllBookings = async (): Promise<Booking[]> => {
  try {
    const res = await api.get("/bookings/admin");
    console.log(res)
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch bookings", err);
    return [];
  }
};

export const cancelBooking = async (bookingId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.put(`/bookings/cancel/${bookingId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Cancel booking error:", error);
    return { success: false, message: "Failed to cancel booking" };
  }
};

export const getMyBookings = async (userId: string): Promise<{ success: boolean; bookings?: Booking[]; message?: string }> => {
  try {
    const res = await api.get(`/bookings/my-bookings/${userId}`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, message: "Could not fetch user bookings" };
  }
};

export const assignServicePerson = async (bookingId: string, servicePersonId: string) => {
  try {
    const response = await api.put(`/bookings/assign/${bookingId}`, {
      servicePersonId,
    });
    return response.data;
  } catch (err) {
    console.error('Failed to assign service person:', err);
    throw err;
  }
};

export const rescheduleBooking = async (id: string, newDate: string, newTime: string) => {
  await api.put(`/bookings/reschedule/${id}`, { newDate, newTime });
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  const res = await api.put(`/bookings/update-status/${bookingId}`, {status});
  return res.data
};

export const deleteBooking = async (id: string) => {
  await api.delete(`/bookings/${id}`);
};

export const createUserByAdmin = async (user: Partial<User>) => {
  const res = await api.post("/user/admin", user);
  return res.data.user;
};