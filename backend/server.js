const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { testConnection, initDatabase } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:8081', 'exp://'], // Expo dev server
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Static files for images, VR models, etc.
app.use('/uploads', express.static('uploads'));

// Initialize Database
const startServer = async () => {
  try {
    // Test SQLite connection
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Initialize database tables
    await initDatabase();

    // Import Routes
    const authRoutes = require('./routes/auth');
    const userRoutes = require('./routes/users');
    const tribeRoutes = require('./routes/tribes');
    const artifactRoutes = require('./routes/artifacts');
    const vrRoutes = require('./routes/vr');
    const aiRoutes = require('./routes/ai');

    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/tribes', tribeRoutes);
    app.use('/api/artifacts', artifactRoutes);
    app.use('/api/vr', vrRoutes);
    app.use('/api/ai', aiRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({
        status: 'OK',
        message: 'PRE_HISTORIC_VR Backend is running with SQLite!',
        database: 'SQLite',
        timestamp: new Date().toISOString()
      });
    });

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Error handler
    app.use((error, req, res, next) => {
      console.error('❌ Server Error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🏛️  PRE_HISTORIC_VR Backend running on port ${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🗄️  Database: SQLite (file-based, no server required!)`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 