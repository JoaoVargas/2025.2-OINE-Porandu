import { WebSocketServer, WebSocket } from "ws";
import http from "http";

export const initializeWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("✅ New client connected!");

    // Handle incoming messages from clients
    ws.on("message", (message: string) => {
      console.log(`Received message => ${message}`);

      // Broadcast the message to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(`A client said: ${message}`);
        }
      });
    });

    // Handle client disconnection
    ws.on("close", () => {
      console.log("❌ Client disconnected");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.send("Welcome to the WebSocket server!");
  });
};
