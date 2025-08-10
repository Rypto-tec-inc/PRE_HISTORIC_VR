const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true, // Changed to allow null for phone-only registration
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      is: /^\+\d{1,4}\s?\d{6,14}$/
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isPhoneVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  emailVerificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phoneVerificationCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  hasCompletedOnboarding: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tribe: {
    type: DataTypes.STRING,
    allowNull: true
  },
  county: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other', 'Prefer not to say'),
    allowNull: true
  },
  ageGroup: {
    type: DataTypes.ENUM('Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'),
    allowNull: true
  },
  educationLevel: {
    type: DataTypes.ENUM('Elementary', 'High School', 'University', 'Graduate', 'Other'),
    allowNull: true
  },
  interests: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('interests');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('interests', JSON.stringify(value || []));
    }
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  onboardingCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  vrExperiencesCompleted: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('vrExperiencesCompleted');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('vrExperiencesCompleted', JSON.stringify(value || []));
    }
  },
  tribesVisited: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('tribesVisited');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('tribesVisited', JSON.stringify(value || []));
    }
  },
  artifactsViewed: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('artifactsViewed');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('artifactsViewed', JSON.stringify(value || []));
    }
  },
  userAchievements: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('userAchievements');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('userAchievements', JSON.stringify(value || []));
    }
  },
  totalLearningTime: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'English'
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  validate: {
    emailOrPhoneRequired() {
      if (!this.email && !this.phone) {
        throw new Error('Either email or phone must be provided');
      }
    }
  }
});

// Don't hash password in hooks since we're doing it manually in the routes
// to avoid double hashing

// Instance method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// JSON serialization (exclude sensitive fields)
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  delete values.emailVerificationToken;
  delete values.phoneVerificationCode;
  delete values.passwordResetToken;
  return values;
};

module.exports = User; 