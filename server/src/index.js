require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes and database
const { init } = require('./config/database');

// Initialize database
init();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const labelRoutes = require('./routes/labels');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/labels', labelRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5002;
const HOST = '0.0.0.0'; // Listen on all interfaces for Docker

app.listen(PORT, HOST, () => {
  console.log(`Label Maker Server is running on ${HOST}:${PORT}`);
}); 
