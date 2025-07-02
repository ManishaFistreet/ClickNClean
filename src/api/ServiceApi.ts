import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const fetchServices = async () => {
  const res = await axios.get(`${BASE_URL}/services`);
  return res.data;
};

export const fetchPackages = async () => {
  const res = await axios.get(`${BASE_URL}/package`);
  const data =Array.isArray(res.data) ? res.data : [];
  return data;
};