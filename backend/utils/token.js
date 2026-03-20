const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (adminId) => {
  return jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

module.exports = { generateToken, generateVerificationCode };