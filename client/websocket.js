const { WebSocketServer } = require("ws");
const url = require("url");

// userId -> Set<WebSocket>
const clients = new Map();

function attachWebSocket(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  wss.on("connection", (ws, req) => {
    const { query } = url.parse(req.url, true);
    const userId = query.userId;

    if (!userId) {
      ws.close(1008, "User ID required");
      return;
    }

    if (!clients.has(userId)) {
      clients.set(userId, new Set());
    }

    clients.get(userId).add(ws);

    console.log(
      `[WS] ${userId} connected (${clients.get(userId).size} devices)`
    );

    ws.isAlive = true;

    ws.on("message", (msg) => {
      try {
        const parsed = JSON.parse(msg);
        if (parsed.type === "PONG" || parsed.type === "AUTH") {
          ws.isAlive = true;
        }
      } catch (e) {
        ws.isAlive = true;
      }
    });

    ws.on("close", () => {
      clients.get(userId)?.delete(ws);

      if (clients.get(userId)?.size === 0) {
        clients.delete(userId);
      }

      console.log(`[WS] ${userId} disconnected`);
    });

    ws.on("error", (err) => {
      console.error(`[WS] ${userId}`, err.message);
    });

    ws.send(
      JSON.stringify({
        type: "CONNECTED",
        userId,
        timestamp: new Date().toISOString(),
      })
    );
  });

  // JSON Heartbeat every 25 seconds
  const interval = setInterval(() => {
    for (const [userId, sockets] of clients) {
      for (const ws of sockets) {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: "PING" }));
        }
      }
    }
  }, 25000);

  wss.on("close", () => clearInterval(interval));

  console.log("✅ WebSocket Ready");

  return wss;
}

function broadcastToUser(userId, payload) {
  const sockets = clients.get(userId);

  if (!sockets) return;

  const message = JSON.stringify(payload);

  sockets.forEach((ws) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(message);
    }
  });
}

function broadcastAll(payload) {
  const message = JSON.stringify(payload);

  clients.forEach((sockets) => {
    sockets.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(message);
      }
    });
  });
}

function getConnectedUsers() {
  return clients.size;
}

module.exports = {
  attachWebSocket,
  broadcastToUser,
  broadcastAll,
  getConnectedUsers,
};