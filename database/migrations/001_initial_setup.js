/**
 * Migration: Initial Database Setup
 * Creates collections, indexes, and initial data
 * Run with: node database/migrations/001_initial_setup.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prehistoric_vr';

async function runMigration() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB for migration');
    
    const db = client.db();
    
    // Create collections if they don't exist
    const collections = ['users', 'tribes', 'artifacts', 'vrexperiences', 'aiconversations'];
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error) {
        if (error.code === 48) {
          console.log(`📋 Collection already exists: ${collectionName}`);
        } else {
          console.error(`❌ Error creating collection ${collectionName}:`, error.message);
        }
      }
    }
    
    // Create indexes for performance
    console.log('🔍 Creating database indexes...');
    
    // Users indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ tribe: 1 });
    await db.collection('users').createIndex({ onboardingCompleted: 1 });
    await db.collection('users').createIndex({ createdAt: -1 });
    console.log('✅ Users indexes created');
    
    // Tribes indexes
    await db.collection('tribes').createIndex({ name: 1 }, { unique: true });
    await db.collection('tribes').createIndex({ counties: 1 });
    await db.collection('tribes').createIndex({ featured: -1, viewCount: -1 });
    await db.collection('tribes').createIndex({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
    console.log('✅ Tribes indexes created');
    
    // Artifacts indexes
    await db.collection('artifacts').createIndex({ tribe: 1, category: 1 });
    await db.collection('artifacts').createIndex({ featured: -1, viewCount: -1 });
    await db.collection('artifacts').createIndex({ tags: 1 });
    await db.collection('artifacts').createIndex({ 'discovery.location.county': 1 });
    await db.collection('artifacts').createIndex({ culturalPeriod: 1 });
    console.log('✅ Artifacts indexes created');
    
    // VR Experiences indexes
    await db.collection('vrexperiences').createIndex({ category: 1, tribe: 1 });
    await db.collection('vrexperiences').createIndex({ featured: -1, 'analytics.totalViews': -1 });
    await db.collection('vrexperiences').createIndex({ status: 1, visibility: 1 });
    await db.collection('vrexperiences').createIndex({ difficulty: 1 });
    console.log('✅ VR Experiences indexes created');
    
    // AI Conversations indexes
    await db.collection('aiconversations').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('aiconversations').createIndex({ topic: 1 });
    console.log('✅ AI Conversations indexes created');
    
    // Create text search indexes for search functionality
    await db.collection('tribes').createIndex({
      name: 'text',
      displayName: 'text',
      description: 'text',
      'history.origins': 'text'
    });
    
    await db.collection('artifacts').createIndex({
      name: 'text',
      displayName: 'text',
      description: 'text',
      tags: 'text'
    });
    
    await db.collection('vrexperiences').createIndex({
      title: 'text',
      description: 'text',
      'educational.keyTopics': 'text'
    });
    
    console.log('✅ Text search indexes created');
    
    // Insert initial configuration data
    const config = {
      _id: 'app_config',
      version: '1.0.0',
      totalTribes: 17,
      supportedLanguages: ['English', 'Bassa', 'Kpelle', 'Grebo'],
      vrDeviceSupport: ['Mobile', 'Cardboard', 'Oculus', 'Desktop'],
      culturalPeriods: ['Prehistoric', 'Ancient', 'Medieval', 'Colonial', 'Modern', 'Contemporary'],
      artifactCategories: [
        'Pottery', 'Tools', 'Weapons', 'Masks', 'Textiles', 'Jewelry',
        'Musical Instruments', 'Religious Objects', 'Household Items', 'Art', 'Currency'
      ],
      liberianCounties: [
        'Bomi', 'Bong', 'Gbarpolu', 'Grand Bassa', 'Grand Cape Mount',
        'Grand Gedeh', 'Grand Kru', 'Lofa', 'Margibi', 'Maryland',
        'Montserrado', 'Nimba', 'River Cess', 'River Gee', 'Sinoe'
      ],
      liberianTribes: [
        'Bassa', 'Belleh', 'Dei', 'Gbandi', 'Gio', 'Gola', 'Grebo',
        'Kissi', 'Kpelle', 'Krahn', 'Kru', 'Lorma', 'Mandingo',
        'Mano', 'Mende', 'Vai'
      ],
      achievementTypes: [
        'First Login', 'Tribe Explorer', 'Artifact Hunter', 'VR Pioneer',
        'Cultural Scholar', 'Language Learner', 'Time Traveler',
        'Master Explorer', 'Heritage Guardian'
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('config').replaceOne(
      { _id: 'app_config' },
      config,
      { upsert: true }
    );
    console.log('✅ Application configuration inserted');
    
    // Create admin user if it doesn't exist
    const adminExists = await db.collection('users').findOne({ email: 'admin@prehistoricvr.com' });
    
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const adminPassword = await bcrypt.hash('admin123456', 10);
      
      const adminUser = {
        fullName: 'PRE_HISTORIC_VR Admin',
        email: 'admin@prehistoricvr.com',
        password: adminPassword,
        tribe: 'Bassa',
        county: 'Montserrado',
        gender: 'Other',
        ageGroup: '26-35',
        educationLevel: 'University',
        interests: ['All Tribes', 'Archaeology', 'VR Technology'],
        profileImage: null,
        onboardingCompleted: true,
        vrExperiencesCompleted: [],
        tribesVisited: [],
        artifactsViewed: [],
        achievements: ['System Administrator'],
        totalLearningTime: 0,
        aiConversations: [],
        notifications: true,
        language: 'English',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('users').insertOne(adminUser);
      console.log('✅ Admin user created');
    } else {
      console.log('📋 Admin user already exists');
    }
    
    console.log('🎉 Database migration completed successfully!');
    
    // Display database stats
    const stats = await db.stats();
    console.log(`
📊 Database Statistics:
- Database: ${stats.db}
- Collections: ${stats.collections}
- Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB
- Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB
- Indexes: ${stats.indexes}
    `);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigration }; 