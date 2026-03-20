const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const transporter = require('../config/mailer');
const upload = require('../middleware/upload');
const { generateToken, generateVerificationCode } = require('../utils/token');
const generateApiKey = require('../utils/apiKey');
const { registerEmail, resetPasswordEmail } = require('../utils/emailTemplates');

// Registration (admin + organization)
router.post('/register', upload.single('profileImage'), async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { firstName, lastName, username, email, password, phone, orgName, orgInfo, orgType, orgAddress, orgContactEmail, orgContactPhone, apiKeyManual } = req.body;

    // Check if email or username already exists
    const [existing] = await connection.query('SELECT id FROM admins WHERE email = ? OR username = ?', [email, username]);
    if (existing.length) {
      await connection.rollback();
      return res.status(400).json({ message: 'Email or username already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate API key (either manual or auto)
    const apiKey = apiKeyManual || generateApiKey();

    // Create organization
    const [orgResult] = await connection.query(
      'INSERT INTO organizations (org_name, address, type, contact_email, contact_phone, api_page, subscription_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [orgName, orgAddress, orgType, orgContactEmail, orgContactPhone, apiKey, 'inactive']
    );
    const orgId = orgResult.insertId;

    // Generate verification code
    const code = generateVerificationCode();
    const codeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Profile image path
    const profile = req.file ? req.file.filename : 'default.jpg';

    // Create admin (assign default role 'basic_admin' – assume role_id 1 exists)
    const [adminResult] = await connection.query(
      `INSERT INTO admins (organization_id, role_id, first_name, last_name, profile, username, email, password_hash, verification_code, code_expiry_time, is_verified)
       VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [orgId, firstName, lastName, profile, username, email, hashedPassword, code, codeExpiry]
    );
    const adminId = adminResult.insertId;

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      html: registerEmail(firstName, code)
    });

    await connection.commit();
    res.status(201).json({ message: 'Registration successful. Please verify your email.', adminId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

// Email verification
router.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  try {
    const [rows] = await db.query(
      'SELECT id, verification_code, code_expiry_time FROM admins WHERE email = ? AND is_verified = 0',
      [email]
    );
    if (rows.length === 0) return res.status(400).json({ message: 'Invalid or already verified' });

    const admin = rows[0];
    if (admin.verification_code !== code) return res.status(400).json({ message: 'Invalid code' });
    if (new Date() > new Date(admin.code_expiry_time)) return res.status(400).json({ message: 'Code expired' });

    await db.query('UPDATE admins SET is_verified = 1, verification_code = NULL, code_expiry_time = NULL WHERE id = ?', [admin.id]);
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  try {
    const [rows] = await db.query(
      'SELECT id, organization_id, role_id, password_hash, is_verified, account_locked_until, failed_login_attempts FROM admins WHERE email = ? OR username = ?',
      [usernameOrEmail, usernameOrEmail]
    );
    if (rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const admin = rows[0];

    // Check account lock
    if (admin.account_locked_until && new Date() < new Date(admin.account_locked_until)) {
      return res.status(403).json({ message: 'Account locked. Try later.' });
    }

    // Verify password
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      // Increment failed attempts
      const attempts = admin.failed_login_attempts + 1;
      let lockUntil = null;
      if (attempts >= 5) lockUntil = new Date(Date.now() + 15 * 60 * 1000); // lock 15 min
      await db.query(
        'UPDATE admins SET failed_login_attempts = ?, account_locked_until = ? WHERE id = ?',
        [attempts, lockUntil, admin.id]
      );
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check verified
    if (!admin.is_verified) return res.status(403).json({ message: 'Email not verified' });

    // Reset failed attempts
    await db.query('UPDATE admins SET failed_login_attempts = 0, account_locked_until = NULL, last_login = NOW() WHERE id = ?', [admin.id]);

    // Generate token
    const token = generateToken(admin.id);

    // Create session
    await db.query(
      'INSERT INTO admin_sessions (admin_id, session_token, expires_at, ip_address, user_agent) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY), ?, ?)',
      [admin.id, token, req.ip, req.headers['user-agent']]
    );

    res.json({ token, adminId: admin.id, organizationId: admin.organization_id, roleId: admin.role_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot password – send code
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await db.query('SELECT id, first_name FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ message: 'No account with that email' });

    const admin = rows[0];
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.query(
      'INSERT INTO password_reset_tokens (admin_user_id, token, expires_at) VALUES (?, ?, ?)',
      [admin.id, code, expiresAt]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      html: resetPasswordEmail(admin.first_name, code)
    });

    res.json({ message: 'Reset code sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    // Get admin id
    const [adminRows] = await db.query('SELECT id FROM admins WHERE email = ?', [email]);
    if (adminRows.length === 0) return res.status(404).json({ message: 'User not found' });
    const adminId = adminRows[0].id;

    // Verify token
    const [tokenRows] = await db.query(
      'SELECT id FROM password_reset_tokens WHERE admin_user_id = ? AND token = ? AND expires_at > NOW() AND used = 0',
      [adminId, code]
    );
    if (tokenRows.length === 0) return res.status(400).json({ message: 'Invalid or expired code' });

    // Update password
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE admins SET password_hash = ?, last_password_change = NOW() WHERE id = ?', [hashed, adminId]);

    // Mark token as used
    await db.query('UPDATE password_reset_tokens SET used = 1 WHERE id = ?', [tokenRows[0].id]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;