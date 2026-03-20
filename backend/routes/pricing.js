// // routes/pricing.js
// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
// const auth = require('../middleware/auth');

// // @route   GET /api/pricing/plans
// // @desc    Get available pricing plans
// // @access  Public (or private)
// router.get('/plans', (req, res) => {
//   const plans = [
//     {
//       id: 'free_trial',
//       name: 'Free Trial',
//       price: 0,
//       duration: '30 days',
//       features: ['Up to 50 users', 'Basic analytics', 'Email support'],
//     },
//     {
//       id: 'basic',
//       name: 'Basic',
//       price: 29,
//       duration: 'monthly',
//       features: ['Up to 200 users', 'Advanced analytics', 'Priority support'],
//     },
//     {
//       id: 'pro',
//       name: 'Professional',
//       price: 99,
//       duration: 'monthly',
//       features: ['Unlimited users', 'Premium analytics', '24/7 support', 'API access'],
//     },
//   ];
//   res.json(plans);
// });

// // @route   GET /api/pricing/current
// // @desc    Get current organization's plan (based on subscription)
// // @access  Private
// router.get('/current', auth, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       'SELECT subscription_status, subscription_expires_at FROM organizations WHERE id = ?',
//       [req.admin.organization_id]
//     );
//     // Map status to a plan name (simple mapping)
//     let plan = 'none';
//     if (rows[0].subscription_status === 'active') {
//       // If there's an expiry, maybe it's free trial
//       if (rows[0].subscription_expires_at) {
//         plan = 'free_trial';
//       } else {
//         plan = 'basic'; // default to basic, but ideally you'd store actual plan
//       }
//     }
//     res.json({ plan, status: rows[0].subscription_status, expires_at: rows[0].subscription_expires_at });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


// routes/pricing.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// @route   GET /api/pricing/plans
// @desc    Get available pricing plans
// @access  Public
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'free_trial',
      name: 'Free Trial',
      price: 0,
      duration: '30 days',
      features: ['Up to 50 users', 'Basic analytics', 'Email support'],
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      duration: 'monthly',
      features: ['Up to 200 users', 'Advanced analytics', 'Priority support'],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 99,
      duration: 'monthly',
      features: ['Unlimited users', 'Premium analytics', '24/7 support', 'API access'],
    },
  ];
  res.json(plans);
});

// @route   GET /api/pricing/current
// @desc    Get current organization's plan (based on subscription)
// @access  Private
router.get('/current', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT subscription_status, subscription_expires_at FROM organizations WHERE id = ?',
      [req.admin.organization_id]
    );
    let plan = 'none';
    if (rows[0].subscription_status === 'active') {
      // If there's an expiry, it's likely a free trial
      if (rows[0].subscription_expires_at) {
        plan = 'free_trial';
      } else {
        plan = 'basic'; // default, but ideally you'd store actual plan
      }
    }
    res.json({ plan, status: rows[0].subscription_status, expires_at: rows[0].subscription_expires_at });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;