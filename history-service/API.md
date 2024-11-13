# History Service API Documentation

## Base URL
- `http://localhost/api/history`

## History Routes

### Get All History by User ID
- **Endpoint**: `GET /:userId`
- **Purpose**: Retrieve all collaboration histories for a specific user.
- **Input**:
  - **URL Parameter**: 
    - `userId` (String) - The user ID to retrieve histories for.
  - **Headers**:
    - Authorization token.
- **Output**:
  - **Success** (`200 OK`):
    ```json
    [
      {
        "_id": "history_id",
        "userIdOne": "user1_id",
        "userIdTwo": "user2_id",
        "textWritten": "some text",
        "questionId": "question_id",
        "questionName": "Sample Question",
        "questionDifficulty": "Medium",
        "programmingLanguage": "JavaScript",
        "datetime": "2024-10-23T12:34:56Z",
        "sessionDuration": 45,
        "sessionStatus": "completed"
      },
      ...
    ]
    ```
  - **Errors**:
    - `500 Internal Server Error`: Server error message.

---

### Save Collaboration History
- **Endpoint**: `POST /`
- **Purpose**: Save a new collaboration history record.
- **Input**:
  - **Body**:
    ```json
    {
        "userIdOne": "user1_id",
        "userIdTwo": "user2_id",
        "textWritten": "Collaborated on question",
        "questionId": "question_id",
        "questionName": "Sample Question",
        "questionDifficulty": "Medium",
        "programmingLanguage": "JavaScript",
        "sessionDuration": 60, // in minutes
        "sessionStatus": "completed"
    }
    ```
  - **Headers**:
    - Authorization token.
- **Output**:
  - **Success** (`200 OK`):
    ```json
    { "message": "History saved successfully." }
    ```
  - **Errors**:
    - `500 Internal Server Error`: Server error message.

---

### Delete All Collaboration History
- **Endpoint**: `DELETE /`
- **Purpose**: Delete all collaboration history records.
- **Input**:
  - **Headers**:
    - Authorization token.
- **Output**:
  - **Success** (`200 OK`):
    ```json
    { "message": "All history deleted successfully." }
    ```
  - **Errors**:
    - `403 Forbidden`: Unauthorized access 
    - `500 Internal Server Error`: Server error message. 

---
