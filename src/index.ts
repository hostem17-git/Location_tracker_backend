import { WebSocketServer, WebSocket } from "ws";
import { SessionManager } from "./sessionManager";

import {
  START_SESSION,
  UPDATE_LOCATION,
  STOP_SESSION,
  SUBSCRIBE,
  UNSUBSCRIBE,
  ERROR,
  LIST_SESSIONS,
} from "./message";

const wss = new WebSocketServer({ port: 8080 });

const manager = new SessionManager();

wss.on("connection", (socket: WebSocket) => {
  console.log("New connection established");

  socket.on("message", (data: string) => {
    try {
      const message = JSON.parse(data);
      const { type, payload } = message;

      switch (type) {
        case START_SESSION:
          manager.createSession(payload.sessionId, socket);
          break;

        case UPDATE_LOCATION:
          manager.updateLocation(payload.sessionId, socket, payload.location);
          break;

        case STOP_SESSION:
          manager.stopSession(payload.sessionId, socket);
          break;

        case SUBSCRIBE:
          manager.subscribeToSession(payload.sessionId, socket);
          break;

        case UNSUBSCRIBE:
          manager.unsubscribeFromSession(payload.sessionId, socket);
          break;

        case LIST_SESSIONS:
          manager.listSessions(socket);
          break;

        default:
          socket.send(
            JSON.stringify({
              type: "ERROR",
              payload: { message: "Unknown message type" },
            })
          );
          break;
      }
    } catch (error) {
      console.log(error);
      sendMessageToClient(socket, ERROR, { message: "Invalid message format" });
    }
  });
});

function sendMessageToClient(socket: WebSocket, type: string, payload: object) {
  socket.send(JSON.stringify({ type, payload }));
}
