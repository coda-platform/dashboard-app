import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_CODA_DASHBOARD_API_URL,
  timeout: 300000,
});

export default instance;
