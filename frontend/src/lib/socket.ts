import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SOCKET_URL_PROD
    : process.env.NEXT_PUBLIC_SOCKET_URL;

export const socket = io(SOCKET_URL as string, {
  withCredentials: true,
  transports: ["websocket"], // better for prod
});