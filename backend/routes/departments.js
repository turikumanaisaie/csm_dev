// // routes/departments.js
// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
// const auth = require('../middleware/auth');

// // ---------- Departments ----------
// // @route   GET /api/departments
// // @desc    Get all departments for organization
// // @access  Private
// router.get('/', auth, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       'SELECT * FROM departments WHERE organization_id = ? ORDER BY name',
//       [req.admin.organization_id]
//     );
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/departments
// // @desc    Create a new department
// // @access  Private
// router.post('/', auth, async (req, res) => {
//   const { name } = req.body;
//   if (!name) return res.status(400).json({ message: 'Name is required' });

//   try {
//     // Check if already exists
//     const [existing] = await db.query(
//       'SELECT id FROM departments WHERE organization_id = ? AND name = ?',
//       [req.admin.organization_id, name]
//     );
//     if (existing.length > 0) {
//       return res.status(400).json({ message: 'Department already exists' });
//     }

//     const [result] = await db.query(
//       'INSERT INTO departments (organization_id, name) VALUES (?, ?)',
//       [req.admin.organization_id, name]
//     );
//     res.status(201).json({ id: result.insertId, name });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   PUT /api/departments/:id
// // @desc    Update department
// // @access  Private
// router.put('/:id', auth, async (req, res) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   try {
//     // Verify department belongs to org
//     const [deptRows] = await db.query(
//       'SELECT id FROM departments WHERE id = ? AND organization_id = ?',
//       [id, req.admin.organization_id]
//     );
//     if (deptRows.length === 0) {
//       return res.status(404).json({ message: 'Department not found' });
//     }

//     await db.query('UPDATE departments SET name = ? WHERE id = ?', [name, id]);
//     res.json({ message: 'Department updated' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   DELETE /api/departments/:id
// // @desc    Delete department
// // @access  Private
// router.delete('/:id', auth, async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Check if department is used in employee_profiles
//     const [used] = await db.query('SELECT user_id FROM employee_profiles WHERE department_id = ? LIMIT 1', [id]);
//     if (used.length > 0) {
//       return res.status(400).json({ message: 'Cannot delete department with assigned employees' });
//     }

//     const [result] = await db.query('DELETE FROM departments WHERE id = ? AND organization_id = ?', [id, req.admin.organization_id]);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Department not found' });
//     }
//     res.json({ message: 'Department deleted' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ---------- Employee Categories ----------
// // @route   GET /api/employee-categories
// // @desc    Get all employee categories
// // @access  Private
// router.get('/employee-categories', auth, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       'SELECT * FROM employee_categories WHERE organization_id = ? ORDER BY name',
//       [req.admin.organization_id]
//     );
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/employee-categories
// // @desc    Create employee category
// // @access  Private
// router.post('/employee-categories', auth, async (req, res) => {
//   const { name } = req.body;
//   if (!name) return res.status(400).json({ message: 'Name is required' });

//   try {
//     const [existing] = await db.query(
//       'SELECT id FROM employee_categories WHERE organization_id = ? AND name = ?',
//       [req.admin.organization_id, name]
//     );
//     if (existing.length > 0) {
//       return res.status(400).json({ message: 'Category already exists' });
//     }

//     const [result] = await db.query(
//       'INSERT INTO employee_categories (organization_id, name) VALUES (?, ?)',
//       [req.admin.organization_id, name]
//     );
//     res.status(201).json({ id: result.insertId, name });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // (Similarly PUT and DELETE for employee-categories – omitted for brevity, but follow same pattern)

// // ---------- Classes ----------
// // @route   GET /api/classes
// // @desc    Get all classes
// // @access  Private
// router.get('/classes', auth, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       'SELECT * FROM classes WHERE organization_id = ? ORDER BY name',
//       [req.admin.organization_id]
//     );
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/classes
// // @desc    Create class
// // @access  Private
// router.post('/classes', auth, async (req, res) => {
//   const { name } = req.body;
//   if (!name) return res.status(400).json({ message: 'Name is required' });

//   try {
//     const [existing] = await db.query(
//       'SELECT id FROM classes WHERE organization_id = ? AND name = ?',
//       [req.admin.organization_id, name]
//     );
//     if (existing.length > 0) {
//       return res.status(400).json({ message: 'Class already exists' });
//     }

//     const [result] = await db.query(
//       'INSERT INTO classes (organization_id, name) VALUES (?, ?)',
//       [req.admin.organization_id, name]
//     );
//     res.status(201).json({ id: result.insertId, name });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ---------- Sections ----------
// // @route   GET /api/sections
// // @desc    Get sections, optionally filtered by class_id
// // @access  Private
// router.get('/sections', auth, async (req, res) => {
//   const { class_id } = req.query;
//   let query = `
//     SELECT s.*, c.name as class_name
//     FROM sections s
//     JOIN classes c ON s.class_id = c.id
//     WHERE c.organization_id = ?
//   `;
//   const params = [req.admin.organization_id];
//   if (class_id) {
//     query += ' AND s.class_id = ?';
//     params.push(class_id);
//   }
//   query += ' ORDER BY c.name, s.name';

//   try {
//     const [rows] = await db.query(query, params);
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/sections
// // @desc    Create section
// // @access  Private
// router.post('/sections', auth, async (req, res) => {
//   const { class_id, name } = req.body;
//   if (!class_id || !name) return res.status(400).json({ message: 'Class ID and name required' });

//   try {
//     // Verify class belongs to org
//     const [classRows] = await db.query('SELECT id FROM classes WHERE id = ? AND organization_id = ?', [class_id, req.admin.organization_id]);
//     if (classRows.length === 0) {
//       return res.status(404).json({ message: 'Class not found' });
//     }

//     // Check uniqueness within class
//     const [existing] = await db.query(
//       'SELECT id FROM sections WHERE class_id = ? AND name = ?',
//       [class_id, name]
//     );
//     if (existing.length > 0) {
//       return res.status(400).json({ message: 'Section already exists in this class' });
//     }

//     const [result] = await db.query(
//       'INSERT INTO sections (class_id, name) VALUES (?, ?)',
//       [class_id, name]
//     );
//     res.status(201).json({ id: result.insertId, name, class_id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ---------- Trades ----------
// // @route   GET /api/trades
// // @desc    Get all trades
// // @access  Private
// router.get('/trades', auth, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       'SELECT * FROM trades WHERE organization_id = ? ORDER BY name',
//       [req.admin.organization_id]
//     );
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/trades
// // @desc    Create trade
// // @access  Private
// router.post('/trades', auth, async (req, res) => {
//   const { name } = req.body;
//   if (!name) return res.status(400).json({ message: 'Name is required' });

//   try {
//     const [existing] = await db.query(
//       'SELECT id FROM trades WHERE organization_id = ? AND name = ?',
//       [req.admin.organization_id, name]
//     );
//     if (existing.length > 0) {
//       return res.status(400).json({ message: 'Trade already exists' });
//     }

//     const [result] = await db.query(
//       'INSERT INTO trades (organization_id, name) VALUES (?, ?)',
//       [req.admin.organization_id, name]
//     );
//     res.status(201).json({ id: result.insertId, name });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

// routes/departments.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// ---------- Departments ----------
// @route   GET /api/departments
// @desc    Get all departments for organization
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM departments WHERE organization_id = ? ORDER BY name',
      [req.admin.organization_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/departments
// @desc    Create a new department
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    // Check if already exists
    const [existing] = await db.query(
      'SELECT id FROM departments WHERE organization_id = ? AND name = ?',
      [req.admin.organization_id, name]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO departments (organization_id, name) VALUES (?, ?)',
      [req.admin.organization_id, name]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Verify department belongs to org
    const [deptRows] = await db.query(
      'SELECT id FROM departments WHERE id = ? AND organization_id = ?',
      [id, req.admin.organization_id]
    );
    if (deptRows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await db.query('UPDATE departments SET name = ? WHERE id = ?', [name, id]);
    res.json({ message: 'Department updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/departments/:id
// @desc    Delete department
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if department is used in employee_profiles
    const [used] = await db.query('SELECT user_id FROM employee_profiles WHERE department_id = ? LIMIT 1', [id]);
    if (used.length > 0) {
      return res.status(400).json({ message: 'Cannot delete department with assigned employees' });
    }

    const [result] = await db.query('DELETE FROM departments WHERE id = ? AND organization_id = ?', [id, req.admin.organization_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ message: 'Department deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------- Employee Categories ----------
// @route   GET /api/employee-categories
// @desc    Get all employee categories
// @access  Private
router.get('/employee-categories', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM employee_categories WHERE organization_id = ? ORDER BY name',
      [req.admin.organization_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/employee-categories
// @desc    Create employee category
// @access  Private
router.post('/employee-categories', auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const [existing] = await db.query(
      'SELECT id FROM employee_categories WHERE organization_id = ? AND name = ?',
      [req.admin.organization_id, name]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO employee_categories (organization_id, name) VALUES (?, ?)',
      [req.admin.organization_id, name]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// (PUT and DELETE for employee-categories follow same pattern – omitted for brevity)

// ---------- Classes ----------
// @route   GET /api/classes
// @desc    Get all classes
// @access  Private
router.get('/classes', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM classes WHERE organization_id = ? ORDER BY name',
      [req.admin.organization_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/classes
// @desc    Create class
// @access  Private
router.post('/classes', auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const [existing] = await db.query(
      'SELECT id FROM classes WHERE organization_id = ? AND name = ?',
      [req.admin.organization_id, name]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Class already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO classes (organization_id, name) VALUES (?, ?)',
      [req.admin.organization_id, name]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------- Sections ----------
// @route   GET /api/sections
// @desc    Get sections, optionally filtered by class_id
// @access  Private
router.get('/sections', auth, async (req, res) => {
  const { class_id } = req.query;
  let query = `
    SELECT s.*, c.name as class_name
    FROM sections s
    JOIN classes c ON s.class_id = c.id
    WHERE c.organization_id = ?
  `;
  const params = [req.admin.organization_id];
  if (class_id) {
    query += ' AND s.class_id = ?';
    params.push(class_id);
  }
  query += ' ORDER BY c.name, s.name';

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sections
// @desc    Create section
// @access  Private
router.post('/sections', auth, async (req, res) => {
  const { class_id, name } = req.body;
  if (!class_id || !name) return res.status(400).json({ message: 'Class ID and name required' });

  try {
    // Verify class belongs to org
    const [classRows] = await db.query('SELECT id FROM classes WHERE id = ? AND organization_id = ?', [class_id, req.admin.organization_id]);
    if (classRows.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check uniqueness within class
    const [existing] = await db.query(
      'SELECT id FROM sections WHERE class_id = ? AND name = ?',
      [class_id, name]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Section already exists in this class' });
    }

    const [result] = await db.query(
      'INSERT INTO sections (class_id, name) VALUES (?, ?)',
      [class_id, name]
    );
    res.status(201).json({ id: result.insertId, name, class_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------- Trades ----------
// @route   GET /api/trades
// @desc    Get all trades
// @access  Private
router.get('/trades', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM trades WHERE organization_id = ? ORDER BY name',
      [req.admin.organization_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/trades
// @desc    Create trade
// @access  Private
router.post('/trades', auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const [existing] = await db.query(
      'SELECT id FROM trades WHERE organization_id = ? AND name = ?',
      [req.admin.organization_id, name]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Trade already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO trades (organization_id, name) VALUES (?, ?)',
      [req.admin.organization_id, name]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;