const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cors = require('cors');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const eventsRoutes = require('./routes/events');
const productsRoutes = require('./routes/products');
const transactionsRoutes = require('./routes/transactions');
const commandRoutes = require('./routes/command');

const expectedDotenvVariables = [
  'JWT_SECRET', 
  'MONGODB_URI', 
  'PORT', 
  'ALLOWED_ORIGINS',
  'GITHUB_WEBHOOK_SECRET'
];

// Iterate and throw error if any of the expected variables are not defined
for (const variable of expectedDotenvVariables) {
  if (!process.env[variable]) {
    throw new Error(`${variable} is not defined in .env`);
  }
};

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 'http://localhost:3000',
  credentials: true,
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/api/', (req, res) => {
  res.json({ message: 'Welcome to the Fund API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/command', commandRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
