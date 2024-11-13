# API Documentation for Communication Service

## Overview

This API documentation describes the WebSocket-based communication service for real-time features in our application, including user authentication, room management, and messaging functionalities using Socket.IO. 

The main functionality of this service is to provide a chatbox and video call between pairs of users.

### Security

This server can be ran on HTTPS, where clients will have to use the right protocols.

The client will require a valid JWT created from our user service to connect to our server.

### Frontend

In the frontend/ folder you will find *deprecated* code that may serve as a basic guide for writing your frontend client to connect to this service.

The full and correct implementation is left as an exercise for the user.

You may wish to configure the .env file to serve these files.

## Base URL

```
wss://communication-service-backend/api/comm/socket.io
```

## WebSocket Events

### 1. `connect`

- **Description**: Triggered when a client successfully connects to the Socket.IO server.
- **Parameters**: None.
- **Response**: A confirmation message that the client is connected.

### 2. `disconnect`

- **Description**: Triggered when a client disconnects from the Socket.IO server.
- **Parameters**: None.
- **Response**: Notification to the server indicating that the user has disconnected.

### 3. `joinRoom`

- **Description**: Allows a user to join a specified room for communication.
- **Parameters**:
  - `roomId` (string): The ID of the room the user wants to join.
- **Emitted From**: Client.
- **Response**:
  - On success: The server emits `roomJoined` with the `roomId`.
  - On failure: The server emits `error` if the room is full or the roomId is invalid.

**Example Request**:

```javascript
socket.emit('joinRoom', 'roomId123');
```

**Example Response**:

```javascript
socket.on('roomJoined', (roomId) => {
  console.log(`Joined room: ${roomId}`);
});
```

### 4. `offer`

- **Description**: Sends a WebRTC offer to another user in the room.
- **Parameters**:
  - `offer` (RTCSessionDescription): The WebRTC offer.
- **Emitted From**: Client.
- **Response**: The server broadcasts the `offer` to all other users in the same room.

**Example Request**:

```javascript
socket.emit('offer', offer);
```

### 5. `answer`

- **Description**: Sends a WebRTC answer in response to an offer.
- **Parameters**:
  - `answer` (RTCSessionDescription): The WebRTC answer.
- **Emitted From**: Client.
- **Response**: The server broadcasts the `answer` to the user who sent the original offer.

**Example Request**:

```javascript
socket.emit('answer', answer);
```

### 6. `candidate`

- **Description**: Sends an ICE candidate to facilitate peer-to-peer connection.
- **Parameters**:
  - `candidate` (RTCIceCandidate): The ICE candidate object.
- **Emitted From**: Client.
- **Response**: The server broadcasts the `candidate` to all other users in the room.

**Example Request**:

```javascript
socket.emit('candidate', candidate);
```

### 7. `chatMessage`

- **Description**: Sends a chat message to users in the room.
- **Parameters**:
  - `msg` (object): The message object containing:
    - `body` (string): The content of the message.
- **Emitted From**: Client.
- **Response**: The server attaches the username of the sender, then broadcasts the message to all users in the room, including the original sender.

**Example Request**:

```javascript
const msg = { body: 'Hello everyone!'};
socket.emit('chatMessage', msg);
```

**Example Response**:

```javascript
socket.on('chatMessage', (msg) => {
  console.log(`${msg.username}: ${msg.body}`);
});
```

### 8. `error`

- **Description**: Used for error handling in socket communication.
- **Parameters**:
  - `message` (string): Error message describing the issue.
- **Response**: The client can listen for this event to handle errors gracefully.

**Example Response**:

```javascript
socket.on('error', (error) => {
  alert(`Error: ${error}`);
});
```

### 9. `user-joined`

- **Description**: Notification that a new user has joined the room.
- **Parameters**:
  - `userId` (string): The ID of the user who joined.
- **Response**: The server broadcasts this message to all users in the room.

**Example Response**:

```javascript
socket.on('user-joined', (userId) => {
  console.log(`User ${userId} has joined the room.`);
});
```

### 10. `user-left`

- **Description**: Notification that a user has left the room.
- **Parameters**:
  - `userId` (string): The ID of the user who left.
- **Response**: The server broadcasts this message to all users in the room.

**Example Response**:

```javascript
socket.on('user-left', (userId) => {
  console.log(`User ${userId} has left the room.`);
});
```

## Authentication Middleware

The Socket.IO server uses JWT tokens for authentication. When a user attempts to connect, the token should be included in the `authorization` header.

**Example**:

```javascript
const socket = io('https://localhost:9999', {
  path: '/api/comm/socket.io',
  extraHeaders: {
    Authorization: `Bearer fooBar`
  }
});
```

### Authentication Error Handling

If authentication fails, the server will emit an `error` event to the client, before disconnecting the client automatically.
