const express = require('express');
const cors = require('cors');
const path = require('path');
const TechFrameworkDB = require('../index');

// Import routes
const analyzeRoutes = require('../routes/analyzeRoutes');

const app = express();
const db = new TechFrameworkDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.text({ type: 'text/plain' })); // For text/plain content type

// Initialize database
let dbInitialized = false;

async function initializeServer() {
  try {
    dbInitialized = await db.initialize();
    if (!dbInitialized) {
      console.warn('Database initialization completed with warnings. Some features may be limited.');
    }
  } catch (error) {
    console.error('Error initializing database:', error.message);
    console.warn('Server is starting with limited functionality.');
  }
  return { app, db };
}

// Export the initialization function and app instance
module.exports = { initializeServer, app, db };

// API Routes
app.use('/api/analyze', analyzeRoutes);

// Existing framework routes
app.get('/frameworks', async (req, res) => {
  try {
    const { category, minScore, realtimeSupport, search } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (minScore) filters.minScore = parseInt(minScore);
    if (realtimeSupport === 'true') filters.realtimeSupport = true;
    
    const results = await db.searchFrameworks(search || '', filters);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/frameworks/categories', async (req, res) => {
  try {
    const categories = ['frontend', 'backend', 'fullstack', 'mobile', 'database', 'devops'];
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/frameworks', async (req, res) => {
  try {
    const result = await db.processFramework(req.body);
    if (result.success) {
      res.json({ success: true, data: result.framework });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/frameworks/similar/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const results = await db.searchFrameworks(name, {});
    const similar = results.filter(r => r.name !== name).slice(0, 5);
    res.json({ success: true, data: similar });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
});