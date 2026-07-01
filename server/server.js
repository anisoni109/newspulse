require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware — open CORS so GitHub Pages and any origin can call the API
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder'],
  credentials: false
}));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Serve Monitor Admin Dashboard STATIC files mounted at /monitor
const monitorDistPath = path.join(__dirname, '..', 'MonitorDashboard', 'dist');
if (fs.existsSync(monitorDistPath)) {
  app.use(express.static(monitorDistPath));
}

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'NewsPulse API Server Running',
    version: '1.0.0',
    endpoints: {
      stories: '/api/stories',
      adminStories: '/api/stories/admin',
      stats: '/api/stats',
      categories: '/api/categories'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 NewsPulse Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin Dashboard will be at http://localhost:3001`);
  console.log(`🔑 Default admin credentials: admin / admin123\n`);
});
