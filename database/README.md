# PRE_HISTORIC_VR Database

## 🗄️ Database Architecture

This project uses **MongoDB** as the primary database for storing cultural heritage data, user information, and VR experiences.

## 📊 Database Structure

### Core Collections

1. **users** - User profiles, progress, achievements
2. **tribes** - 17 Liberian tribes with cultural data
3. **artifacts** - Archaeological artifacts with 3D models
4. **vrexperiences** - VR scenes and educational content
5. **aiconversations** - Chat history and AI interactions

## 🚀 Quick Setup

### Option 1: Local MongoDB
```bash
# Install MongoDB locally
# Windows: Download from mongodb.com
# macOS: brew install mongodb-community
# Linux: apt-get install mongodb

# Start MongoDB service
mongod

# Connect to database
mongo
```

### Option 2: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Update `.env` file with your connection string

## 🌱 Data Seeding

### Seed the Database
```bash
cd backend
npm run seed
```

### What Gets Seeded:
- ✅ 17 Liberian tribes with complete cultural data
- ✅ Sample artifacts with 3D model references
- ✅ VR experiences with A-Frame scenes
- ✅ Admin user account
- ✅ Sample user progress data

## 📈 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  password: String (hashed),
  tribe: String,
  county: String,
  gender: String,
  ageGroup: String,
  educationLevel: String,
  interests: [String],
  profileImage: String,
  onboardingCompleted: Boolean,
  vrExperiencesCompleted: [{
    experienceId: String,
    completedAt: Date,
    score: Number
  }],
  tribesVisited: [String],
  artifactsViewed: [String],
  achievements: [String],
  totalLearningTime: Number,
  aiConversations: [{
    topic: String,
    messageCount: Number,
    lastMessageAt: Date
  }],
  notifications: Boolean,
  language: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Tribes Collection
```javascript
{
  _id: ObjectId,
  name: String (enum: 17 tribes),
  displayName: String,
  alternativeNames: [String],
  primaryRegions: [String],
  counties: [String],
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  description: String,
  history: {
    origins: String,
    migration: String,
    timeline: [{
      period: String,
      events: String,
      date: String
    }]
  },
  language: {
    name: String,
    family: String,
    dialects: [String],
    speakers: Number,
    status: String,
    commonPhrases: [{
      english: String,
      tribal: String,
      pronunciation: String,
      audioFile: String
    }]
  },
  traditions: {
    ceremonies: [String],
    festivals: [String],
    rituals: [String],
    music: [String],
    dance: [String],
    storytelling: [String]
  },
  artifacts: {
    masks: [Object],
    tools: [Object],
    textiles: [Object],
    pottery: [Object]
  },
  socialOrganization: {
    leadership: String,
    familyStructure: String,
    ageGrades: [String],
    secretSocieties: [String]
  },
  economy: {
    traditional: [String],
    modern: [String],
    crafts: [String],
    trade: [String]
  },
  religion: {
    traditional: String,
    modernInfluences: [String],
    ancestors: String,
    cosmology: String
  },
  media: {
    heroImage: String,
    gallery: [String],
    videos: [String],
    audioRecordings: [String],
    vrSceneId: String
  },
  learningModules: [{
    title: String,
    description: String,
    difficulty: String,
    content: String,
    quiz: [Object]
  }],
  population: {
    estimated: Number,
    year: Number,
    source: String
  },
  featured: Boolean,
  visibility: Boolean,
  viewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Artifacts Collection
```javascript
{
  _id: ObjectId,
  name: String,
  displayName: String,
  category: String,
  subcategory: String,
  tribe: ObjectId (ref: Tribe),
  culturalPeriod: String,
  description: String,
  physicalDescription: {
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      weight: Number,
      units: String
    },
    materials: [String],
    colors: [String],
    condition: String,
    preservation: String
  },
  dating: {
    estimatedAge: String,
    period: String,
    method: String,
    confidence: String
  },
  discovery: {
    location: {
      site: String,
      county: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    discoveryDate: Date,
    discoveredBy: String,
    excavationContext: String,
    associatedFinds: [String]
  },
  significance: {
    purpose: String,
    use: String,
    symbolism: String,
    culturalMeaning: String,
    ritualUse: String,
    socialStatus: String
  },
  construction: {
    techniques: [String],
    craftingMethods: [String],
    decorativeElements: [String],
    toolsUsed: [String]
  },
  media: {
    primaryImage: String,
    gallery: [String],
    threeDModel: {
      modelUrl: String,
      textureUrl: String,
      normalMap: String,
      fileFormat: String,
      polyCount: Number
    },
    vrScene: {
      sceneId: String,
      interactionType: String,
      audioNarration: String
    },
    videos: [String],
    audioGuide: String
  },
  learningContent: {
    funFacts: [String],
    didYouKnow: [String],
    connections: [String],
    comparisons: [Object]
  },
  research: {
    publications: [String],
    researchers: [String],
    ongoingStudies: [String],
    hypotheses: [String]
  },
  exhibition: {
    currentLocation: String,
    museumId: String,
    catalogNumber: String,
    acquisitionDate: Date,
    provenance: String,
    legalStatus: String
  },
  vrExperience: {
    hasVRMode: Boolean,
    interactionPoints: [Object],
    reconstructionAvailable: Boolean
  },
  tags: [String],
  keywords: [String],
  featured: Boolean,
  visibility: Boolean,
  viewCount: Number,
  likes: Number,
  userViews: [Object],
  userRatings: [Object],
  createdAt: Date,
  updatedAt: Date
}
```

### VRExperiences Collection
```javascript
{
  _id: ObjectId,
  title: String,
  subtitle: String,
  description: String,
  category: String,
  difficulty: String,
  tribe: ObjectId (ref: Tribe),
  historicalPeriod: String,
  location: {
    name: String,
    county: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  scene: {
    aframeCode: String,
    environment: {
      skybox: String,
      lighting: String,
      weather: String,
      timeOfDay: String
    },
    cameraSettings: {
      startPosition: {
        x: Number,
        y: Number,
        z: Number
      },
      movement: String
    }
  },
  interactions: [Object],
  audio: {
    backgroundMusic: String,
    ambientSounds: [String],
    narration: Object,
    voiceActor: String,
    languages: [String]
  },
  assets: {
    models: [Object],
    textures: [String],
    sounds: [String]
  },
  educational: {
    learningGoals: [String],
    keyTopics: [String],
    concepts: [String],
    skills: [String],
    assessments: [Object]
  },
  timeline: [Object],
  technical: {
    requiredDevices: [String],
    compatibility: Object,
    performance: Object,
    fileSize: Number,
    loadingTime: Number
  },
  userExperience: {
    estimatedDuration: Number,
    complexity: String,
    accessibility: Object,
    ageAppropriate: {
      minAge: Number,
      maxAge: Number
    }
  },
  analytics: {
    totalViews: Number,
    completionRate: Number,
    averageTimeSpent: Number,
    userRatings: [Object],
    commonIssues: [String]
  },
  status: String,
  featured: Boolean,
  visibility: String,
  version: String,
  changelog: [Object],
  relatedExperiences: [ObjectId],
  prerequisites: [ObjectId],
  followUpExperiences: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔗 Relationships

### User → Tribes (Many-to-Many)
- Users can visit multiple tribes
- Tracked in `user.tribesVisited[]`

### User → Artifacts (Many-to-Many)
- Users can view multiple artifacts
- Tracked in `user.artifactsViewed[]`

### User → VR Experiences (Many-to-Many)
- Users can complete multiple VR experiences
- Tracked in `user.vrExperiencesCompleted[]`

### Tribe → Artifacts (One-to-Many)
- Each artifact belongs to one tribe
- Referenced by `artifact.tribe`

### Tribe → VR Experiences (One-to-Many)
- Each VR experience can focus on one tribe
- Referenced by `vrexperience.tribe`

## 📊 Indexes

### Performance Indexes
```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ tribe: 1 })
db.users.createIndex({ onboardingCompleted: 1 })

// Tribes
db.tribes.createIndex({ name: 1 }, { unique: true })
db.tribes.createIndex({ counties: 1 })
db.tribes.createIndex({ featured: -1, viewCount: -1 })

// Artifacts
db.artifacts.createIndex({ tribe: 1, category: 1 })
db.artifacts.createIndex({ featured: -1, viewCount: -1 })
db.artifacts.createIndex({ tags: 1 })
db.artifacts.createIndex({ "discovery.location.county": 1 })

// VR Experiences
db.vrexperiences.createIndex({ category: 1, tribe: 1 })
db.vrexperiences.createIndex({ featured: -1, "analytics.totalViews": -1 })
db.vrexperiences.createIndex({ status: 1, visibility: 1 })
```

## 🔧 Database Management

### Backup
```bash
# Create backup
mongodump --db prehistoric_vr --out ./backups/

# Restore backup
mongorestore --db prehistoric_vr ./backups/prehistoric_vr/
```

### Monitoring
```bash
# Check database stats
db.stats()

# Check collection stats
db.tribes.stats()
db.users.stats()
db.artifacts.stats()
db.vrexperiences.stats()
```

## 🌍 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/prehistoric_vr
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prehistoric_vr
```

## 📱 API Integration

The database is accessed through the Express.js API:
- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Tribes**: `/api/tribes/*`
- **Artifacts**: `/api/artifacts/*`
- **VR Experiences**: `/api/vr/*`
- **AI Chat**: `/api/ai/*` 