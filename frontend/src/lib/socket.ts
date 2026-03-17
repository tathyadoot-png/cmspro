import { io } from "socket.io-client";

export const socket = io("https://urchin-app-jcwou.ondigitalocean.app", {
  withCredentials: true,
});