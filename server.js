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
const allowedOrigins = [
  'http://localhost:4200', 
  'https://ramihajproductions-cae02.firebaseapp.com/',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true, // Allow cookies (if needed)
};

app.use(cors(corsOptions));
app.use(bodyParser.json());



// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process if DB connection fails
  });

// API Routes
console.log('Loading routes...');
app.use('/api/reels', reelsRoutes);
app.use('/api/reels-details', reelsDetailsRoutes);
app.use('/api/vfx', vfxsRoutes);
console.log('Loading routes...');
app.use('/api', authRoutes); // Log message before adding routes
console.log('Routes loaded successfully');
app.use('/api', adminRoutes);
console.log('Routes loaded successfully');

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Backend is running!',
    timestamp: new Date(),
  });
});

app.use((err, req, res, next) => {
  console.error('Unexpected error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

