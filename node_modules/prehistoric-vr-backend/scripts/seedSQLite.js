const { testConnection, initDatabase } = require('../config/database');
const User = require('../models/User');
const Tribe = require('../models/Tribe');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting SQLite database seeding...');

    // Test connection
    await testConnection();
    
    // Initialize tables
    await initDatabase();

    // Create admin user
    const adminExists = await User.findOne({ where: { email: 'admin@prehistoricvr.com' } });
    
    if (!adminExists) {
      await User.create({
        email: 'admin@prehistoricvr.com',
        password: 'admin123456',
        fullName: 'Admin User',
        onboardingCompleted: true,
        tribe: 'Administrator',
        county: 'Montserrado'
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create sample tribes
    const tribesData = [
      {
        name: 'Bassa',
        displayName: 'Bassa People',
        description: 'The Bassa people are one of Liberia\'s largest ethnic groups, known for their rich oral traditions and skilled craftsmanship.',
        counties: ['Grand Bassa', 'Margibi', 'Montserrado'],
        population: 576000,
        featured: true
      },
      {
        name: 'Kpelle',
        displayName: 'Kpelle People',
        description: 'The largest ethnic group in Liberia, with a strong tradition of storytelling and music.',
        counties: ['Bong', 'Gbarpolu', 'Lofa'],
        population: 487000,
        featured: true
      },
      {
        name: 'Grebo',
        displayName: 'Grebo People', 
        description: 'Coastal dwellers known for their fishing traditions and unique architectural styles.',
        counties: ['Maryland', 'Grand Kru', 'River Gee'],
        population: 387000,
        featured: false
      }
    ];

    for (const tribeData of tribesData) {
      const exists = await Tribe.findOne({ where: { name: tribeData.name } });
      if (!exists) {
        await Tribe.create(tribeData);
        console.log(`✅ Created tribe: ${tribeData.name}`);
      } else {
        console.log(`ℹ️  Tribe ${tribeData.name} already exists`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('🔑 Admin Credentials:');
    console.log('   Email: admin@prehistoricvr.com');
    console.log('   Password: admin123456');
    console.log('');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase(); 