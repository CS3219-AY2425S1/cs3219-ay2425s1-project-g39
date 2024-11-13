const express = require('express');
const { executeCode } = require('../controllers/codeController');
const { authMiddleware } = require('../middleware/authMiddleware');

const STARTER_CODES = {
    "javascript": {
        "code": "let input = '';\n\nprocess.stdin.on('data', (chunk) => {\n  input += chunk;\n});\n\nprocess.stdin.on('end', () => {\n  const numbers = input.trim().split('\\n').map(Number);\n  const sum = numbers[0] + numbers[1];\n  console.log(`The sum of ${numbers[0]} and ${numbers[1]} is ${sum}`);\n});",
        "input": "20\n30"
    },
    "cpp": {
        "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int num1, num2;\n    cin >> num1 >> num2;\n    int sum_result = num1 + num2;\n    cout << \"The sum of \" << num1 << \" and \" << num2 << \" is \" << sum_result << endl;\n    return 0;\n}",
        "input": "20\n30"
    },
    "python": {
        "code": "num1 = int(input())\nnum2 = int(input())\nsum_result = num1 + num2\nprint(f'The sum of {num1} and {num2} is {sum_result}')",
        "input": "20\n30"
    }
}

const SUPPORTED_LANGS = ['python', 'javascript', 'cpp']

const router = express.Router();

// Health check
router.get('/', (req, res) => {
    return res.status(200).send('Hello world!');
});

router.get('/languages', (req, res) => {
    return res.status(200).json(SUPPORTED_LANGS);
});

router.get('/starter-code/:language', (req, res) => {
    try {
        const language = req.params.language;
        if (!SUPPORTED_LANGS.includes(language)) {
            return res.status(400).json({ error: 'Unsupported language.' });
        }
        return res.status(200).json(STARTER_CODES[language]);
    } catch (error) {
        res.status(500).json({ error: 'Unknown server error' });
    }
});

// Route to execute code
router.post('/', authMiddleware, executeCode);

module.exports = router;
