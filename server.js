// server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);
    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("WebSocket server is running");
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ WebSocket server running on ws://localhost:${PORT}`);
});
