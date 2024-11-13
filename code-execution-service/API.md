# Code Execution Service API Documentation

## Base URL

```url
http://code-execution-service/api/codex/
```

## Security

The client will require a valid JWT created from our user service to use our endpoints.

## Endpoint

### 1. Health Check

**GET** `/`

#### Description

Check the health status of the API.

#### Response

- **200 OK**: Returns a simple message indicating that the service is running.

#### Example Response

```json
"Hello world!"
```

---

### 2. Get Supported Languages

**GET** `/languages`

#### Description

Retrieve a list of programming languages supported by the code execution service.

#### Response

- **200 OK**: Returns an array of supported languages.

#### Example Response

```json
["python", "javascript", "cpp"]
```

---

### 3. Get Starter Code

**GET** `/starter-code/:language`

#### Description

Retrieve starter code and sample input for the specified programming language.

#### Parameters

- **language** (path parameter): The programming language for which to retrieve the starter code. Supported values are `python`, `javascript`, and `cpp`.

#### Response

- **200 OK**: Returns the starter code and sample input for the specified language.
- **400 Bad Request**: If the specified language is not supported.

#### Example Response

```json
{
  "code": "num1 = int(input())\nnum2 = int(input())\nsum_result = num1 + num2\nprint(f'The sum of {num1} and {num2} is {sum_result}')",
  "input": "20\n30"
}
```

---

### 4. Execute Code

**POST** `/`

#### Description

Executes code in a specified programming language within a Docker container, optionally with input.

#### Request

- **Headers**:

  - `Content-Type: application/json`

- **Body Parameters**:
  - `code` (string, required): The code snippet to be executed.
  - `language` (string, required): The programming language for the code snippet (allowed values: `"python"`, `"javascript"`, `"cpp"`).
  - `input` (string, optional): Input to be passed to the code during execution.

#### Example Request

```json
{
  "code": "num1 = int(input())\nnum2 = int(input())\nsum_result = num1 + num2\nprint(f'The sum of {num1} and {num2} is {sum_result}')",
  "language": "python",
  "input": "20\n30"
}
```

#### Response

- **Success Response (200)**:

  - **Content**:

    ```json
    {
      "output": "The sum of 20 and 30 is 50\n",
      "isError": false
    }
    ```

  - **Description**: Returns the output of the executed code, and flag to indicate if there was an error while running the code.

- **Error Responses**:

  - **400 Bad Request**:

    - **Content**:

      ```json
      {
        "error": "Code and language are required."
      }
      ```

    - **Description**: Indicates that either `code` or `language` was not provided in the request.

  - **400 Unsupported Language**:

    - **Content**:

      ```json
      {
        "error": "Unsupported language."
      }
      ```

    - **Description**: Indicates that the provided `language` is not supported.

  - **500 Internal Server Error**:

    - **Content**:

      ```json
      {
        "error": "<error message>"
      }
      ```

    - **Description**: Indicates an unknown server error.

### Example Response for Erroneous Code

#### Request

```json
{
  "code": "num1 = int(input())\nnum2 = int(input())\nsum_result = myMistake + num2\nprint(f'The sum is: {sum_result}')",
  "language": "python",
  "input": "20\n30"
}
```

#### Response

```json
{
  "output": "Traceback (most recent call last):\n  File \"/tempCode.py\", line 3, in <module>\n    sum_result = myMistake + num2\n                 ^^^^^^^^^\nNameError: name 'myMistake' is not defined\n",
  "isError": true
}
```

## Error Handling

- If the provided language is unsupported, a `400` error with the message `"Unsupported language."` is returned.
- Errors encountered during execution (e.g., syntax errors) are returned in the `200` normal response, with `isError` set to `true`.
- Any unknown errors are logged on the server and return a generic error message to the client.

## Important Notes

1. **File Cleanup**: Temporary files created for code execution are deleted after the process to prevent storage accumulation.

## Additional Information

This service is designed to handle single file execution only and will require modifications for handling multi-file dependencies or projects.
