/**
 * Complete Database Setup Script
 * Sets up MongoDB, creates collections, indexes, and seeds initial data
 * Usage: node database/scripts/setup.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prehistoric_vr';

class DatabaseSetup {
  constructor() {
    this.client = new MongoClient(MONGODB_URI);
    this.db = null;
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db();
      console.log('🚀 Connected to MongoDB successfully');
      
      // Test connection
      await this.db.admin().ping();
      console.log('✅ Database connection verified');
      
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      console.log('\n💡 Make sure MongoDB is running:');
      console.log('   - Local: mongod');
      console.log('   - Atlas: Check your connection string in .env');
      throw error;
    }
  }

  async disconnect() {
    await this.client.close();
    console.log('🔌 Disconnected from MongoDB');
  }

  async createCollections() {
    console.log('\n📁 Creating database collections...');
    
    const collections = [
      'users',
      'tribes', 
      'artifacts',
      'vrexperiences',
      'aiconversations',
      'config'
    ];

    for (const collectionName of collections) {
      try {
        await this.db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`📋 Collection already exists: ${collectionName}`);
        } else {
          throw error;
        }
      }
    }
  }

  async createIndexes() {
    console.log('\n🔍 Creating database indexes for performance...');

    try {
      // Users collection indexes
      await this.db.collection('users').createIndex({ email: 1 }, { unique: true });
      await this.db.collection('users').createIndex({ tribe: 1 });
      await this.db.collection('users').createIndex({ onboardingCompleted: 1 });
      await this.db.collection('users').createIndex({ createdAt: -1 });
      console.log('✅ Users indexes created');

      // Tribes collection indexes
      await this.db.collection('tribes').createIndex({ name: 1 }, { unique: true });
      await this.db.collection('tribes').createIndex({ counties: 1 });
      await this.db.collection('tribes').createIndex({ featured: -1, viewCount: -1 });
      await this.db.collection('tribes').createIndex({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
      console.log('✅ Tribes indexes created');

      // Artifacts collection indexes
      await this.db.collection('artifacts').createIndex({ tribe: 1, category: 1 });
      await this.db.collection('artifacts').createIndex({ featured: -1, viewCount: -1 });
      await this.db.collection('artifacts').createIndex({ tags: 1 });
      await this.db.collection('artifacts').createIndex({ 'discovery.location.county': 1 });
      await this.db.collection('artifacts').createIndex({ culturalPeriod: 1 });
      console.log('✅ Artifacts indexes created');

      // VR Experiences collection indexes
      await this.db.collection('vrexperiences').createIndex({ category: 1, tribe: 1 });
      await this.db.collection('vrexperiences').createIndex({ featured: -1, 'analytics.totalViews': -1 });
      await this.db.collection('vrexperiences').createIndex({ status: 1, visibility: 1 });
      await this.db.collection('vrexperiences').createIndex({ difficulty: 1 });
      console.log('✅ VR Experiences indexes created');

      // AI Conversations collection indexes
      await this.db.collection('aiconversations').createIndex({ userId: 1, createdAt: -1 });
      await this.db.collection('aiconversations').createIndex({ topic: 1 });
      console.log('✅ AI Conversations indexes created');

      // Text search indexes
      await this.db.collection('tribes').createIndex({
        name: 'text',
        displayName: 'text', 
        description: 'text',
        'history.origins': 'text'
      });

      await this.db.collection('artifacts').createIndex({
        name: 'text',
        displayName: 'text',
        description: 'text',
        tags: 'text'
      });

      await this.db.collection('vrexperiences').createIndex({
        title: 'text',
        description: 'text',
        'educational.keyTopics': 'text'
      });

      console.log('✅ Text search indexes created');

    } catch (error) {
      console.error('❌ Error creating indexes:', error.message);
      throw error;
    }
  }

  async seedInitialData() {
    console.log('\n🌱 Seeding initial database data...');

    // Create admin user
    await this.createAdminUser();
    
    // Insert app configuration
    await this.insertAppConfig();
    
    // Seed sample tribes (you can expand this)
    await this.seedSampleTribes();
    
    // Seed sample artifacts
    await this.seedSampleArtifacts();
    
    // Seed sample VR experiences
    await this.seedSampleVRExperiences();
  }

  async createAdminUser() {
    const adminExists = await this.db.collection('users').findOne({ email: 'admin@prehistoricvr.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123456', 10);
      
      const adminUser = {
        fullName: 'PRE_HISTORIC_VR Admin',
        email: 'admin@prehistoricvr.com',
        password: hashedPassword,
        tribe: 'Bassa',
        county: 'Montserrado',
        gender: 'Other',
        ageGroup: '26-35', 
        educationLevel: 'University',
        interests: ['All Tribes', 'Archaeology', 'VR Technology', 'Cultural Preservation'],
        profileImage: null,
        onboardingCompleted: true,
        vrExperiencesCompleted: [],
        tribesVisited: ['Bassa', 'Kpelle', 'Grebo'],
        artifactsViewed: [],
        achievements: ['System Administrator', 'Cultural Guardian'],
        totalLearningTime: 0,
        aiConversations: [],
        notifications: true,
        language: 'English',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.db.collection('users').insertOne(adminUser);
      console.log('✅ Admin user created (admin@prehistoricvr.com / admin123456)');
    } else {
      console.log('📋 Admin user already exists');
    }
  }

  async insertAppConfig() {
    const config = {
      _id: 'app_config',
      version: '1.0.0',
      appName: 'PRE_HISTORIC_VR',
      description: 'Virtual Reality Cultural Heritage Experience for Liberia',
      totalTribes: 17,
      supportedLanguages: ['English', 'Bassa', 'Kpelle', 'Grebo', 'Gio', 'Mano'],
      vrDeviceSupport: ['Mobile', 'Google Cardboard', 'Oculus Quest', 'Desktop Browser'],
      culturalPeriods: ['Prehistoric', 'Ancient', 'Medieval', 'Colonial', 'Modern', 'Contemporary'],
      artifactCategories: [
        'Pottery', 'Tools', 'Weapons', 'Masks', 'Textiles', 'Jewelry',
        'Musical Instruments', 'Religious Objects', 'Household Items', 'Art', 'Currency', 'Other'
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
        'First Steps', 'Tribe Explorer', 'Artifact Hunter', 'VR Pioneer',
        'Cultural Scholar', 'Language Learner', 'Time Traveler', 'Heritage Keeper',
        'Master Explorer', 'Cultural Ambassador', 'Digital Archaeologist'
      ],
      featureFlags: {
        aiChatEnabled: true,
        vrExperiencesEnabled: true,
        offlineModeEnabled: false,
        communityFeaturesEnabled: true,
        advancedAnalyticsEnabled: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.db.collection('config').replaceOne(
      { _id: 'app_config' },
      config,
      { upsert: true }
    );
    console.log('✅ Application configuration inserted');
  }

  async seedSampleTribes() {
    const tribesCount = await this.db.collection('tribes').countDocuments();
    
    if (tribesCount === 0) {
      const sampleTribes = [
        {
          name: 'Bassa',
          displayName: 'Bassa People',
          alternativeNames: ['Gbassa'],
          primaryRegions: ['Central Liberia'],
          counties: ['Grand Bassa', 'Margibi', 'Nimba'],
          coordinates: { latitude: 6.2311, longitude: -9.4295 },
          description: 'The Bassa are one of the largest ethnic groups in Liberia, known for their rich cultural heritage and traditional governance systems.',
          population: { estimated: 350000, year: 2023, source: 'Liberian Census Bureau' },
          featured: true,
          visibility: true,
          viewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Kpelle',
          displayName: 'Kpelle People', 
          alternativeNames: ['Guerze', 'Kpessi'],
          primaryRegions: ['Central and Northern Liberia'],
          counties: ['Bong', 'Lofa', 'Nimba'],
          coordinates: { latitude: 7.2547, longitude: -9.2677 },
          description: 'The Kpelle are the largest ethnic group in Liberia, known for their agricultural expertise and rich oral traditions.',
          population: { estimated: 500000, year: 2023, source: 'Liberian Census Bureau' },
          featured: true,
          visibility: true,
          viewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Grebo',
          displayName: 'Grebo People',
          alternativeNames: ['Glebo'],
          primaryRegions: ['Southeastern Liberia'],
          counties: ['Maryland', 'Grand Kru', 'River Gee'],
          coordinates: { latitude: 4.7362, longitude: -7.7336 },
          description: 'The Grebo people are known for their warrior traditions and coastal settlements along southeastern Liberia.',
          population: { estimated: 250000, year: 2023, source: 'Liberian Census Bureau' },
          featured: false,
          visibility: true,
          viewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await this.db.collection('tribes').insertMany(sampleTribes);
      console.log(`✅ Inserted ${sampleTribes.length} sample tribes`);
    } else {
      console.log(`📋 Tribes collection already has ${tribesCount} documents`);
    }
  }

  async seedSampleArtifacts() {
    const artifactsCount = await this.db.collection('artifacts').countDocuments();
    
    if (artifactsCount === 0) {
      // Get tribe IDs for reference
      const bassaTribe = await this.db.collection('tribes').findOne({ name: 'Bassa' });
      const kpelleTribe = await this.db.collection('tribes').findOne({ name: 'Kpelle' });
      
      if (bassaTribe && kpelleTribe) {
        const sampleArtifacts = [
          {
            name: 'Traditional Bassa Mask',
            displayName: 'Sacred Poro Initiation Mask',
            category: 'Masks',
            tribe: bassaTribe._id,
            culturalPeriod: 'Ancient',
            description: 'Sacred wooden mask used in traditional Bassa Poro society initiation ceremonies.',
            featured: true,
            visibility: true,
            viewCount: 0,
            likes: 0,
            tags: ['ceremonial', 'wood', 'sacred', 'initiation'],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            name: 'Kpelle Farming Tool',
            displayName: 'Traditional Iron Hoe',
            category: 'Tools',
            tribe: kpelleTribe._id,
            culturalPeriod: 'Medieval',
            description: 'Iron farming tool used by Kpelle people for agricultural work in forest regions.',
            featured: false,
            visibility: true,
            viewCount: 0,
            likes: 0,
            tags: ['farming', 'iron', 'agriculture', 'tool'],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];

        await this.db.collection('artifacts').insertMany(sampleArtifacts);
        console.log(`✅ Inserted ${sampleArtifacts.length} sample artifacts`);
      } else {
        console.log('⚠️ Could not create artifacts - tribes not found');
      }
    } else {
      console.log(`📋 Artifacts collection already has ${artifactsCount} documents`);
    }
  }

  async seedSampleVRExperiences() {
    const vrCount = await this.db.collection('vrexperiences').countDocuments();
    
    if (vrCount === 0) {
      const bassaTribe = await this.db.collection('tribes').findOne({ name: 'Bassa' });
      
      if (bassaTribe) {
        const sampleVRExperiences = [
          {
            title: 'Ancient Bassa Village Experience',
            subtitle: 'Journey through a traditional Bassa settlement',
            description: 'Experience life in a traditional Bassa village with authentic architecture, daily activities, and cultural practices.',
            category: 'Tribal Village',
            difficulty: 'Beginner',
            tribe: bassaTribe._id,
            historicalPeriod: 'Ancient',
            status: 'Published',
            visibility: 'Public',
            featured: true,
            analytics: {
              totalViews: 0,
              completionRate: 0,
              averageTimeSpent: 0,
              userRatings: [],
              commonIssues: []
            },
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];

        await this.db.collection('vrexperiences').insertMany(sampleVRExperiences);
        console.log(`✅ Inserted ${sampleVRExperiences.length} sample VR experiences`);
      } else {
        console.log('⚠️ Could not create VR experiences - tribes not found');
      }
    } else {
      console.log(`📋 VR experiences collection already has ${vrCount} documents`);
    }
  }

  async verifySetup() {
    console.log('\n🔍 Verifying database setup...');

    try {
      const stats = await this.db.stats();
      
      const collections = await this.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      
      console.log(`✅ Database: ${stats.db}`);
      console.log(`📁 Collections: ${collectionNames.join(', ')}`);
      console.log(`💾 Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`🗂️ Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
      
      // Check document counts
      for (const collectionName of ['users', 'tribes', 'artifacts', 'vrexperiences', 'config']) {
        try {
          const count = await this.db.collection(collectionName).countDocuments();
          console.log(`📋 ${collectionName}: ${count} documents`);
        } catch (error) {
          console.log(`📋 ${collectionName}: collection not found`);
        }
      }
      
      console.log('\n🎉 Database setup verification completed!');
      
    } catch (error) {
      console.error('❌ Setup verification failed:', error.message);
      throw error;
    }
  }

  async run() {
    try {
      console.log('🚀 Starting PRE_HISTORIC_VR Database Setup...\n');
      
      await this.connect();
      await this.createCollections();
      await this.createIndexes();
      await this.seedInitialData();
      await this.verifySetup();
      
      console.log('\n✅ Database setup completed successfully!');
      console.log('\n🔑 Admin Credentials:');
      console.log('   Email: admin@prehistoricvr.com');
      console.log('   Password: admin123456');
      console.log('\n🌐 Your backend server can now connect to the database!');
      
    } catch (error) {
      console.error('\n❌ Database setup failed:', error.message);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new DatabaseSetup();
  
  setup.run()
    .then(() => {
      console.log('\n🎉 Setup script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Setup script failed:', error.message);
      process.exit(1);
    });
}

module.exports = DatabaseSetup; 