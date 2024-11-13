# Question Service API Documentation

endpoint: `http://localhost:8000/api/questions`

## CREATE Route

### 1. Create a Question

- **Endpoint**: `POST /`
- **Purpose**: Create a new question, with ID automatically assigned.
- **Input**:

  ```json
  {
    "title": "Reverse a String 2",
    "description": "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\n\nExample 1:\n\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\nExample 2:\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n\nConstraints:\n1 <= s.length <= 105 s[i] is a printable ascii character.",
    "topics": ["Strings", "Algorithms"],
    "difficulty": "Easy",
    "images": ["example1.jpeg"]
  }
  ```

- **Output**:

  - **Success**:

    ````json
      {
        "id": 21,
        "title": "Reverse a String 2",
        "description": "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\n\nExample 1:\n\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\nExample 2:\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n\nConstraints:\n1 <= s.length <= 105 s[i] is a printable ascii character.",
        "topics": [
            "Strings",
            "Algorithms"
        ],
        "difficulty": "Easy",
        "images": [
            "P1213381.jpeg"
        ],
        "_id": "66f701a60ef4b01ca799b93d",
        "__v": 0
      }
      ```

    ````

  - **Error**:

    ```json
    {
      "message": "Error when creating new question!",
      "error": {
        "errors": {
          "title": {
            "name": "ValidatorError",
            "message": "Path `title` is required.",
            "properties": {
              "message": "Path `title` is required.",
              "type": "required",
              "path": "title"
            },
            "kind": "required",
            "path": "title"
          }
        },
        "_message": "Question validation failed",
        "name": "ValidationError",
        "message": "Question validation failed: title: Path `title` is required."
      }
    }
    ```

## READ Routes

### 1. Get All Questions

- **Endpoint**: `GET /all`
- **Purpose**: Simple get all questions endpoint.
- **Input**: None.
- **Output**:

  - **Success**:

    ```json
    [
      {
        "images": [],
        "_id": "66ee9579ac0f39d60f4edd83",
        "id": 15,
        "title": "Sliding Window Maximum",
        "description": "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.",
        "topics": ["Arrays", "Algorithms"],
        "difficulty": "Hard",
        "__v": 0
      },
      {
        "images": [],
        "_id": "66ee9579ac0f39d60f4edd85",
        "id": 16,
        "title": "N-Queen Problem",
        "description": "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.\n\nGiven an integer n, return all distinct solutions to the n queens puzzle. You may return the answer in any order.\n\nEach solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.",
        "topics": ["Algorithms"],
        "difficulty": "Hard",
        "__v": 0
      }
    ]
    ```

### 2. Get Question By Id

- **Endpoint**: `GET /id/:id`
- **Purpose**: Get one question by its Id.
- **Input**: None.
- **Output**:

  - **Success**:

    ```json
    [
      {
        "images": [],
        "_id": "66ee9579ac0f39d60f4edd7d",
        "id": 12,
        "title": "Rotate Image",
        "description": "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).",
        "topics": ["Arrays", "Algorithms"],
        "difficulty": "Medium",
        "__v": 0
      }
    ]
    ```

### 3. Get Question By Difficulty

- **Endpoint**: `GET /difficulty/:difficulty`
- **Purpose**: Get multiple questions by their difficulty.
- **Input**: None.
- **Output**:

  - **Success**:

    ```json
    [
      {
        "images": [],
        "_id": "66ee9579ac0f39d60f4edd83",
        "id": 15,
        "title": "Sliding Window Maximum",
        "description": "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.",
        "topics": ["Arrays", "Algorithms"],
        "difficulty": "Hard",
        "__v": 0
      },
      {
        "images": [],
        "_id": "66ee9579ac0f39d60f4edd85",
        "id": 16,
        "title": "N-Queen Problem",
        "description": "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.\n\nGiven an integer n, return all distinct solutions to the n queens puzzle. You may return the answer in any order.\n\nEach solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.",
        "topics": ["Algorithms"],
        "difficulty": "Hard",
        "__v": 0
      }
    ]
    ```

### 4. Get Question By Topic

- **Endpoint**: `GET /topic/:topic`
- **Purpose**: Get multiple questions by their common topic.
- **Input**: None.
- **Output**:

  - **Success**:

    ```json
    [
      {
        "images": [],
        "_id": "66ee9579ac0f39d60f4edd64",
        "id": 1,
        "title": "Reverse a String",
        "description": "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\n\nExample 1:\n\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\nExample 2:\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n\nConstraints:\n1 <= s.length <= 105 s[i] is a printable ascii character.",
        "topics": ["Strings", "Algorithms"],
        "difficulty": "Easy",
        "__v": 0
      },
      {
        "images": [],
        "_id": "66ee9579ac0f39d60f4edd7b",
        "id": 11,
        "title": "Longest Common Subsequence",
        "description": "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.\n\nFor example, \"ace\" is a subsequence of \"abcde\". A common subsequence of two strings is a subsequence that is common to both strings.",
        "topics": ["Strings", "Algorithms"],
        "difficulty": "Medium",
        "__v": 0
      },
      {
        "images": [],
        "_id": "66ee9579ac0f39d60f4edd89",
        "id": 18,
        "title": "Wildcard Matching",
        "description": "Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where:\n\n'?' Matches any single character. '*' Matches any sequence of characters (including the empty sequence).\nThe matching should cover the entire input string (not partial).",
        "topics": ["Strings", "Algorithms"],
        "difficulty": "Hard",
        "__v": 0
      }
    ]
    ```

### 5. Get Question By Filter

- **Endpoint**: `POST /filter`
- **Purpose**: Get multiple questions by setting multiple criteria.
- **Input**: This example input requests for questions that fall under at least one of these topics, AND is of one of these difficulties. If only one field is needed, the other should be exluded. If both fields are excluded all questions will be returned.

  ```json
  {
    "topics": ["Strings", "Arrays"],
    "difficulties": ["Easy", "Hard"]
  }
  ```

- **Output**:

  - **Success**:

    ```json
    [
      {
        "images": [],
        "_id": "66ee9579ac0f39d60f4edd64",
        "id": 1,
        "title": "Reverse a String",
        "description": "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\n\nExample 1:\n\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\nExample 2:\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n\nConstraints:\n1 <= s.length <= 105 s[i] is a printable ascii character.",
        "topics": ["Strings", "Algorithms"],
        "difficulty": "Easy",
        "__v": 0
      },
      {
        "images": [],
        "_id": "66ee9579ac0f39d60f4edd83",
        "id": 15,
        "title": "Sliding Window Maximum",
        "description": "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.",
        "topics": ["Arrays", "Algorithms"],
        "difficulty": "Hard",
        "__v": 0
      },
      {
        "images": [],
        "_id": "66ee9579ac0f39d60f4edd89",
        "id": 18,
        "title": "Wildcard Matching",
        "description": "Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where:\n\n'?' Matches any single character. '*' Matches any sequence of characters (including the empty sequence).\nThe matching should cover the entire input string (not partial).",
        "topics": ["Strings", "Algorithms"],
        "difficulty": "Hard",
        "__v": 0
      }
    ]
    ```

### 6. Get One Random Question By Filter

- **Endpoint**: `POST /filter-one`
- **Purpose**: Get one random question by setting multiple criteria.
- **Input**: This example input requests for a question that falls under at least one of these topics, AND is of one of these difficulties. If only one field is needed, the other should be exluded. If both fields are excluded all questions will be returned.

  ```json
  {
    "topics": ["Strings", "Arrays"],
    "difficulties": ["Easy", "Hard"]
  }
  ```

- **Output**:

  - **Success**:

    ```json
    {
      "images": [],
      "_id": "66ee9579ac0f39d60f4edd64",
      "id": 1,
      "title": "Reverse a String",
      "description": "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\n\nExample 1:\n\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\nExample 2:\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n\nConstraints:\n1 <= s.length <= 105 s[i] is a printable ascii character.",
      "topics": ["Strings", "Algorithms"],
      "difficulty": "Easy",
      "__v": 0
    },
    ```

### 7. Get Next Avilable ID

- **Endpoint**: `GET /nexid`
- **Purpose**: Get the ID that will be automatically allocated to the next newly created question.
- **Input**: None.
- **Output**:

  - **Success**:

    ```json
    {
      "result": 21
    }
    ```

### 8. Get All Topics

- **Endpoint**: `GET /topics`
- **Purpose**: Get all topics.
- **Input**: None.
- **Output**:

  - **Success**:

    ```json
    {
      "result": [
        "Algorithms",
        "Arrays",
        "Bit Manipulation",
        "Brainteaser",
        "Data Structures",
        "Recursion",
        "Strings"
      ]
    }
    ```

## UPDATE Route

### 1. Update a Question

- **Endpoint**: `PUT /:id`
- **Purpose**: Update a question by it's ID.
- **Input**:

```json
{
  "title": "Reverse a String2 updated",
  "difficulty": "Medium"
}
```

- **Output**:

  - **Success**:

    ```json
    {
      "images": [],
      "_id": "66eeef72c86938ba15b60ee5",
      "id": 21,
      "title": "Reverse a String2 updated",
      "description": "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\n\nExample 1:\n\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\nExample 2:\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n\nConstraints:\n1 <= s.length <= 105 s[i] is a printable ascii character.",
      "topics": ["Strings", "Algorithms"],
      "difficulty": "Medium",
      "__v": 0
    }
    ```

## DELETE Route

### 1. Delete a Question

- **Endpoint**: `DELETE /:id`
- **Purpose**: Delete a question by it's ID.
- **Input**: None.
- **Output**:

  - **Success**:

    ```json
    {
      "images": [],
      "_id": "66eeef72c86938ba15b60ee5",
      "id": 21,
      "title": "Reverse a String2 updated",
      "description": "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\n\nExample 1:\n\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\n\nExample 2:\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n\nConstraints:\n1 <= s.length <= 105 s[i] is a printable ascii character.",
      "topics": ["Strings", "Algorithms"],
      "difficulty": "Medium",
      "__v": 0
    }
    ```

## IMAGE HANDLING Routes

### 1. Upload an Image

- **Endpoint**: `POST /img`
- **Purpose**: Upload a single image.
- **Input**: Using form-data, send the image as a file with the key "img".
- **Output**:

  - **Success**:

    ```json
    {
      "fieldname": "img",
      "originalname": "example1.jpeg",
      "encoding": "7bit",
      "mimetype": "image/jpeg",
      "destination": "./uploads",
      "filename": "example1.jpeg",
      "path": "uploads/example1.jpeg",
      "size": 8344719
    }
    ```

### 2. Get an Image

- **Endpoint**: `GET /img/:filename`
- **Purpose**: Get a single image.
- **Input**: None.
- **Output**:
  - **Success**: The image.
