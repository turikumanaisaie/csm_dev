// // routes/organization.js
// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
// const auth = require('../middleware/auth');
// const generateApiKey = require('../utils/apiKey'); // we need to create this utility

// // @route   GET /api/organization
// // @desc    Get current organization details
// // @access  Private
// router.get('/', auth, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       'SELECT * FROM organizations WHERE id = ?',
//       [req.admin.organization_id]
//     );
//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'Organization not found' });
//     }
//     res.json(rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   PUT /api/organization
// // @desc    Update organization details
// // @access  Private
// router.put('/', auth, async (req, res) => {
//   const { org_name, address, type, contact_email, contact_phone } = req.body;

//   try {
//     const updates = [];
//     const values = [];
//     if (org_name) { updates.push('org_name = ?'); values.push(org_name); }
//     if (address) { updates.push('address = ?'); values.push(address); }
//     if (type) { updates.push('type = ?'); values.push(type); }
//     if (contact_email) { updates.push('contact_email = ?'); values.push(contact_email); }
//     if (contact_phone) { updates.push('contact_phone = ?'); values.push(contact_phone); }

//     if (updates.length === 0) {
//       return res.status(400).json({ message: 'No fields to update' });
//     }

//     values.push(req.admin.organization_id);
//     await db.query(`UPDATE organizations SET ${updates.join(', ')} WHERE id = ?`, values);

//     res.json({ message: 'Organization updated' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/organization/regenerate-api-key
// // @desc    Generate a new API key for the organization
// // @access  Private
// router.post('/regenerate-api-key', auth, async (req, res) => {
//   try {
//     const newApiKey = generateApiKey();
//     await db.query('UPDATE organizations SET api_page = ? WHERE id = ?', [newApiKey, req.admin.organization_id]);
//     res.json({ api_key: newApiKey });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   GET /api/organization/subscription
// // @desc    Get subscription status
// // @access  Private
// router.get('/subscription', auth, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       'SELECT subscription_status, subscription_expires_at FROM organizations WHERE id = ?',
//       [req.admin.organization_id]
//     );
//     res.json(rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/organization/subscription
// // @desc    Update subscription (for testing, no payment)
// // @access  Private
// router.post('/subscription', auth, async (req, res) => {
//   const { plan } = req.body; // e.g., 'free_trial', 'basic', 'pro'
//   // In a real app, you'd validate plan and maybe set expiry
//   // For now, just update status to active if free trial
//   let status = 'active';
//   let expiresAt = null;
//   if (plan === 'free_trial') {
//     // set expiry to 30 days from now
//     expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
//   }
//   // You could also store selected plan in a separate table, but for simplicity we just update status

//   try {
//     await db.query(
//       'UPDATE organizations SET subscription_status = ?, subscription_expires_at = ? WHERE id = ?',
//       [status, expiresAt, req.admin.organization_id]
//     );
//     res.json({ message: `Subscribed to ${plan} plan` });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


// routes/organization.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const generateApiKey = require('../utils/apiKey');

// @route   GET /api/organization
// @desc    Get current organization details
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM organizations WHERE id = ?',
      [req.admin.organization_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/organization
// @desc    Update organization details
// @access  Private
router.put('/', auth, async (req, res) => {
  const { org_name, address, type, contact_email, contact_phone } = req.body;

  try {
    const updates = [];
    const values = [];
    if (org_name) { updates.push('org_name = ?'); values.push(org_name); }
    if (address) { updates.push('address = ?'); values.push(address); }
    if (type) { updates.push('type = ?'); values.push(type); }
    if (contact_email) { updates.push('contact_email = ?'); values.push(contact_email); }
    if (contact_phone) { updates.push('contact_phone = ?'); values.push(contact_phone); }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(req.admin.organization_id);
    await db.query(`UPDATE organizations SET ${updates.join(', ')} WHERE id = ?`, values);

    res.json({ message: 'Organization updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/organization/regenerate-api-key
// @desc    Generate a new API key for the organization
// @access  Private
router.post('/regenerate-api-key', auth, async (req, res) => {
  try {
    const newApiKey = generateApiKey();
    await db.query('UPDATE organizations SET api_page = ? WHERE id = ?', [newApiKey, req.admin.organization_id]);
    res.json({ api_key: newApiKey });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/organization/subscription
// @desc    Get subscription status
// @access  Private
router.get('/subscription', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT subscription_status, subscription_expires_at FROM organizations WHERE id = ?',
      [req.admin.organization_id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/organization/subscription
// @desc    Update subscription (for testing, no payment)
// @access  Private
router.post('/subscription', auth, async (req, res) => {
  const { plan } = req.body; // e.g., 'free_trial', 'basic', 'pro'
  let status = 'active';
  let expiresAt = null;
  if (plan === 'free_trial') {
    expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  try {
    await db.query(
      'UPDATE organizations SET subscription_status = ?, subscription_expires_at = ? WHERE id = ?',
      [status, expiresAt, req.admin.organization_id]
    );
    res.json({ message: `Subscribed to ${plan} plan` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;