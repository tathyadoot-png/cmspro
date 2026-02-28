import { io } from "./server";

export const emitEscalation = (data: any) => {
  io.emit("NEW_ESCALATION", data);
};