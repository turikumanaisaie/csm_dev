// // routes/analytics.js
// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
// const auth = require('../middleware/auth');

// // @route   GET /api/analytics/dashboard
// // @desc    Get summary data for dashboard (counts, recent activity)
// // @access  Private
// router.get('/dashboard', auth, async (req, res) => {
//   const orgId = req.admin.organization_id;

//   try {
//     // Total users (students + employees)
//     const [userCount] = await db.query(
//       'SELECT COUNT(*) as total FROM users WHERE organization_id = ? AND is_active = 1',
//       [orgId]
//     );

//     // Total devices
//     const [deviceCount] = await db.query(
//       'SELECT COUNT(*) as total FROM devices WHERE organization_id = ? AND status = "active"',
//       [orgId]
//     );

//     // Today's attendance count
//     const [attendanceToday] = await db.query(
//       `SELECT COUNT(DISTINCT user_id) as count FROM attendance a
//        JOIN users u ON a.user_id = u.id
//        WHERE u.organization_id = ? AND DATE(a.timestamp) = CURDATE()`,
//       [orgId]
//     );

//     // Recent attendance (last 10)
//     const [recentAttendance] = await db.query(
//       `SELECT a.id, a.timestamp, a.method, a.status, u.first_name, u.last_name, u.image, u.role
//        FROM attendance a
//        JOIN users u ON a.user_id = u.id
//        WHERE u.organization_id = ?
//        ORDER BY a.timestamp DESC
//        LIMIT 10`,
//       [orgId]
//     );

//     // Users by role
//     const [usersByRole] = await db.query(
//       'SELECT role, COUNT(*) as count FROM users WHERE organization_id = ? GROUP BY role',
//       [orgId]
//     );

//     // Device status summary
//     const [deviceStatus] = await db.query(
//       'SELECT status, COUNT(*) as count FROM devices WHERE organization_id = ? GROUP BY status',
//       [orgId]
//     );

//     res.json({
//       totals: {
//         users: userCount[0].total,
//         devices: deviceCount[0].total,
//         attendanceToday: attendanceToday[0].count,
//       },
//       recentAttendance,
//       usersByRole,
//       deviceStatus,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   GET /api/analytics/attendance-trend
// // @desc    Get attendance trend for the last 7 days
// // @access  Private
// router.get('/attendance-trend', auth, async (req, res) => {
//   const orgId = req.admin.organization_id;

//   try {
//     const [rows] = await db.query(
//       `SELECT DATE(timestamp) as date, COUNT(DISTINCT user_id) as count
//        FROM attendance a
//        JOIN users u ON a.user_id = u.id
//        WHERE u.organization_id = ? AND timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
//        GROUP BY DATE(timestamp)
//        ORDER BY date ASC`,
//       [orgId]
//     );
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   GET /api/analytics/popular-times
// // @desc    Get attendance by hour of day
// // @access  Private
// router.get('/popular-times', auth, async (req, res) => {
//   const orgId = req.admin.organization_id;

//   try {
//     const [rows] = await db.query(
//       `SELECT HOUR(timestamp) as hour, COUNT(*) as count
//        FROM attendance a
//        JOIN users u ON a.user_id = u.id
//        WHERE u.organization_id = ?
//        GROUP BY HOUR(timestamp)
//        ORDER BY hour`,
//       [orgId]
//     );
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

// routes/analytics.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// @route   GET /api/analytics/dashboard
// @desc    Get summary data for dashboard (counts, recent activity)
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  const orgId = req.admin.organization_id;

  try {
    // Total users (students + employees)
    const [userCount] = await db.query(
      'SELECT COUNT(*) as total FROM users WHERE organization_id = ? AND is_active = 1',
      [orgId]
    );

    // Total devices
    const [deviceCount] = await db.query(
      'SELECT COUNT(*) as total FROM devices WHERE organization_id = ? AND status = "active"',
      [orgId]
    );

    // Today's attendance count
    const [attendanceToday] = await db.query(
      `SELECT COUNT(DISTINCT user_id) as count FROM attendance a
       JOIN users u ON a.user_id = u.id
       WHERE u.organization_id = ? AND DATE(a.timestamp) = CURDATE()`,
      [orgId]
    );

    // Recent attendance (last 10)
    const [recentAttendance] = await db.query(
      `SELECT a.id, a.timestamp, a.method, a.status, u.first_name, u.last_name, u.image, u.role
       FROM attendance a
       JOIN users u ON a.user_id = u.id
       WHERE u.organization_id = ?
       ORDER BY a.timestamp DESC
       LIMIT 10`,
      [orgId]
    );

    // Users by role
    const [usersByRole] = await db.query(
      'SELECT role, COUNT(*) as count FROM users WHERE organization_id = ? GROUP BY role',
      [orgId]
    );

    // Device status summary
    const [deviceStatus] = await db.query(
      'SELECT status, COUNT(*) as count FROM devices WHERE organization_id = ? GROUP BY status',
      [orgId]
    );

    res.json({
      totals: {
        users: userCount[0].total,
        devices: deviceCount[0].total,
        attendanceToday: attendanceToday[0].count,
      },
      recentAttendance,
      usersByRole,
      deviceStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/attendance-trend
// @desc    Get attendance trend for the last 7 days
// @access  Private
router.get('/attendance-trend', auth, async (req, res) => {
  const orgId = req.admin.organization_id;

  try {
    const [rows] = await db.query(
      `SELECT DATE(timestamp) as date, COUNT(DISTINCT user_id) as count
       FROM attendance a
       JOIN users u ON a.user_id = u.id
       WHERE u.organization_id = ? AND timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(timestamp)
       ORDER BY date ASC`,
      [orgId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/popular-times
// @desc    Get attendance by hour of day
// @access  Private
router.get('/popular-times', auth, async (req, res) => {
  const orgId = req.admin.organization_id;

  try {
    const [rows] = await db.query(
      `SELECT HOUR(timestamp) as hour, COUNT(*) as count
       FROM attendance a
       JOIN users u ON a.user_id = u.id
       WHERE u.organization_id = ?
       GROUP BY HOUR(timestamp)
       ORDER BY hour`,
      [orgId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;