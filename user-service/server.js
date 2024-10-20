const app = require('./app');

// Start server
const PORT = process.env.USER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
