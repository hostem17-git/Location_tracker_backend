import { WebSocket } from "ws";
import {
  START_SESSION,
  UPDATE_LOCATION,
  STOP_SESSION,
  ERROR,
} from "./message";

export class Session {
  public sender: WebSocket;
  public receivers: WebSocket[];
  private startTime: Date;

  private noSubscribers() {
    this.sender.send(
      JSON.stringify({
        type: ERROR,
        payload: {
          message: "No subscriber!",
        },
      })
    );
  }

  constructor(sender: WebSocket) {
    this.sender = sender;
    this.receivers = [];
    this.startTime = new Date();
  }

  startSession(socket: WebSocket) {
    if (socket != this.sender) {
      console.log("invalid sender");
      return;
    }

    if (this.receivers.length == 0) {
      this.noSubscribers();
    } else {
      this.receivers.forEach((item) =>
        item.send(
          JSON.stringify({
            type: START_SESSION,
            payload: {
              message: "Session started",
            },
          })
        )
      );
    }
  }

  updateLocation(
    socket: WebSocket,
    location: {
      latitude: string;
      longitude: string;
    }
  ) {
    if (socket != this.sender) {
      console.log("Not sender");
      return;
    } else {
      if (this.receivers.length == 0) {
        this.noSubscribers();
      } else {
        this.receivers.forEach((receiver) =>
          receiver.send(
            JSON.stringify({
              type: UPDATE_LOCATION,
              payload: location,
            })
          )
        );
      }
    }
  }

  endBroadCast(socket: WebSocket) {
    if (socket !== this.sender) {
      console.log("invalid sender");
      return;
    }
    if (this.receivers.length > 0) {
      this.receivers.forEach((receiver) => {
        receiver.send(
          JSON.stringify({
            type: STOP_SESSION,
            payload: {
              message: "Session ended",
            },
          })
        );
      });
      this.receivers = [];
    }
  }

  subscribe(socket: WebSocket) {
    if (socket === this.sender) {
      console.log("Cannot subscribe to own session");
      socket.send(
        JSON.stringify({
          type: ERROR,
          payload: { message: "cannot subscribe to own session" },
        })
      );

      return;
    } else {
      this.receivers.push(socket);
    }
  }

  unsubscribe(socket: WebSocket) {
    this.receivers = this.receivers.filter((item) => item !== socket);
  }
}
