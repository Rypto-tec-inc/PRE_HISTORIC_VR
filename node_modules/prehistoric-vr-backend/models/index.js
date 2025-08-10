const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Tribe = require('./Tribe');
const Artifact = require('./Artifact');
const VRExperience = require('./VRExperience');
const Achievement = require('./Achievement');
const UserAchievement = require('./UserAchievement');
const Language = require('./Language');

// Define associations

// User - Achievement (Many-to-Many through UserAchievement)
User.belongsToMany(Achievement, {
  through: UserAchievement,
  foreignKey: 'userId',
  otherKey: 'achievementId',
  as: 'achievements'
});

Achievement.belongsToMany(User, {
  through: UserAchievement,
  foreignKey: 'achievementId',
  otherKey: 'userId',
  as: 'users'
});

// UserAchievement associations
UserAchievement.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

UserAchievement.belongsTo(Achievement, {
  foreignKey: 'achievementId',
  as: 'achievement'
});

// Tribe - Language (One-to-Many)
Tribe.hasMany(Language, {
  foreignKey: 'tribe',
  sourceKey: 'name',
  as: 'languages'
});

Language.belongsTo(Tribe, {
  foreignKey: 'tribe',
  targetKey: 'name',
  as: 'tribeInfo'
});

// Tribe - Artifact (One-to-Many)
Tribe.hasMany(Artifact, {
  foreignKey: 'tribe',
  sourceKey: 'name',
  as: 'artifacts'
});

Artifact.belongsTo(Tribe, {
  foreignKey: 'tribe',
  targetKey: 'name',
  as: 'tribeInfo'
});

// Tribe - VRExperience (One-to-Many)
Tribe.hasMany(VRExperience, {
  foreignKey: 'tribe',
  sourceKey: 'name',
  as: 'tribeVRExperiences'
});

VRExperience.belongsTo(Tribe, {
  foreignKey: 'tribe',
  targetKey: 'name',
  as: 'tribeInfo'
});

// User - Tribe (Many-to-One for user's tribe)
User.belongsTo(Tribe, {
  foreignKey: 'tribe',
  targetKey: 'name',
  as: 'userTribe'
});

// Export all models and sequelize instance
module.exports = {
  sequelize,
  User,
  Tribe,
  Artifact,
  VRExperience,
  Achievement,
  UserAchievement,
  Language
}; 