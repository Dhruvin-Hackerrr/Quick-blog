import { io } from "../../app.js";
import logger from "../../utils/logger.js";

export const initSocket = () => {
  io.on("connection", (socket) => {
    logger.info(`User connected with socket id: ${socket.id}`);

    socket.on("post:join", (id) => {
      socket.join(id);
      logger.info(`Post joined through room ${id}`);
      socket.emit("joined", "User Joined");
    });
  });
};
