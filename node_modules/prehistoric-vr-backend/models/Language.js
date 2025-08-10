const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Language = sequelize.define('Language', {
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
  tribe: {
    type: DataTypes.STRING,
    allowNull: false
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  history: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  alphabet: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('alphabet');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('alphabet', JSON.stringify(value || []));
    }
  },
  phrases: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('phrases');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('phrases', JSON.stringify(value || []));
    }
  },
  vocabulary: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('vocabulary');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('vocabulary', JSON.stringify(value || {}));
    }
  },
  grammar: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('grammar');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('grammar', JSON.stringify(value || {}));
    }
  },
  pronunciation: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('pronunciation');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('pronunciation', JSON.stringify(value || {}));
    }
  },
  learningModules: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('learningModules');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('learningModules', JSON.stringify(value || []));
    }
  },
  audioFiles: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('audioFiles');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('audioFiles', JSON.stringify(value || []));
    }
  },
  culturalContext: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  difficulty: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    defaultValue: 'Beginner'
  },
  estimatedLearningTime: {
    type: DataTypes.INTEGER, // in hours
    allowNull: true
  },
  speakers: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Active', 'Endangered', 'Extinct'),
    defaultValue: 'Active'
  },
  resources: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('resources');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('resources', JSON.stringify(value || []));
    }
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  visibility: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  learners: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'languages',
  timestamps: true
});

// Instance method to increment view count
Language.prototype.incrementViews = async function() {
  this.viewCount += 1;
  await this.save();
  return this.viewCount;
};

// Instance method to increment learners
Language.prototype.incrementLearners = async function() {
  this.learners += 1;
  await this.save();
  return this.learners;
};

module.exports = Language; 