const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const crypto = require('crypto');

// Ensure 'code/' directory exists
const CODE_DIR = path.join(__dirname, '../code');
if (!fs.existsSync(CODE_DIR)) {
  fs.mkdirSync(CODE_DIR);
}

// Set limits
const EXECUTION_TIMEOUT_MS = 2000; // 2 seconds for execution
const COMPILATION_TIMEOUT_MS = 3000; // 2 seconds for compilation
const MEMORY_LIMIT_MB = 100; // Set memory limit to 100 MB

// Code execution logic
const executeCode = (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required.' });
    }

    // Generate a unique directory for each execution
    const uniqueDir = path.join(CODE_DIR, crypto.randomUUID());
    fs.mkdirSync(uniqueDir);

    let filename, compileCommand, execCommand, filePath, inputFilePath;

    // Set filename and commands based on language
    switch (language) {
      case 'python':
        filename = 'tempCode.py';
        filePath = path.join(uniqueDir, filename);
        inputFilePath = path.join(uniqueDir, 'input.txt');
        execCommand = `python3 ${filePath} < ${inputFilePath}`;
        break;
      case 'javascript':
        filename = 'tempCode.js';
        filePath = path.join(uniqueDir, filename);
        inputFilePath = path.join(uniqueDir, 'input.txt');
        execCommand = `node ${filePath} < ${inputFilePath}`;
        break;
      case 'cpp':
        filename = 'tempCode.cpp';
        filePath = path.join(uniqueDir, filename);
        inputFilePath = path.join(uniqueDir, 'input.txt');
        compileCommand = `g++ ${filePath} -o ${path.join(uniqueDir, 'tempCode')}`;
        execCommand = `${path.join(uniqueDir, 'tempCode')} < ${inputFilePath}`;
        break;
      default:
        fs.rmSync(uniqueDir, { recursive: true }); // Clean up directory
        return res.status(400).json({ error: 'Unsupported language.' });
    }

    fs.writeFileSync(filePath, code);
    fs.writeFileSync(inputFilePath, input);

    // Synchronous function to execute a command with custom error message
    const execWithTimeoutSync = (command, timeout, errorMessage) => {
      try {
        return execSync(command, { timeout, stdio: 'pipe' }).toString();
      } catch (error) {
        throw new Error(errorMessage);
      }
    };

    // Compile the C++ code with a time limit
    if (language === 'cpp') {
      try {
        // Compile
        execWithTimeoutSync(compileCommand, COMPILATION_TIMEOUT_MS, 'Compilation timed out');
        // Execute
        const output = execWithTimeoutSync(execCommand, EXECUTION_TIMEOUT_MS, 'Execution timed out');
        
        // Clean up generated files and directory after execution
        fs.rmSync(uniqueDir, { recursive: true });
        res.status(200).json({ output, is_error: false });
      } catch (error) {
        // Clean up generated files and directory after execution
        fs.rmSync(uniqueDir, { recursive: true });
        res.status(200).json({ output: error.message, is_error: true });
      }
    } else {
      // For other languages, execute immediately
      try {
        const output = execWithTimeoutSync(execCommand, EXECUTION_TIMEOUT_MS, 'Execution timed out');
        
        // Clean up generated files and directory after execution
        fs.rmSync(uniqueDir, { recursive: true });
        res.status(200).json({ output, is_error: false });
      } catch (error) {
        // Clean up generated files and directory after execution
        fs.rmSync(uniqueDir, { recursive: true });
        res.status(200).json({ output: error.message, is_error: true });
      }
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Unknown server error' });
  }
};

module.exports = { executeCode };