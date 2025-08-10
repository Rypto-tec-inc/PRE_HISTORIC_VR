const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Artifact = sequelize.define('Artifact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tribe: {
    type: DataTypes.STRING,
    allowNull: false
  },
  culturalPeriod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  physicalDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('physicalDescription');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('physicalDescription', JSON.stringify(value || {}));
    }
  },
  dating: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('dating');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('dating', JSON.stringify(value || {}));
    }
  },
  discovery: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('discovery');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('discovery', JSON.stringify(value || {}));
    }
  },
  significance: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  construction: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('construction');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('construction', JSON.stringify(value || {}));
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
  learningContent: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('learningContent');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('learningContent', JSON.stringify(value || {}));
    }
  },
  research: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('research');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('research', JSON.stringify(value || {}));
    }
  },
  exhibition: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('exhibition');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('exhibition', JSON.stringify(value || {}));
    }
  },
  vrExperience: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('vrExperience');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('vrExperience', JSON.stringify(value || {}));
    }
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('tags');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value || []));
    }
  },
  keywords: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('keywords');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('keywords', JSON.stringify(value || []));
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
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  userViews: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('userViews');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('userViews', JSON.stringify(value || []));
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
  tableName: 'artifacts',
  timestamps: true
});

// Instance method to increment view count
Artifact.prototype.incrementViews = async function(userId = null) {
  this.viewCount += 1;
  
  if (userId) {
    const views = this.userViews || [];
    if (!views.includes(userId)) {
      views.push(userId);
      this.userViews = views;
    }
  }
  
  await this.save();
  return this.viewCount;
};

// Instance method to add rating
Artifact.prototype.addRating = async function(userId, rating, comment = '') {
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
Object.defineProperty(Artifact.prototype, 'averageRating', {
  get: function() {
    const ratings = this.userRatings || [];
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }
});

module.exports = Artifact; 