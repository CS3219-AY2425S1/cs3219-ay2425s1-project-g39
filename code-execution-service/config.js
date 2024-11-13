const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  PORT: process.env.CODEX_PORT || 8050,
  JWT_SECRET: process.env.JWT_SECRET,
};
