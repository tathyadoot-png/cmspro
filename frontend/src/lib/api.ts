import axios from "axios";

export const api = axios.create({
  baseURL: "https://urchin-app-jcwou.ondigitalocean.app/api",
  withCredentials: true,
});