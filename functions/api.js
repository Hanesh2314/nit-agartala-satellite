const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const app = express();

// Import your routes here
// const { registerRoutes } = require('../server/routes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/.netlify/functions/api', (req, res) => {
  res.json({
    message: 'Research Satellite API is running!',
    timestamp: new Date().toISOString(),
  });
});

// Direct all other API routes
app.all('/.netlify/functions/api/*', (req, res) => {
  // This will be replaced with actual route handlers
  res.status(404).json({ 
    error: 'Route not implemented yet',
    path: req.path
  });
});

// Export the serverless function
module.exports.handler = serverless(app);