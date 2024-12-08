// routes/admin.js
const express = require('express');
const bcrypt = require('bcrypt');
const AdminUser = require('../models/adminUser');
const verifyAdmin = require('../middleware/auth');

const router = express.Router();

// Add a new admin user (only accessible by an existing admin)
router.post('/admin/add-user', verifyAdmin, async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingAdmin = await AdminUser.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new admin user
    const newAdmin = new AdminUser({
      username,
      password: hashedPassword,
      role: 'admin'
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
