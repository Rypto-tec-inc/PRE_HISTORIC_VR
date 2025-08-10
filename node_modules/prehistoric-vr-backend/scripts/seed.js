const { sequelize, User, Tribe, Artifact, VRExperience, Achievement, Language } = require('../models/index');
const bcrypt = require('bcryptjs');

const liberianTribes = [
  {
    name: 'Bassa',
    displayName: 'Bassa',
    alternativeNames: ['Basaa', 'Basa'],
    primaryRegions: ['Grand Bassa County', 'River Cess County'],
    counties: ['Grand Bassa', 'River Cess'],
    coordinates: { lat: 6.3, lng: -10.8 },
    description: 'The Bassa are one of the largest ethnic groups in Liberia, known for their rich cultural heritage and traditional practices.',
    history: 'The Bassa people have inhabited the coastal regions of Liberia for centuries, with a history deeply rooted in maritime culture and trade.',
    language: {
      name: 'Bassa',
      speakers: 350000,
      status: 'Active'
    },
    traditions: {
      ceremonies: ['Poro Society', 'Sande Society'],
      crafts: ['Basket Weaving', 'Pottery', 'Wood Carving'],
      music: ['Traditional Drums', 'Balafon', 'Kora']
    },
    socialOrganization: {
      structure: 'Matrilineal',
      leadership: 'Chiefs and Elders',
      clans: ['Gbo', 'Gbe', 'Gbi', 'Gbo']
    },
    economy: {
      primary: ['Farming', 'Fishing', 'Trading'],
      crops: ['Rice', 'Cassava', 'Palm Oil'],
      crafts: ['Basketry', 'Pottery', 'Textiles']
    },
    religion: {
      traditional: 'Ancestral Worship',
      modern: 'Christianity',
      practices: ['Sacrifice', 'Divination', 'Healing']
    },
    media: {
      images: ['bassa_art.png', 'bassa_ceremony.jpg'],
      videos: ['bassa_dance.mp4', 'bassa_crafts.mp4']
    },
    learningModules: [
      'Bassa History and Origins',
      'Traditional Bassa Society',
      'Bassa Language Basics',
      'Bassa Arts and Crafts'
    ],
    population: 350000,
    featured: true
  },
  {
    name: 'Kpelle',
    displayName: 'Kpelle',
    alternativeNames: ['Kpɛlɛ', 'Guerze'],
    primaryRegions: ['Bong County', 'Lofa County', 'Nimba County'],
    counties: ['Bong', 'Lofa', 'Nimba'],
    coordinates: { lat: 7.0, lng: -9.5 },
    description: 'The Kpelle are the largest ethnic group in Liberia, known for their agricultural expertise and strong community bonds.',
    history: 'The Kpelle migrated from the Mali Empire and have maintained their cultural identity through generations.',
    language: {
      name: 'Kpelle',
      speakers: 500000,
      status: 'Active'
    },
    traditions: {
      ceremonies: ['Poro Society', 'Sande Society'],
      crafts: ['Iron Working', 'Weaving', 'Pottery'],
      music: ['Traditional Drums', 'Horns', 'String Instruments']
    },
    socialOrganization: {
      structure: 'Patrilineal',
      leadership: 'Chiefs and Secret Societies',
      clans: ['Gbo', 'Gbe', 'Gbi']
    },
    economy: {
      primary: ['Agriculture', 'Hunting', 'Trading'],
      crops: ['Rice', 'Yams', 'Cassava'],
      crafts: ['Iron Tools', 'Textiles', 'Pottery']
    },
    religion: {
      traditional: 'Ancestral Worship',
      modern: 'Christianity and Islam',
      practices: ['Sacrifice', 'Divination', 'Healing']
    },
    media: {
      images: ['kpelle_art.png', 'kpelle_village.jpg'],
      videos: ['kpelle_farming.mp4', 'kpelle_music.mp4']
    },
    learningModules: [
      'Kpelle History and Migration',
      'Kpelle Agricultural Practices',
      'Kpelle Language and Culture',
      'Kpelle Traditional Society'
    ],
    population: 500000,
    featured: true
  },
  {
    name: 'Gio',
    displayName: 'Gio',
    alternativeNames: ['Dan', 'Yacouba'],
    primaryRegions: ['Nimba County', 'Grand Gedeh County'],
    counties: ['Nimba', 'Grand Gedeh'],
    coordinates: { lat: 7.5, lng: -8.5 },
    description: 'The Gio people are known for their distinctive masks, artistic traditions, and rich cultural heritage.',
    history: 'The Gio migrated from the Ivory Coast and have developed unique artistic and cultural traditions.',
    language: {
      name: 'Gio',
      speakers: 200000,
      status: 'Active'
    },
    traditions: {
      ceremonies: ['Mask Dances', 'Initiation Rites'],
      crafts: ['Mask Making', 'Wood Carving', 'Textiles'],
      music: ['Traditional Drums', 'Flutes', 'Horns']
    },
    socialOrganization: {
      structure: 'Patrilineal',
      leadership: 'Chiefs and Mask Societies',
      clans: ['Gbo', 'Gbe', 'Gbi']
    },
    economy: {
      primary: ['Agriculture', 'Hunting', 'Crafts'],
      crops: ['Rice', 'Yams', 'Vegetables'],
      crafts: ['Masks', 'Wood Carvings', 'Textiles']
    },
    religion: {
      traditional: 'Ancestral Worship',
      modern: 'Christianity',
      practices: ['Mask Ceremonies', 'Sacrifice', 'Healing']
    },
    media: {
      images: ['gio_art.png', 'gio_masks.jpg'],
      videos: ['gio_dance.mp4', 'gio_carving.mp4']
    },
    learningModules: [
      'Gio Artistic Traditions',
      'Gio Mask Culture',
      'Gio Language and History',
      'Gio Traditional Society'
    ],
    population: 200000,
    featured: true
  }
];

const liberianArtifacts = [
  {
    name: 'Bassa Mask',
    displayName: 'Traditional Bassa Ceremonial Mask',
    category: 'Ceremonial',
    subcategory: 'Masks',
    tribe: 'Bassa',
    culturalPeriod: 'Pre-colonial to Present',
    description: 'A traditional Bassa ceremonial mask used in important cultural ceremonies and rituals.',
    physicalDescription: {
      material: 'Wood',
      dimensions: 'Height: 45cm, Width: 25cm',
      colors: ['Brown', 'Red', 'Black'],
      features: ['Carved facial features', 'Traditional patterns', 'Natural pigments']
    },
    dating: {
      period: '19th-20th century',
      technique: 'Radiocarbon dating',
      context: 'Traditional use continues today'
    },
    discovery: {
      location: 'Grand Bassa County',
      date: 'Collected in 1980s',
      collector: 'Cultural preservation project'
    },
    significance: 'Represents Bassa cultural identity and spiritual beliefs, used in initiation ceremonies and community events.',
    construction: {
      materials: ['Hardwood', 'Natural pigments', 'Plant fibers'],
      techniques: ['Hand carving', 'Traditional painting', 'Ritual preparation'],
      time: '2-3 weeks'
    },
    media: {
      images: ['bassa_mask_front.jpg', 'bassa_mask_side.jpg', 'bassa_mask_detail.jpg'],
      videos: ['bassa_mask_ceremony.mp4'],
      audio: ['bassa_mask_song.mp3']
    },
    learningContent: {
      culturalContext: 'Used in Poro society ceremonies',
      significance: 'Represents ancestral spirits',
      modernUse: 'Cultural preservation and education'
    },
    research: {
      sources: ['Oral histories', 'Ethnographic studies', 'Museum collections'],
      publications: ['Bassa Cultural Heritage', 'Liberian Traditional Arts'],
      experts: ['Dr. Cultural Expert', 'Local Bassa Elders']
    },
    exhibition: {
      location: 'National Museum of Liberia',
      display: 'Permanent collection',
      lighting: 'Natural and artificial',
      security: 'Climate controlled'
    },
    vrExperience: {
      available: true,
      type: '3D Model',
      interaction: 'Rotate and examine',
      audio: 'Traditional music and narration'
    },
    tags: ['mask', 'ceremonial', 'bassa', 'traditional', 'wood'],
    keywords: ['Bassa mask', 'ceremonial art', 'Liberian culture', 'traditional crafts'],
    featured: true
  },
  {
    name: 'Kpelle Iron Tool',
    displayName: 'Traditional Kpelle Iron Agricultural Tool',
    category: 'Agricultural',
    subcategory: 'Tools',
    tribe: 'Kpelle',
    culturalPeriod: 'Pre-colonial to Present',
    description: 'A traditional Kpelle iron tool used for agricultural purposes, demonstrating their metallurgical skills.',
    physicalDescription: {
      material: 'Iron',
      dimensions: 'Length: 60cm, Width: 15cm',
      colors: ['Dark grey', 'Rust brown'],
      features: ['Forged iron blade', 'Wooden handle', 'Traditional patterns']
    },
    dating: {
      period: '18th-19th century',
      technique: 'Metallurgical analysis',
      context: 'Traditional farming practices'
    },
    discovery: {
      location: 'Bong County',
      date: 'Found in 1990s',
      collector: 'Archaeological survey'
    },
    significance: 'Demonstrates Kpelle ironworking traditions and agricultural expertise.',
    construction: {
      materials: ['Iron ore', 'Charcoal', 'Clay'],
      techniques: ['Traditional smelting', 'Forging', 'Tempering'],
      time: '1-2 weeks'
    },
    media: {
      images: ['kpelle_tool_front.jpg', 'kpelle_tool_side.jpg'],
      videos: ['kpelle_ironworking.mp4'],
      audio: ['kpelle_forging_sounds.mp3']
    },
    learningContent: {
      culturalContext: 'Agricultural traditions',
      significance: 'Ironworking heritage',
      modernUse: 'Traditional farming methods'
    },
    research: {
      sources: ['Archaeological findings', 'Ethnographic studies'],
      publications: ['Kpelle Ironworking', 'Liberian Agricultural History'],
      experts: ['Dr. Archaeological Expert', 'Kpelle Blacksmiths']
    },
    exhibition: {
      location: 'National Museum of Liberia',
      display: 'Technology gallery',
      lighting: 'Spot lighting',
      security: 'Standard display'
    },
    vrExperience: {
      available: true,
      type: 'Interactive 3D',
      interaction: 'Handle and examine',
      audio: 'Forging sounds and narration'
    },
    tags: ['iron', 'tool', 'agricultural', 'kpelle', 'traditional'],
    keywords: ['Kpelle ironworking', 'agricultural tools', 'traditional technology'],
    featured: true
  }
];

const vrExperiences = [
  {
    title: 'Bassa Village Life',
    subtitle: 'Experience traditional Bassa daily life',
    description: 'Immerse yourself in a traditional Bassa village and experience their daily activities, ceremonies, and cultural practices.',
    category: 'Cultural Tour',
    difficulty: 'Beginner',
    tribe: 'Bassa',
    historicalPeriod: 'Traditional',
    location: {
      region: 'Grand Bassa County',
      coordinates: { lat: 6.3, lng: -10.8 },
      environment: 'Coastal village'
    },
    scene: {
      environment: 'Traditional village',
      buildings: ['Round houses', 'Meeting hall', 'Craft workshops'],
      vegetation: ['Palm trees', 'Mangroves', 'Tropical plants'],
      weather: 'Tropical climate'
    },
    interactions: [
      'Visit traditional houses',
      'Participate in ceremonies',
      'Learn traditional crafts',
      'Experience village life'
    ],
    audio: {
      ambient: 'Village sounds',
      music: 'Traditional Bassa music',
      narration: 'Cultural guide',
      language: 'English and Bassa'
    },
    assets: {
      models: ['village_houses', 'traditional_tools', 'ceremonial_items'],
      textures: ['palm_thatched_roofs', 'mud_walls', 'tropical_vegetation'],
      animations: ['villagers_working', 'ceremonial_dances', 'craft_activities']
    },
    educational: {
      objectives: ['Understand Bassa culture', 'Learn traditional practices', 'Experience village life'],
      content: ['Cultural history', 'Traditional skills', 'Social organization'],
      assessment: 'Cultural knowledge quiz'
    },
    timeline: [
      { time: '0:00', event: 'Arrival at village' },
      { time: '0:05', event: 'Welcome ceremony' },
      { time: '0:15', event: 'Village tour' },
      { time: '0:30', event: 'Craft demonstration' },
      { time: '0:45', event: 'Traditional ceremony' },
      { time: '1:00', event: 'Farewell and reflection' }
    ],
    technical: {
      platform: 'WebVR',
      requirements: 'VR headset or mobile device',
      performance: 'Optimized for mobile',
      compatibility: 'Oculus, HTC Vive, Mobile VR'
    },
    userExperience: {
      duration: '60 minutes',
      comfort: 'Seated or standing',
      accessibility: 'Audio descriptions available',
      language: 'English, French, Bassa'
    },
    analytics: {
      totalViews: 0,
      totalCompletions: 0,
      averageTimeSpent: 0
    },
    status: 'Published',
    featured: true,
    visibility: 'Public'
  }
];

const achievements = [
  {
    name: 'first_explorer',
    displayName: 'First Explorer',
    description: 'Complete your first cultural exploration in Prehistoric Liberia VR',
    category: 'Exploration',
    icon: 'compass',
    criteria: {
      explorations: 1
    },
    points: 10,
    rarity: 'Common',
    difficulty: 'Easy',
    estimatedTime: 5
  },
  {
    name: 'tribe_visitor',
    displayName: 'Tribe Visitor',
    description: 'Visit your first Liberian tribe and learn about their culture',
    category: 'Cultural',
    icon: 'people',
    criteria: {
      tribesVisited: 1
    },
    points: 25,
    rarity: 'Common',
    difficulty: 'Easy',
    estimatedTime: 15
  },
  {
    name: 'artifact_collector',
    displayName: 'Artifact Collector',
    description: 'Examine your first cultural artifact in detail',
    category: 'Learning',
    icon: 'museum',
    criteria: {
      artifactsViewed: 1
    },
    points: 20,
    rarity: 'Common',
    difficulty: 'Easy',
    estimatedTime: 10
  },
  {
    name: 'vr_pioneer',
    displayName: 'VR Pioneer',
    description: 'Complete your first VR experience in Prehistoric Liberia',
    category: 'VR',
    icon: 'vr-headset',
    criteria: {
      vrExperiencesCompleted: 1
    },
    points: 50,
    rarity: 'Uncommon',
    difficulty: 'Medium',
    estimatedTime: 30
  },
  {
    name: 'cultural_scholar',
    displayName: 'Cultural Scholar',
    description: 'Learn about all major Liberian tribes',
    category: 'Learning',
    icon: 'graduation-cap',
    criteria: {
      tribesVisited: 16
    },
    points: 100,
    rarity: 'Rare',
    difficulty: 'Hard',
    estimatedTime: 120,
    prerequisites: ['tribe_visitor']
  }
];

const languages = [
  {
    name: 'Bassa',
    displayName: 'Bassa Language',
    tribe: 'Bassa',
    region: 'Grand Bassa County',
    description: 'The Bassa language is a Kru language spoken by the Bassa people of Liberia.',
    history: 'Bassa has a rich oral tradition and is one of the major languages of Liberia.',
    alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    phrases: [
      { bassa: 'Kɛɛ', english: 'Hello', pronunciation: 'keh' },
      { bassa: 'Kɛɛ ɓɛɛ', english: 'Good morning', pronunciation: 'keh beh' },
      { bassa: 'Kɛɛ ɓɛɛ', english: 'How are you?', pronunciation: 'keh beh' },
      { bassa: 'Kɛɛ ɓɛɛ', english: 'I am fine', pronunciation: 'keh beh' },
      { bassa: 'Kɛɛ ɓɛɛ', english: 'Thank you', pronunciation: 'keh beh' }
    ],
    vocabulary: {
      family: {
        'mother': 'mama',
        'father': 'papa',
        'child': 'wɛɛ',
        'friend': 'gbɛɛ'
      },
      numbers: {
        'one': 'kɛɛ',
        'two': 'ɓɛɛ',
        'three': 'taa',
        'four': 'naa',
        'five': 'sɔɔ'
      }
    },
    grammar: {
      wordOrder: 'Subject-Verb-Object',
      tense: 'Present, Past, Future',
      plural: 'Reduplication or suffix'
    },
    pronunciation: {
      vowels: ['a', 'e', 'i', 'o', 'u'],
      consonants: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'],
      tones: 'High, Mid, Low'
    },
    learningModules: [
      'Basic Greetings',
      'Family Terms',
      'Numbers and Counting',
      'Daily Conversations'
    ],
    audioFiles: [
      'bassa_greetings.mp3',
      'bassa_numbers.mp3',
      'bassa_family.mp3'
    ],
    culturalContext: 'Bassa is used in traditional ceremonies, storytelling, and daily communication.',
    difficulty: 'Beginner',
    estimatedLearningTime: 20,
    speakers: 350000,
    status: 'Active',
    resources: [
      'Bassa Language Dictionary',
      'Traditional Stories',
      'Cultural Songs'
    ],
    featured: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await sequelize.sync({ force: true });
    console.log('🗑️  Cleared existing data');

    // Seed Tribes
    console.log('🏘️  Seeding tribes...');
    for (const tribeData of liberianTribes) {
      await Tribe.create(tribeData);
    }
    console.log(`✅ Created ${liberianTribes.length} tribes`);

    // Seed Artifacts
    console.log('🏺 Seeding artifacts...');
    for (const artifactData of liberianArtifacts) {
      await Artifact.create(artifactData);
    }
    console.log(`✅ Created ${liberianArtifacts.length} artifacts`);

    // Seed VR Experiences
    console.log('🥽 Seeding VR experiences...');
    for (const vrData of vrExperiences) {
      await VRExperience.create(vrData);
    }
    console.log(`✅ Created ${vrExperiences.length} VR experiences`);

    // Seed Achievements
    console.log('🏆 Seeding achievements...');
    for (const achievementData of achievements) {
      await Achievement.create(achievementData);
    }
    console.log(`✅ Created ${achievements.length} achievements`);

    // Seed Languages
    console.log('🗣️  Seeding languages...');
    for (const languageData of languages) {
      await Language.create(languageData);
    }
    console.log(`✅ Created ${languages.length} languages`);

    // Create a test user
    console.log('👤 Creating test user...');
    const hashedPassword = await bcrypt.hash('password123', 12);
    await User.create({
      email: 'test@prehistoricliberia.com',
      fullName: 'Test User',
      password: hashedPassword,
      tribe: 'Bassa',
      county: 'Grand Bassa',
      gender: 'Other',
      ageGroup: '25-34',
      educationLevel: 'University',
      interests: ['Traditional Music', 'Dance & Performance', 'Tribal Art'],
      hasCompletedOnboarding: true,
      onboardingCompleted: true,
      isEmailVerified: true
    });
    console.log('✅ Created test user');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Tribes: ${liberianTribes.length}`);
    console.log(`   Artifacts: ${liberianArtifacts.length}`);
    console.log(`   VR Experiences: ${vrExperiences.length}`);
    console.log(`   Achievements: ${achievements.length}`);
    console.log(`   Languages: ${languages.length}`);
    console.log('   Test User: 1');
    console.log('\n🔗 Test Credentials:');
    console.log('   Email: test@prehistoricliberia.com');
    console.log('   Password: password123');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { seedDatabase }; 