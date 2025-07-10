import axios from "axios";
import type { AddShowcasePayload } from "../erp/Master/AddAdvertisementForm";
import type { ServiceShowcase } from "../types/services";
import  type {OrderBookingFormValues} from "../types/services"
import type { LoginLog } from "../types/services";


const BASE_URL = "http://192.168.1.58:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    console.log(res)
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
export const fetchOrderBooking = async (): Promise<OrderBookingFormValues[]> => {
  const res = await api.get("/bookings");
  return res.data;
};

export const fetchLoginLogs = async (): Promise<LoginLog[]> => {
  try{
  const response = await api.get("/loginlogs");
  return response.data;
} catch(error){
  console.error("Error fetching LoginListing:", error);
  return[];
}
}

export const createLoginLog = async (data: LoginLog): Promise<void> => {
  await api.post("/loginlogs", data);
};

export const addServices = async (formData: FormData): Promise<any> => {
  const res = await api.post("/service-master", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};