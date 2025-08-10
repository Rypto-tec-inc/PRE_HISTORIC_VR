const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserAchievement = sequelize.define('UserAchievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  achievementId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'achievements',
      key: 'id'
    }
  },
  earnedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  progress: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  metadata: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('metadata');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('metadata', JSON.stringify(value || {}));
    }
  },
  isHidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'user_achievements',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'achievementId']
    }
  ]
});

module.exports = UserAchievement; 