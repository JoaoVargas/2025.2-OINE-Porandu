import express from "express";
import http from "http";
import * as dotenv from "dotenv";
import { initializeWebSocket } from "./websocket/manager";
import apiRoutes from "./api/routes/userRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST || "localhost";

app.use(express.json());

app.use("/api", apiRoutes);

const server = http.createServer(app);

initializeWebSocket(server);

server.listen(port, () => {
  console.log(`🚀 Server is running at http://${host}:${port}`);
  console.log(`🔌 WebSocket server is ready at ws://${host}:${port}`);
});
