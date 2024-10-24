# Documentation for Collaboration Service

## Base URL

All API endpoints are prefixed with `/api/collab`.

## Authentication 

All API endpoints require a valid JWT token attained from our user service.

This should be done under the headers['authorization'] in the form "Bearer userJWT".

This applies for the initial 'connection' event for our socket.io as well.

## API Endpoints

### GET `/check-session/`

Checks if a user is part of an active session.

- **Response**:

  - **200 OK**: Returns session details.

  ```json
  {
    "sessionId": "sessionId456",
    "matchedUserId": "matchedUserId789"
  }
  ```

  - **400 Bad Request**: Returns an error if the user ID is not provided.

- **Example Request**:
  GET /api/collab/check-session/userId123

## Socket.IO Events

The socket path is '/api/collab/socket.io'.

### `join-session`

Triggered when a user attempts to join a session.

- **Payload**:
- `sessionId` (string): The ID of the session.
- `matchedUserId` (string): The ID of the matched user.

- **Responses**:
- `error`: Emitted if there is an error.
- `load-code`: Sent to the user with the initial code state after joining.
- `code-updated`: Sent to all users in the session when the code is edited.
- `user-joined`: Notifies other users that a new user has joined.
- `user-left`: Notifies other users when a user disconnects.

---

### Example Usage of Socket.IO Events

```javascript
// Example of joining a session
socket.emit('join-session', {
  sessionId: 'abc123',
  userId: 'user1',
  matchedUserId: 'user2',
});

// Listening for updated code
socket.on('code-updated', (newCode) => {
  console.log('Code has been updated:', newCode);
});
```
