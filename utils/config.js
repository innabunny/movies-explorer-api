const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;
const JWT_KEY = process.env.JWT_KEY || 'dev-key';
const MONGODB_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = {
  PORT,
  JWT_KEY,
  MONGODB_URL,
};
