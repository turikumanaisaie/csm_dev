// // routes/attendance.js
// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
// const auth = require('../middleware/auth');

// // @route   GET /api/attendance
// // @desc    Get all attendance records for organization (with optional filters)
// // @access  Private
// router.get('/', auth, async (req, res) => {
//   const orgId = req.admin.organization_id;
//   const { startDate, endDate, userId, deviceId } = req.query;

//   let query = `
//     SELECT a.*, u.first_name, u.last_name, u.role, d.device_name
//     FROM attendance a
//     JOIN users u ON a.user_id = u.id
//     JOIN devices d ON a.device_id = d.id
//     WHERE u.organization_id = ?
//   `;
//   const params = [orgId];

//   if (startDate) {
//     query += ' AND DATE(a.timestamp) >= ?';
//     params.push(startDate);
//   }
//   if (endDate) {
//     query += ' AND DATE(a.timestamp) <= ?';
//     params.push(endDate);
//   }
//   if (userId) {
//     query += ' AND a.user_id = ?';
//     params.push(userId);
//   }
//   if (deviceId) {
//     query += ' AND a.device_id = ?';
//     params.push(deviceId);
//   }

//   query += ' ORDER BY a.timestamp DESC';

//   try {
//     const [rows] = await db.query(query, params);
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/attendance
// // @desc    Create a new attendance record (manual entry)
// // @access  Private
// router.post('/', auth, async (req, res) => {
//   const { user_id, device_id, method, status, timestamp } = req.body;
//   if (!user_id || !device_id || !method) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   // Verify user belongs to same organization
//   try {
//     const [userRows] = await db.query('SELECT organization_id FROM users WHERE id = ?', [user_id]);
//     if (userRows.length === 0 || userRows[0].organization_id !== req.admin.organization_id) {
//       return res.status(403).json({ message: 'User not in your organization' });
//     }

//     const [deviceRows] = await db.query('SELECT organization_id FROM devices WHERE id = ?', [device_id]);
//     if (deviceRows.length === 0 || deviceRows[0].organization_id !== req.admin.organization_id) {
//       return res.status(403).json({ message: 'Device not in your organization' });
//     }

//     const [result] = await db.query(
//       'INSERT INTO attendance (user_id, device_id, method, status, timestamp) VALUES (?, ?, ?, ?, ?)',
//       [user_id, device_id, method, status, timestamp || new Date()]
//     );

//     res.status(201).json({ id: result.insertId, message: 'Attendance recorded' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   PUT /api/attendance/:id
// // @desc    Update an attendance record
// // @access  Private
// router.put('/:id', auth, async (req, res) => {
//   const { id } = req.params;
//   const { method, status, timestamp } = req.body;

//   try {
//     // Verify attendance belongs to org
//     const [attRows] = await db.query(
//       `SELECT a.id FROM attendance a
//        JOIN users u ON a.user_id = u.id
//        WHERE a.id = ? AND u.organization_id = ?`,
//       [id, req.admin.organization_id]
//     );
//     if (attRows.length === 0) {
//       return res.status(404).json({ message: 'Attendance record not found' });
//     }

//     await db.query(
//       'UPDATE attendance SET method = ?, status = ?, timestamp = ? WHERE id = ?',
//       [method, status, timestamp, id]
//     );

//     res.json({ message: 'Attendance updated' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   DELETE /api/attendance/:id
// // @desc    Delete an attendance record
// // @access  Private
// router.delete('/:id', auth, async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Verify ownership
//     const [attRows] = await db.query(
//       `SELECT a.id FROM attendance a
//        JOIN users u ON a.user_id = u.id
//        WHERE a.id = ? AND u.organization_id = ?`,
//       [id, req.admin.organization_id]
//     );
//     if (attRows.length === 0) {
//       return res.status(404).json({ message: 'Attendance record not found' });
//     }

//     await db.query('DELETE FROM attendance WHERE id = ?', [id]);
//     res.json({ message: 'Attendance deleted' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


// routes/attendance.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// @route   GET /api/attendance
// @desc    Get all attendance records for organization (with optional filters)
// @access  Private
router.get('/', auth, async (req, res) => {
  const orgId = req.admin.organization_id;
  const { startDate, endDate, userId, deviceId } = req.query;

  let query = `
    SELECT a.*, u.first_name, u.last_name, u.role, d.device_name
    FROM attendance a
    JOIN users u ON a.user_id = u.id
    JOIN devices d ON a.device_id = d.id
    WHERE u.organization_id = ?
  `;
  const params = [orgId];

  if (startDate) {
    query += ' AND DATE(a.timestamp) >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND DATE(a.timestamp) <= ?';
    params.push(endDate);
  }
  if (userId) {
    query += ' AND a.user_id = ?';
    params.push(userId);
  }
  if (deviceId) {
    query += ' AND a.device_id = ?';
    params.push(deviceId);
  }

  query += ' ORDER BY a.timestamp DESC';

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/attendance
// @desc    Create a new attendance record (manual entry)
// @access  Private
router.post('/', auth, async (req, res) => {
  const { user_id, device_id, method, status, timestamp } = req.body;
  if (!user_id || !device_id || !method) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Verify user belongs to same organization
    const [userRows] = await db.query('SELECT organization_id FROM users WHERE id = ?', [user_id]);
    if (userRows.length === 0 || userRows[0].organization_id !== req.admin.organization_id) {
      return res.status(403).json({ message: 'User not in your organization' });
    }

    const [deviceRows] = await db.query('SELECT organization_id FROM devices WHERE id = ?', [device_id]);
    if (deviceRows.length === 0 || deviceRows[0].organization_id !== req.admin.organization_id) {
      return res.status(403).json({ message: 'Device not in your organization' });
    }

    const [result] = await db.query(
      'INSERT INTO attendance (user_id, device_id, method, status, timestamp) VALUES (?, ?, ?, ?, ?)',
      [user_id, device_id, method, status, timestamp || new Date()]
    );

    res.status(201).json({ id: result.insertId, message: 'Attendance recorded' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/attendance/:id
// @desc    Update an attendance record
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { method, status, timestamp } = req.body;

  try {
    // Verify attendance belongs to org
    const [attRows] = await db.query(
      `SELECT a.id FROM attendance a
       JOIN users u ON a.user_id = u.id
       WHERE a.id = ? AND u.organization_id = ?`,
      [id, req.admin.organization_id]
    );
    if (attRows.length === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await db.query(
      'UPDATE attendance SET method = ?, status = ?, timestamp = ? WHERE id = ?',
      [method, status, timestamp, id]
    );

    res.json({ message: 'Attendance updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/attendance/:id
// @desc    Delete an attendance record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    // Verify ownership
    const [attRows] = await db.query(
      `SELECT a.id FROM attendance a
       JOIN users u ON a.user_id = u.id
       WHERE a.id = ? AND u.organization_id = ?`,
      [id, req.admin.organization_id]
    );
    if (attRows.length === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await db.query('DELETE FROM attendance WHERE id = ?', [id]);
    res.json({ message: 'Attendance deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;