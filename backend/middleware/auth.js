const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query('SELECT id, organization_id, role_id FROM admins WHERE id = ?', [decoded.adminId]);
    if (rows.length === 0) throw new Error();
    req.admin = rows[0];
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};