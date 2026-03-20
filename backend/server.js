// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const path = require('path');

// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const orgRoutes = require('./routes/organization');
// // ... other routes
// const adminRoutes = require('./routes/admin');
// const analyticsRoutes = require('./routes/analytics');
// const attendanceRoutes = require('./routes/attendance');
// const departmentsRoutes = require('./routes/departments');
// const deviceRoutes = require('./routes/device');
// const pricingRoutes = require('./routes/pricing');

// const app = express();

// app.use(cors({ origin: process.env.FRONTEND_URL }));
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/organization', orgRoutes);
// // ...
// app.use('/api/admin', adminRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/attendance', attendanceRoutes);
// app.use('/api/departments', departmentsRoutes);
// app.use('/api/devices', deviceRoutes);
// app.use('/api/pricing', pricingRoutes);


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const attendanceRoutes = require('./routes/attendance');
const departmentRoutes = require('./routes/departments');
const deviceRoutes = require('./routes/device');
const organizationRoutes = require('./routes/organization');
const pricingRoutes = require('./routes/pricing');
const userRoutes = require('./routes/users'); // if you have it

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/users', userRoutes); // make sure this file exists

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});