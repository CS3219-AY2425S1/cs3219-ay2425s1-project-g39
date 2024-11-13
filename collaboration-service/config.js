const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  PORT: process.env.COLLAB_PORT || 8004,
  USER_SERVICE_API: process.env.USER_SERVICE_API || 'http://localhost/api/user/',
  JWT_SECRET: process.env.JWT_SECRET
};