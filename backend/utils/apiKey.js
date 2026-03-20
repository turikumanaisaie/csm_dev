// // utils/apiKey.js
// const crypto = require('crypto');

// const generateApiKey = () => {
//   return crypto.randomBytes(20).toString('hex');
// };

// module.exports = generateApiKey;

// utils/apiKey.js
const crypto = require('crypto');

/**
 * Generate a random API key (hex string)
 * @returns {string} 40-character hex string
 */
const generateApiKey = () => {
  return crypto.randomBytes(20).toString('hex');
};

module.exports = generateApiKey;