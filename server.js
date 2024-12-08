//server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const reelsRoutes = require('./routes/reels');
const vfxsRoutes = require('./routes/vfxs');
const reelsDetailsRoutes = require('./routes/reelsDetails');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables.');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());



// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// API Routes
app.use('/api/reels', reelsRoutes);
app.use('/api/reels-details', reelsDetailsRoutes);
app.use('/api/vfx', vfxsRoutes);
console.log('Loading routes...');
app.use('/api', authRoutes); // Log message before adding routes
console.log('Routes loaded successfully');
app.use('/api', adminRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Backend is running!');
});
