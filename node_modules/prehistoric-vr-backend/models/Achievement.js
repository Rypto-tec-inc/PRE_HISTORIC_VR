const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Exploration', 'Learning', 'Cultural', 'VR', 'Social', 'Special'),
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  criteria: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const value = this.getDataValue('criteria');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('criteria', JSON.stringify(value || {}));
    }
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('requirements');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('requirements', JSON.stringify(value || []));
    }
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rarity: {
    type: DataTypes.ENUM('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'),
    defaultValue: 'Common'
  },
  tribe: {
    type: DataTypes.STRING,
    allowNull: true
  },
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard', 'Expert'),
    defaultValue: 'Easy'
  },
  estimatedTime: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true
  },
  prerequisites: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('prerequisites');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('prerequisites', JSON.stringify(value || []));
    }
  },
  rewards: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('rewards');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('rewards', JSON.stringify(value || {}));
    }
  },
  visibility: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  unlockDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalEarned: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completionRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'achievements',
  timestamps: true
});

// Instance method to check if user can earn this achievement
Achievement.prototype.canUserEarn = function(userProgress) {
  const criteria = this.criteria;
  
  // Check prerequisites
  if (this.prerequisites && this.prerequisites.length > 0) {
    for (const prereq of this.prerequisites) {
      if (!userProgress.userAchievements.includes(prereq)) {
        return false;
      }
    }
  }
  
  // Check specific criteria
  if (criteria.vrExperiences && userProgress.vrExperiencesCompleted.length < criteria.vrExperiences) {
    return false;
  }
  
  if (criteria.tribesVisited && userProgress.tribesVisited.length < criteria.tribesVisited) {
    return false;
  }
  
  if (criteria.artifactsViewed && userProgress.artifactsViewed.length < criteria.artifactsViewed) {
    return false;
  }
  
  if (criteria.learningTime && userProgress.totalLearningTime < criteria.learningTime) {
    return false;
  }
  
  return true;
};

// Instance method to increment total earned
Achievement.prototype.incrementEarned = async function() {
  this.totalEarned += 1;
  await this.save();
  return this.totalEarned;
};

module.exports = Achievement; 