// import { Server, Socket } from "socket.io";

// let io: Server;

// export const initSocket = (server: any) => {

//   io = new Server(server, {
//     cors: {
//       origin: "http://localhost:3000"
//     }
//   });

//   io.on("connection", (socket: Socket) => {

//     console.log("⚡ Client connected:", socket.id);

//     socket.on("join-workshop", (workshopId: string) => {

//       socket.join(workshopId);

//     });

//   });

// };

// export const emitNewMessage = (workshopId: string, message: any) => {

//   io.to(workshopId).emit("new-message", message);

// };



import { Server, Socket } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {

  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000"
    }
  });

  io.on("connection", (socket: Socket) => {

    console.log("⚡ Client connected:", socket.id);

    socket.on("join-workshop", (workshopId: string) => {
      socket.join(workshopId);
    });

  });

};

export { io };