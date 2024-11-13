const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  PORT: process.env.COLLAB_PORT || 8443,
  SSL_KEY: process.env.COMM_SSL_KEY,
  SSL_CERT: process.env.COMM_SSL_CERT,
  JWT_SECRET: process.env.JWT_SECRET,
  HTTP_OR_HTTPS: process.env.COLLAB_HTTP_OR_HTTPS || 'http',
  SERVE_FE: process.env.COLLAB_SERVE_FE || 'false',
  JWT_SECRET: process.env.JWT_SECRET,
};
