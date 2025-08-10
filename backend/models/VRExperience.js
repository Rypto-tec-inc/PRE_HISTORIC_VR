const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VRExperience = sequelize.define('VRExperience', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Cultural Tour', 'Historical Recreation', 'Artifact Exploration', 'Ceremony Simulation', 'Educational Journey'),
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    defaultValue: 'Beginner'
  },
  tribe: {
    type: DataTypes.STRING,
    allowNull: true
  },
  historicalPeriod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('location');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('location', JSON.stringify(value || {}));
    }
  },
  scene: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const value = this.getDataValue('scene');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('scene', JSON.stringify(value || {}));
    }
  },
  interactions: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('interactions');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('interactions', JSON.stringify(value || []));
    }
  },
  audio: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('audio');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('audio', JSON.stringify(value || {}));
    }
  },
  assets: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('assets');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('assets', JSON.stringify(value || {}));
    }
  },
  educational: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('educational');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('educational', JSON.stringify(value || {}));
    }
  },
  timeline: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('timeline');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('timeline', JSON.stringify(value || []));
    }
  },
  technical: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('technical');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('technical', JSON.stringify(value || {}));
    }
  },
  userExperience: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('userExperience');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('userExperience', JSON.stringify(value || {}));
    }
  },
  analytics: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('analytics');
      return value ? JSON.parse(value) : { totalViews: 0, totalCompletions: 0, averageTimeSpent: 0 };
    },
    set(value) {
      this.setDataValue('analytics', JSON.stringify(value || { totalViews: 0, totalCompletions: 0, averageTimeSpent: 0 }));
    }
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Review', 'Published', 'Archived'),
    defaultValue: 'Draft'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  visibility: {
    type: DataTypes.ENUM('Public', 'Private', 'Beta'),
    defaultValue: 'Public'
  },
  versioning: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('versioning');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('versioning', JSON.stringify(value || {}));
    }
  },
  relatedExperiences: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('relatedExperiences');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('relatedExperiences', JSON.stringify(value || []));
    }
  },
  userRatings: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('userRatings');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('userRatings', JSON.stringify(value || []));
    }
  }
}, {
  tableName: 'vr_experiences',
  timestamps: true
});

// Instance method to increment views
VRExperience.prototype.incrementViews = async function() {
  const analytics = this.analytics || { totalViews: 0, totalCompletions: 0, averageTimeSpent: 0 };
  analytics.totalViews += 1;
  this.analytics = analytics;
  await this.save();
  return analytics.totalViews;
};

// Instance method to add rating
VRExperience.prototype.addRating = async function(userId, rating, comment = '') {
  const ratings = this.userRatings || [];
  const existingIndex = ratings.findIndex(r => r.userId === userId);
  
  if (existingIndex >= 0) {
    ratings[existingIndex] = { userId, rating, comment, date: new Date() };
  } else {
    ratings.push({ userId, rating, comment, date: new Date() });
  }
  
  this.userRatings = ratings;
  await this.save();
  
  return this.averageRating;
};

// Virtual property for average rating
Object.defineProperty(VRExperience.prototype, 'averageRating', {
  get: function() {
    const ratings = this.userRatings || [];
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }
});

module.exports = VRExperience; 