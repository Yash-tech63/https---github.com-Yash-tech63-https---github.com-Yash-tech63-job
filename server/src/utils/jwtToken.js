const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'c8f5e71d3a9b42e6801934f826d7c1a5b4e9f0128374650192837465abcde123', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'c8f5e71d3a9b42e6801934f826d7c1a5b4e9f0128374650192837465abcde123');
};

module.exports = {
  generateToken,
  verifyToken
};
