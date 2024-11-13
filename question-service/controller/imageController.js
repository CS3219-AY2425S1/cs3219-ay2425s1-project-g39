import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // Limit to 2MB
});

export const uploadImage = async (req, res) => {
  // Use the Multer upload function, but wrap it in a custom error handling logic
  upload.single('img')(req, res, function (err) {
    // Handle Multer-specific errors
    if (err instanceof multer.MulterError) {
      // Multer error occurred (like file size too large, etc.)
      return res.status(400).json({ message: `File Error: ${err.message}` });
    } else if (err) {
      // Other non-Multer errors
      return res.status(500).json({ message: `Error: ${err.message}` });
    }

    // Handle cases where no file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // If everything is good, return the uploaded file info
    return res.status(200).json(req.file);
  });
};

export const getImage = async (req, res) => {
  const fileName = req.params.filename;
  const filePath = `./uploads/${fileName}`;

  // Check if file exists
  res.sendFile(filePath, { root: '.' }, function (err) {
    if (err) {
      res.status(404).json({ message: 'Image not found' });
    }
  });
}