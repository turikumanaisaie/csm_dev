// // routes/device.js
// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
// const auth = require('../middleware/auth');
// const upload = require('../middleware/upload');

// // @route   GET /api/devices
// // @desc    Get all devices for organization
// // @access  Private
// router.get('/', auth, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       `SELECT d.*, a.first_name as added_by_name
//        FROM devices d
//        LEFT JOIN admins a ON d.added_by = a.id
//        WHERE d.organization_id = ?
//        ORDER BY d.added_at DESC`,
//       [req.admin.organization_id]
//     );
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/devices
// // @desc    Add a new device
// // @access  Private
// router.post('/', auth, upload.single('device_image'), async (req, res) => {
//   const { device_name, unique_device_id, device_type } = req.body;
//   const device_image = req.file ? req.file.filename : null;

//   if (!device_name || !unique_device_id || !device_type) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     // Check if device_id already exists
//     const [existing] = await db.query('SELECT id FROM devices WHERE unique_device_id = ?', [unique_device_id]);
//     if (existing.length > 0) {
//       return res.status(400).json({ message: 'Device with that unique ID already exists' });
//     }

//     const [result] = await db.query(
//       `INSERT INTO devices (organization_id, device_name, device_image, unique_device_id, device_type, added_by, status)
//        VALUES (?, ?, ?, ?, ?, ?, 'inactive')`,
//       [req.admin.organization_id, device_name, device_image, unique_device_id, device_type, req.admin.id]
//     );

//     // Also insert initial status record
//     await db.query(
//       'INSERT INTO device_status (device_id, status, is_online) VALUES (?, 0, 0)',
//       [result.insertId]
//     );

//     res.status(201).json({ id: result.insertId, message: 'Device added' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   GET /api/devices/:id
// // @desc    Get single device details with latest status and location
// // @access  Private
// router.get('/:id', auth, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [deviceRows] = await db.query(
//       'SELECT * FROM devices WHERE id = ? AND organization_id = ?',
//       [id, req.admin.organization_id]
//     );
//     if (deviceRows.length === 0) {
//       return res.status(404).json({ message: 'Device not found' });
//     }
//     const device = deviceRows[0];

//     // Get latest status
//     const [statusRows] = await db.query(
//       'SELECT * FROM device_status WHERE device_id = ? ORDER BY changed_at DESC LIMIT 1',
//       [id]
//     );
//     device.latest_status = statusRows[0] || null;

//     // Get latest location
//     const [locationRows] = await db.query(
//       'SELECT * FROM device_locations WHERE device_id = ? ORDER BY recorded_at DESC LIMIT 1',
//       [id]
//     );
//     device.latest_location = locationRows[0] || null;

//     res.json(device);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   PUT /api/devices/:id
// // @desc    Update device details
// // @access  Private
// router.put('/:id', auth, upload.single('device_image'), async (req, res) => {
//   const { id } = req.params;
//   const { device_name, device_type, status } = req.body;
//   const device_image = req.file ? req.file.filename : undefined;

//   try {
//     // Verify device belongs to org
//     const [deviceRows] = await db.query(
//       'SELECT id FROM devices WHERE id = ? AND organization_id = ?',
//       [id, req.admin.organization_id]
//     );
//     if (deviceRows.length === 0) {
//       return res.status(404).json({ message: 'Device not found' });
//     }

//     const updates = [];
//     const values = [];
//     if (device_name) { updates.push('device_name = ?'); values.push(device_name); }
//     if (device_type) { updates.push('device_type = ?'); values.push(device_type); }
//     if (status) { updates.push('status = ?'); values.push(status); }
//     if (device_image) { updates.push('device_image = ?'); values.push(device_image); }

//     if (updates.length === 0) {
//       return res.status(400).json({ message: 'No fields to update' });
//     }

//     values.push(id);
//     await db.query(`UPDATE devices SET ${updates.join(', ')} WHERE id = ?`, values);

//     res.json({ message: 'Device updated' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   DELETE /api/devices/:id
// // @desc    Delete a device (cascade will remove status, locations)
// // @access  Private
// router.delete('/:id', auth, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [result] = await db.query(
//       'DELETE FROM devices WHERE id = ? AND organization_id = ?',
//       [id, req.admin.organization_id]
//     );
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Device not found' });
//     }
//     res.json({ message: 'Device deleted' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/devices/:id/location
// // @desc    Report device location (could be used by device itself)
// // @access  Public or authenticated? For now, require auth for simplicity
// router.post('/:id/location', auth, async (req, res) => {
//   const { id } = req.params;
//   const { latitude, longitude } = req.body;

//   if (!latitude || !longitude) {
//     return res.status(400).json({ message: 'Latitude and longitude required' });
//   }

//   try {
//     // Verify device belongs to org (optional, could be open for device updates with API key)
//     // We'll require auth for now
//     await db.query(
//       'INSERT INTO device_locations (device_id, latitude, longitude) VALUES (?, ?, ?)',
//       [id, latitude, longitude]
//     );
//     res.status(201).json({ message: 'Location recorded' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/devices/:id/status
// // @desc    Update device online status
// router.post('/:id/status', auth, async (req, res) => {
//   const { id } = req.params;
//   const { is_online } = req.body; // boolean

//   try {
//     // Optionally verify device
//     await db.query(
//       'INSERT INTO device_status (device_id, status, is_online, last_seen) VALUES (?, ?, ?, NOW())',
//       [id, is_online ? 1 : 0, is_online]
//     );
//     // Also update last_seen in devices table
//     await db.query('UPDATE devices SET last_seen = NOW() WHERE id = ?', [id]);
//     res.json({ message: 'Status updated' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


// routes/device.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/devices
// @desc    Get all devices for organization
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.*, a.first_name as added_by_name
       FROM devices d
       LEFT JOIN admins a ON d.added_by = a.id
       WHERE d.organization_id = ?
       ORDER BY d.added_at DESC`,
      [req.admin.organization_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/devices
// @desc    Add a new device
// @access  Private
router.post('/', auth, upload.single('device_image'), async (req, res) => {
  const { device_name, unique_device_id, device_type } = req.body;
  const device_image = req.file ? req.file.filename : null;

  if (!device_name || !unique_device_id || !device_type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if device_id already exists
    const [existing] = await db.query('SELECT id FROM devices WHERE unique_device_id = ?', [unique_device_id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Device with that unique ID already exists' });
    }

    const [result] = await db.query(
      `INSERT INTO devices (organization_id, device_name, device_image, unique_device_id, device_type, added_by, status)
       VALUES (?, ?, ?, ?, ?, ?, 'inactive')`,
      [req.admin.organization_id, device_name, device_image, unique_device_id, device_type, req.admin.id]
    );

    // Also insert initial status record
    await db.query(
      'INSERT INTO device_status (device_id, status, is_online) VALUES (?, 0, 0)',
      [result.insertId]
    );

    res.status(201).json({ id: result.insertId, message: 'Device added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/devices/:id
// @desc    Get single device details with latest status and location
// @access  Private
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const [deviceRows] = await db.query(
      'SELECT * FROM devices WHERE id = ? AND organization_id = ?',
      [id, req.admin.organization_id]
    );
    if (deviceRows.length === 0) {
      return res.status(404).json({ message: 'Device not found' });
    }
    const device = deviceRows[0];

    // Get latest status
    const [statusRows] = await db.query(
      'SELECT * FROM device_status WHERE device_id = ? ORDER BY changed_at DESC LIMIT 1',
      [id]
    );
    device.latest_status = statusRows[0] || null;

    // Get latest location
    const [locationRows] = await db.query(
      'SELECT * FROM device_locations WHERE device_id = ? ORDER BY recorded_at DESC LIMIT 1',
      [id]
    );
    device.latest_location = locationRows[0] || null;

    res.json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/devices/:id
// @desc    Update device details
// @access  Private
router.put('/:id', auth, upload.single('device_image'), async (req, res) => {
  const { id } = req.params;
  const { device_name, device_type, status } = req.body;
  const device_image = req.file ? req.file.filename : undefined;

  try {
    // Verify device belongs to org
    const [deviceRows] = await db.query(
      'SELECT id FROM devices WHERE id = ? AND organization_id = ?',
      [id, req.admin.organization_id]
    );
    if (deviceRows.length === 0) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const updates = [];
    const values = [];
    if (device_name) { updates.push('device_name = ?'); values.push(device_name); }
    if (device_type) { updates.push('device_type = ?'); values.push(device_type); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (device_image) { updates.push('device_image = ?'); values.push(device_image); }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);
    await db.query(`UPDATE devices SET ${updates.join(', ')} WHERE id = ?`, values);

    res.json({ message: 'Device updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/devices/:id
// @desc    Delete a device (cascade will remove status, locations)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM devices WHERE id = ? AND organization_id = ?',
      [id, req.admin.organization_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json({ message: 'Device deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/devices/:id/location
// @desc    Report device location
// @access  Private (could be made public with API key in future)
router.post('/:id/location', auth, async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude required' });
  }

  try {
    await db.query(
      'INSERT INTO device_locations (device_id, latitude, longitude) VALUES (?, ?, ?)',
      [id, latitude, longitude]
    );
    res.status(201).json({ message: 'Location recorded' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/devices/:id/status
// @desc    Update device online status
router.post('/:id/status', auth, async (req, res) => {
  const { id } = req.params;
  const { is_online } = req.body; // boolean

  try {
    await db.query(
      'INSERT INTO device_status (device_id, status, is_online, last_seen) VALUES (?, ?, ?, NOW())',
      [id, is_online ? 1 : 0, is_online]
    );
    // Also update last_seen in devices table
    await db.query('UPDATE devices SET last_seen = NOW() WHERE id = ?', [id]);
    res.json({ message: 'Status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;