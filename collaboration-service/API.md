# Documentation for Collaboration Service

## Base URL

All API endpoints are prefixed with `/api/collab`.

## Authentication 

All API endpoints require a valid JWT token attained from our user service.

This applies for the initial 'connection' event for our socket.io as well.

## Example Frontend

A *deprecated* template for a frontend client using our service can be found in the public/ folder.

## API Endpoints

### GET `/check-session/`

Checks if a user is part of an active session. This endpoint is meant as a way to bypass the matching service if an earlier session exists.

- **Response**:

  - **200 OK**: Returns session details.

  ```json
  {
    "sessionId": "sessionId456",
    "matchedUserId": "matchedUserId789",
    "questionId": "questionId123"
  }
  ```

  - **400 Bad Request**: Returns an error if the user ID is not provided.


## Socket.IO Events

The socket path is '/api/collab/socket.io'.

### `join-session`

Triggered when a user attempts to join a session.

- **Payload**:
- `sessionId` (string): The ID of the session.
- `matchedUserId` (string): The ID of the matched user.
- `questionId` (string): The ID of the question for the session.

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
