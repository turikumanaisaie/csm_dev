const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all users for the admin's organization
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, first_name, last_name, email, phone, image, role, is_active FROM users WHERE organization_id = ?',
      [req.admin.organization_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new user (student/employee)
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { firstName, lastName, email, phone, gender, role, departmentId, classId, sectionId, tradeId, rollNumber, position, categoryId } = req.body;
  const image = req.file ? req.file.filename : null;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Insert into users table
    const [userResult] = await connection.query(
      `INSERT INTO users (organization_id, first_name, last_name, email, phone, image, gender, role, added_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.admin.organization_id, firstName, lastName, email, phone, image, gender, role, req.admin.id]
    );
    const userId = userResult.insertId;

    // Insert into role-specific profile
    if (role === 'student') {
      await connection.query(
        'INSERT INTO student_profiles (user_id, class_id, section_id, trade_id, roll_number) VALUES (?, ?, ?, ?, ?)',
        [userId, classId, sectionId, tradeId, rollNumber]
      );
    } else if (role === 'employee') {
      await connection.query(
        'INSERT INTO employee_profiles (user_id, department_id, category_id, position) VALUES (?, ?, ?, ?)',
        [userId, departmentId, categoryId, position]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'User created', userId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

// Update, delete, etc.

module.exports = router;