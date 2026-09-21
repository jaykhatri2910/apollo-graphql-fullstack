const jwt = require('jsonwebtoken');

const getUser = (token) => {
  if (token) {
    try {
      // Bearer token
      const tokenString = token.replace('Bearer ', '');
      return jwt.verify(tokenString, process.env.JWT_SECRET || 'supersecretkey123');
    } catch (err) {
      return null;
    }
  }
  return null;
};

module.exports = { getUser };
