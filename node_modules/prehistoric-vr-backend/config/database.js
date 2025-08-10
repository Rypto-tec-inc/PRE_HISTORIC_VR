const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite database configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: false
  }
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('🗄️  SQLite database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to SQLite database:', error);
    return false;
  }
};

// Initialize database
const initDatabase = async () => {
  try {
    // Import all models to ensure they're registered
    require('../models/index');
    
    // Create all tables
    await sequelize.sync({ force: false });
    console.log('📊 Database tables synchronized');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  initDatabase
}; 