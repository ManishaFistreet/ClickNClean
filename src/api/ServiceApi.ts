import axios from "axios";

const BASE_URL = "http://192.168.1.85:5000/api";

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
