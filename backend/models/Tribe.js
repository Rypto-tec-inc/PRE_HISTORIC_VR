const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tribe = sequelize.define('Tribe', {
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
  alternativeNames: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('alternativeNames');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('alternativeNames', JSON.stringify(value || []));
    }
  },
  primaryRegions: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('primaryRegions');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('primaryRegions', JSON.stringify(value || []));
    }
  },
  counties: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('counties');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('counties', JSON.stringify(value || []));
    }
  },
  coordinates: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('coordinates');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('coordinates', JSON.stringify(value || {}));
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  history: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  language: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('language');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('language', JSON.stringify(value || {}));
    }
  },
  traditions: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('traditions');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('traditions', JSON.stringify(value || {}));
    }
  },
  tribeArtifacts: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('tribeArtifacts');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('tribeArtifacts', JSON.stringify(value || {}));
    }
  },
  socialOrganization: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('socialOrganization');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('socialOrganization', JSON.stringify(value || {}));
    }
  },
  economy: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('economy');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('economy', JSON.stringify(value || {}));
    }
  },
  religion: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('religion');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('religion', JSON.stringify(value || {}));
    }
  },
  media: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('media');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('media', JSON.stringify(value || {}));
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
  population: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  visibility: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'tribes',
  timestamps: true
});

// Instance method to increment view count
Tribe.prototype.incrementViews = async function() {
  this.viewCount += 1;
  await this.save();
  return this.viewCount;
};

module.exports = Tribe; 