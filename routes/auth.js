// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AdminUser = require('../models/adminUser');

const router = express.Router();

// routes/auth.js
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      console.log('Login attempt with username:', username);
      const admin = await AdminUser.findOne({ username });
      if (!admin) {
        console.log('User not found');
        return res.status(404).json({ message: 'Invalid credentials' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        console.log('Invalid password');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { _id: admin._id, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Internal server error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


module.exports = router;
