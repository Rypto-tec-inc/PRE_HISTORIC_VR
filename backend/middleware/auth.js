const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');

// Define User model for middleware
const User = sequelize.define('User', {
  fullName: {
    type: require('sequelize').DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: require('sequelize').DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  phone: {
    type: require('sequelize').DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  password: {
    type: require('sequelize').DataTypes.STRING,
    allowNull: false
  },
  isEmailVerified: {
    type: require('sequelize').DataTypes.BOOLEAN,
    defaultValue: false
  },
  isPhoneVerified: {
    type: require('sequelize').DataTypes.BOOLEAN,
    defaultValue: false
  },
  hasCompletedOnboarding: {
    type: require('sequelize').DataTypes.BOOLEAN,
    defaultValue: false
  },
  avatar: {
    type: require('sequelize').DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid - user not found'
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    const user = await User.findByPk(decoded.userId);
    
    req.user = user || null;
    next();

  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    next();
  }
};

// Admin authentication middleware (for future use)
const requireAdmin = async (req, res, next) => {
  try {
    // For now, just pass through - implement admin logic later
    // Could check for user.role === 'admin' or similar
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};

module.exports = { auth, optionalAuth, requireAdmin }; 