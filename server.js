// server.js
const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3000 });

let clients = [];

server.on("connection", (ws) => {
  let userName = "";

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "join") {
      userName = data.name;
      clients.push({ ws, name: userName });

      broadcast({
        type: "user_joined",
        name: userName,
      });
    }

    if (data.type === "message") {
      broadcast({
        type: "message",
        name: userName,
        content: data.content,
        timestamp: Date.now(),
      });
    }
  });

  ws.on("close", () => {
    clients = clients.filter((client) => client.ws !== ws);
    broadcast({
      type: "user_left",
      name: userName,
    });
  });
});

function broadcast(data) {
  clients.forEach((client) => {
    client.ws.send(JSON.stringify(data));
  });
}

console.log("WebSocket server running on ws://localhost:3000");
