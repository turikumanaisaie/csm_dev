// // routes/admin.js
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const db = require('../config/db');
// const auth = require('../middleware/auth');
// const upload = require('../middleware/upload');

// // @route   GET /api/admin/me
// // @desc    Get current admin profile
// // @access  Private
// router.get('/me', auth, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       `SELECT id, first_name, last_name, profile, username, email, is_verified, last_login, created_at
//        FROM admins WHERE id = ?`,
//       [req.admin.id]
//     );
//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }
//     res.json(rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   PUT /api/admin/me
// // @desc    Update admin profile (name, username, email, profile image)
// // @access  Private
// router.put('/me', auth, upload.single('profile'), async (req, res) => {
//   const { first_name, last_name, username, email } = req.body;
//   const profile = req.file ? req.file.filename : undefined;

//   try {
//     // Check if username or email already taken by another admin
//     if (username || email) {
//       const [existing] = await db.query(
//         'SELECT id FROM admins WHERE (username = ? OR email = ?) AND id != ?',
//         [username || '', email || '', req.admin.id]
//       );
//       if (existing.length > 0) {
//         return res.status(400).json({ message: 'Username or email already in use' });
//       }
//     }

//     const updates = [];
//     const values = [];
//     if (first_name) { updates.push('first_name = ?'); values.push(first_name); }
//     if (last_name) { updates.push('last_name = ?'); values.push(last_name); }
//     if (username) { updates.push('username = ?'); values.push(username); }
//     if (email) { updates.push('email = ?'); values.push(email); }
//     if (profile) { updates.push('profile = ?'); values.push(profile); }

//     if (updates.length === 0) {
//       return res.status(400).json({ message: 'No fields to update' });
//     }

//     values.push(req.admin.id);
//     await db.query(`UPDATE admins SET ${updates.join(', ')} WHERE id = ?`, values);

//     res.json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/admin/change-password
// // @desc    Change password
// // @access  Private
// router.post('/change-password', auth, async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   if (!currentPassword || !newPassword) {
//     return res.status(400).json({ message: 'Please provide current and new password' });
//   }

//   try {
//     const [rows] = await db.query('SELECT password_hash FROM admins WHERE id = ?', [req.admin.id]);
//     const admin = rows[0];

//     const match = await bcrypt.compare(currentPassword, admin.password_hash);
//     if (!match) {
//       return res.status(400).json({ message: 'Current password is incorrect' });
//     }

//     const hashed = await bcrypt.hash(newPassword, 10);
//     await db.query('UPDATE admins SET password_hash = ?, last_password_change = NOW() WHERE id = ?', [hashed, req.admin.id]);

//     res.json({ message: 'Password changed successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   GET /api/admin/sessions
// // @desc    Get active sessions for the admin
// // @access  Private
// router.get('/sessions', auth, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       `SELECT id, login_at, ip_address, user_agent, expires_at
//        FROM admin_sessions
//        WHERE admin_id = ? AND logout_at IS NULL AND expires_at > NOW()
//        ORDER BY login_at DESC`,
//       [req.admin.id]
//     );
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/admin/logout
// // @desc    Logout from current session
// // @access  Private
// router.post('/logout', auth, async (req, res) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   try {
//     await db.query(
//       'UPDATE admin_sessions SET logout_at = NOW() WHERE admin_id = ? AND session_token = ?',
//       [req.admin.id, token]
//     );
//     res.json({ message: 'Logged out successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

// routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/admin/me
// @desc    Get current admin profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, first_name, last_name, profile, username, email, is_verified, last_login, created_at
       FROM admins WHERE id = ?`,
      [req.admin.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/me
// @desc    Update admin profile (name, username, email, profile image)
// @access  Private
router.put('/me', auth, upload.single('profile'), async (req, res) => {
  const { first_name, last_name, username, email } = req.body;
  const profile = req.file ? req.file.filename : undefined;

  try {
    // Check if username or email already taken by another admin
    if (username || email) {
      const [existing] = await db.query(
        'SELECT id FROM admins WHERE (username = ? OR email = ?) AND id != ?',
        [username || '', email || '', req.admin.id]
      );
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Username or email already in use' });
      }
    }

    const updates = [];
    const values = [];
    if (first_name) { updates.push('first_name = ?'); values.push(first_name); }
    if (last_name) { updates.push('last_name = ?'); values.push(last_name); }
    if (username) { updates.push('username = ?'); values.push(username); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (profile) { updates.push('profile = ?'); values.push(profile); }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(req.admin.id);
    await db.query(`UPDATE admins SET ${updates.join(', ')} WHERE id = ?`, values);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/change-password
// @desc    Change password
// @access  Private
router.post('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide current and new password' });
  }

  try {
    const [rows] = await db.query('SELECT password_hash FROM admins WHERE id = ?', [req.admin.id]);
    const admin = rows[0];

    const match = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!match) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE admins SET password_hash = ?, last_password_change = NOW() WHERE id = ?', [hashed, req.admin.id]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/sessions
// @desc    Get active sessions for the admin
// @access  Private
router.get('/sessions', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, login_at, ip_address, user_agent, expires_at
       FROM admin_sessions
       WHERE admin_id = ? AND logout_at IS NULL AND expires_at > NOW()
       ORDER BY login_at DESC`,
      [req.admin.id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/logout
// @desc    Logout from current session
// @access  Private
router.post('/logout', auth, async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  try {
    await db.query(
      'UPDATE admin_sessions SET logout_at = NOW() WHERE admin_id = ? AND session_token = ?',
      [req.admin.id, token]
    );
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;