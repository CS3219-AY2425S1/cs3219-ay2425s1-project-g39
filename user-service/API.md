# User Service API Documentation

endpoint: `http://localhost/api/history`

## User Routes

### Register User

- **Endpoint**: `POST /api/user/register`
- **Purpose**: Register a new user.
- **Input**:

  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }
  ```

- **Output**:

  - **Success**:

    ```json
    { "message": "User registered successfully." }
    ```

  - **Errors**:
    - `400 Bad Request`: Email already exists.
    - `500 Internal Server Error`: Server error message.

### Update Profile

- **Endpoint**: `PUT /api/user/profile`
- **Purpose**: Update the authenticated user's profile (username, password).
- **Input**:

  ```json
  {
    "username": "newUsername",
    "password": "newPassword123"
  }
  ```

- **Output**:

  - **Success**:

    ```json
    {
      "message": "Profile updated successfully.",
      "user": {
        "id": "user_id",
        "username": "newUsername",
        "email": "user@example.com",
        "lastLogin": "2024-09-20T07:25:28.631Z"
      }
    }
    ```

  - **Errors**:
    - `500 Internal Server Error`: Server error message.

### View Profile

- **Endpoint**: `GET /api/user/profile`
- **Purpose**: View the authenticated user's profile.
- **Input**: None (Requires authentication token).
- **Output**:

  - **Success**:

    ```json
    {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "lastLogin": "2024-09-20T07:25:28.631Z"
    }
    ```

  - **Errors**:
    - `404 Not Found`: Profile not found.
    - `500 Internal Server Error`: Server error message.

### Get All Users (Admin Only)

- **Endpoint**: `GET /api/user/profiles`
- **Purpose**: Retrieve all users (Admin only).
- **Input**: None (Requires authentication token and admin privileges).
- **Output**:

  - **Success**:

    ```json
    [
      {
        "id": "user_id",
        "email": "user@example.com",
        "username": "username",
        "lastLogin": "2024-09-20T07:25:28.631Z"
      },
      ...
    ]
    ```

  - **Errors**:
    - `500 Internal Server Error`: Server error message.

### Delete User

- **Endpoint**: `DELETE /api/user/profile/:id`
- **Purpose**: Delete a user by ID (Admin or user themselves).
- **Input**: None (Requires authentication token).
- **Output**:

  - **Success**:

    ```json
    { "message": "User deleted successfully." }
    ```

  - **Errors**:
    - `500 Internal Server Error`: Server error message.

### Delete All Users (Admin Only)

- **Endpoint**: `DELETE /api/user/profiles`
- **Purpose**: Delete all users (Admin only).
- **Input**: None (Requires authentication token and admin privileges).
- **Output**:

  - **Success**:

    ```json
    { "message": "All users deleted successfully." }
    ```

  - **Errors**:
    - `500 Internal Server Error`: Server error message.

### Change admin status Users (Admin Only)

- **Endpoint**: `PUT /api/user/promote`
- **Purpose**: Delete all users (Admin only).
- **Input**: Requires authentication token and admin privileges.

  ```json
  {
    "userId": "user's id here",
    "isAdmin": true or false
  }
  ```

- **Output**:

  - **Success**:

    ```json
    { "message": "User's admin status updated to true." }
    ```

  - **Errors**:
    - `500 Internal Server Error`: Server error message.

---

## Authentication Routes

### Login User

- **Endpoint**: `POST /api/auth/login`
- **Purpose**: Authenticate a user and generate a JWT token.
- **Input**:

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **Output**:

  - **Success**:

    ```json
    { "token": "jwt_token", "user_id": "..." }
    ```

  - **Errors**:
    - `400 Bad Request`: Invalid email or password.
    - `500 Internal Server Error`: Server error message.

### Forgot Password

- **Endpoint**: `POST /api/auth/forgot-password`
- **Purpose**: Send a password reset link to the user's email.
- **Input**:

  ```json
  {
    "email": "user@example.com"
  }
  ```

- **Output**:

  - **Success**:

    ```json
    { "message": "Password reset email sent." }
    ```

  - **Errors**:
    - `400 Bad Request`: No account with that email exists.
    - `500 Internal Server Error`: Server error message.

### Reset Password

- **Endpoint**: `POST /api/auth/reset-password/:token`
- **Purpose**: Reset the user's password using the token provided in the email.
- **Input**:

  ```json
  {
    "password": "newPassword123"
  }
  ```

- **Output**:

  - **Success**:

    ```json
    { "message": "Password has been reset successfully." }
    ```

  - **Errors**:
    - `400 Bad Request`: Password reset token is invalid or has expired.
    - `500 Internal Server Error`: Server error message.

## Miscellaneous Routes

### 1. Health Check

- **Endpoint**: `GET /`
- **Purpose**: Simple health check endpoint.
- **Input**: None.
- **Output**:

  - **Success**:

    ```json
    {
      "status": "Hello from user service."
    }
    ```

### 2. Get All Users (Without Authentication)

- **Endpoint**: `GET /users`
- **Purpose**: Retrieve all users without authentication (for testing purposes).
- **Input**: None.
- **Output**:

  - **Success**:

    ```json
    [
      {
        "id": "user_id",
        "email": "user@example.com",
        "username": "username",
        "lastLogin": "2024-09-20T07:25:28.631Z"
      }
    ]
    ```

  - **Errors**:
    - `500 Internal Server Error`: Server error message.

### 3. Delete All Users (Without Authentication)

- **Endpoint**: `DELETE /users`
- **Purpose**: Delete all users without authentication (for testing purposes).
- **Input**: None.
- **Output**:

  - **Success**:

    ```json
    { "message": "All users deleted successfully." }
    ```

  - **Errors**:
    - `500 Internal Server Error`: Server error message.
