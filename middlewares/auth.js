const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const AuthErr = require('../errors/AuthErr');

const { JWT_SECRET = config.JWT_KEY } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthErr('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthErr('Необходима авторизация');
  }

  req.user = payload;
  next();
  return req.user;
};
