const app = require('./app');

// Start server
const PORT = process.env.HISTORY_PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
