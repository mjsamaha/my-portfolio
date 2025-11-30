const functions = require('firebase-functions');
const path = require('path');
const fs = require('fs');

// Serve projects.json as an HTTP function
exports.projects = functions.https.onRequest((req, res) => {
  try {
    // Attempt to load data from functions/data/projects.json
    const dataPath = path.join(__dirname, 'data', 'projects.json');
    if (fs.existsSync(dataPath)) {
      const projects = require(dataPath);
      res.json(projects);
      return;
    }

    // Fallback: attempt to load from hosting assets (if available)
    const altPath = path.join(process.cwd(), 'dist', 'assets', 'data', 'projects.json');
    if (fs.existsSync(altPath)) {
      const projects = require(altPath);
      res.json(projects);
      return;
    }

    res.status(404).json({ error: 'projects data not found' });
  } catch (err) {
    console.error('Error serving projects:', err);
    res.status(500).json({ error: 'internal error' });
  }
});
