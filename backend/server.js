const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl requests, etc.)
    if (!origin) return callback(null, true);

    // Allow any origin in production, localhost in development
    const allowedOrigins = [
      'http://localhost:4200', // Angular dev server
      'http://localhost:3000', // Alternative dev port
      'https://your-portfolio.onrender.com', // Replace with your actual Render URL
      // Add your custom domain here when you have one
    ];

    // In development, allow localhost. In production, be more restrictive
    const isDevelopment = process.env.NODE_ENV !== 'production';

    if (isDevelopment && origin.includes('localhost')) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin) || origin.includes('onrender.com')) {
      return callback(null, true);
    }

    // For stricter security, uncomment this line after deployment:
    // callback(new Error('Not allowed by CORS'));
    callback(null, true); // Temporarily allow all for deployment
  },
  credentials: true
}));
app.use(express.json());

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, 'data')));

// Import data
const projects = require('./data/projects.json');
const skills = require('./data/skills.json');
const experience = require('./data/experience.json');

// API Routes
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/skills', (req, res) => {
  res.json(skills);
});

app.get('/api/experience', (req, res) => {
  res.json(experience);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Endpoint ${req.path} does not exist`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio API server running on port ${PORT}`);
  console.log(`📱 Frontend should be accessible at http://localhost:4200`);
  console.log(`🔗 API endpoints:`);
  console.log(`   • GET /api/projects`);
  console.log(`   • GET /api/skills`);
  console.log(`   • GET /api/experience`);
  console.log(`   • GET /api/health`);
});
