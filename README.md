
# WebSocket Session Management System Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [File Structure](#file-structure)
5. [Message Types](#message-types)
6. [Classes Overview](#classes-overview)
   - [Session](#session)
   - [SessionManager](#sessionmanager)
7. [WebSocket Server](#websocket-server)
8. [Error Handling](#error-handling)
9. [Future Improvements](#future-improvements)
10. [License](#license)

## Introduction

This project implements a WebSocket-based session management system, allowing clients to create sessions, subscribe to updates, and send location information. It facilitates real-time communication between users and efficiently manages multiple sessions.

## Installation

To run this project, ensure you have Node.js installed on your machine. Follow these steps to set up the project:

1. Clone the repository:
   ```bash
   git clone https://github.com/hostem17-git/location_tracker_backend.git
   cd location_tracker_backend.git
   ```

2. Install the required dependencies:
   ```bash
   npm install ws @types/ws
   ```
3. Build project:
   ```bash
   tsc -b
   ```
3. Start the server:
   ```bash
   node ./dist/index.js
   ```

## Usage

1. Connect to the WebSocket server:
   - Use a WebSocket client to connect to `ws://localhost:8080`.

2. Send messages to the server in the following format:
   ```json
   {
     "type": "<message_type>",
     "payload": {
       "sessionId": "<session_id>",
       "location": {
         "latitude": "<latitude>",
         "longitude": "<longitude>"
       },
       "message": "<additional_message>"
     }
   }
   ```

3. Available message types include:
   - `start_broadcast`
   - `update_location`
   - `stop_broadcast`
   - `subscribe`
   - `unsubscribe`
   - `list_sessions`

## File Structure

```
/project-root
├── index.ts
├── session.ts
├── sessionManager.ts
└── message.ts
```

## Message Types

The following message types are defined in `message.ts`:

- `START_SESSION`: Indicates the start of a new session.
- `UPDATE_LOCATION`: Updates the location of the sender.
- `STOP_SESSION`: Ends the current session.
- `SUBSCRIBE`: Allows a user to subscribe to a session.
- `UNSUBSCRIBE`: Allows a user to unsubscribe from a session.
- `LIST_SESSIONS`: Lists all active sessions.
- `ERROR`: Represents an error message.

## Classes Overview

### Session

The `Session` class handles individual broadcasting sessions.

#### Constructor

```typescript
constructor(sender: WebSocket)
```
- **Parameters**: 
  - `sender`: The WebSocket connection of the user who created the session.

#### Methods

- **startSession(socket: WebSocket)**: Starts the session and notifies subscribers.
- **updateLocation(socket: WebSocket, location: {latitude: string, longitude: string})**: Updates the location of the sender and notifies subscribers.
- **endBroadCast(socket: WebSocket)**: Ends the session and notifies all subscribers.
- **subscribe(socket: WebSocket)**: Adds a user as a subscriber to the session.
- **unsubscribe(socket: WebSocket)**: Removes a user from the list of subscribers.

### SessionManager

The `SessionManager` class manages multiple sessions.

#### Constructor

```typescript
constructor()
```

#### Methods

- **createSession(sessionId: string, socket: WebSocket)**: Creates a new session with the given ID.
- **stopSession(sessionId: string, socket: WebSocket)**: Stops an existing session.
- **getSession(sessionId: string): Session | undefined**: Retrieves a session by ID.
- **listSessions(socket: WebSocket)**: Sends a list of active sessions to the requester.
- **subscribeToSession(sessionId: string, socket: WebSocket)**: Subscribes a user to an existing session.
- **unSubsribeFromSession(sessionId: string, socket: WebSocket)**: Unsubscribes a user from a session.
- **updateLocation(sessionId: string, socket: WebSocket, location: {latitude: string, longitude: string})**: Updates a session's location information.

## WebSocket Server

The WebSocket server is set up in `index.ts`. It listens for incoming connections on port `8080`. Each connection is handled by listening for messages, which are then routed to the appropriate methods in the `SessionManager`.

### Example Connection Flow

1. A client connects to the WebSocket server.
2. The client sends a message to create a session.
3. The server processes the message and invokes the `createSession` method in `SessionManager`.
4. The server sends a response back to the client based on the action taken.

## Error Handling

The system has built-in error handling for various scenarios, such as:

- Attempting to create a session that already exists.
- Trying to start a session without any subscribers.
- Invalid sender actions (e.g., trying to subscribe to one's own session).

Errors are communicated back to the client using the `ERROR` message type.

## Future Improvements

- **Client-Side Interface**: Develop a user-friendly client interface to interact with the WebSocket server.
- **Persisting Sessions**: Implement a database to store session information for persistence across server restarts.
- **Improved Error Handling**: Enhance error handling with more specific messages and possibly error codes.
- **Testing**: Implement unit and integration tests to ensure reliability and robustness of the system.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
