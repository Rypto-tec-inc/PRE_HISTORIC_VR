#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up PRE_HISTORIC_VR Project...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  step: (msg) => console.log(`\n${colors.cyan}🔧 ${msg}${colors.reset}`)
};

// Check if Node.js is installed
function checkNodeVersion() {
  try {
    const version = process.version;
    const major = parseInt(version.slice(1).split('.')[0]);
    if (major < 16) {
      log.error('Node.js version 16 or higher is required');
      process.exit(1);
    }
    log.success(`Node.js ${version} detected`);
  } catch (error) {
    log.error('Node.js is not installed');
    process.exit(1);
  }
}

// Create directories
function createDirectories() {
  const dirs = [
    'backend/uploads',
    'backend/logs',
    'backend/backups',
    'backend/vr-assets',
    'backend/vr-scenes',
    'frontend/assets/vr'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log.success(`Created directory: ${dir}`);
    }
  });
}

// Create backend .env file
function createBackendEnv() {
  const envPath = 'backend/.env';
  const envContent = `# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_TYPE=sqlite
DB_PATH=./database.sqlite

# JWT Configuration
JWT_SECRET=prehistoric_liberia_vr_super_secret_key_2024
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email Configuration (for future use)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@prehistoricliberia.com

# SMS Configuration (for future use)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
ALLOWED_VIDEO_TYPES=video/mp4,video/webm,video/ogg

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:8081,exp://

# AI Configuration (for future integration)
OPENAI_API_KEY=your-openai-api-key
AI_MODEL=gpt-3.5-turbo

# VR Configuration
VR_ASSETS_PATH=./vr-assets
VR_SCENES_PATH=./vr-scenes

# Logging Configuration
LOG_LEVEL=debug
LOG_FILE=./logs/app.log

# Backup Configuration
BACKUP_PATH=./backups
BACKUP_RETENTION_DAYS=30

# Feature Flags
ENABLE_EMAIL_VERIFICATION=false
ENABLE_SMS_VERIFICATION=false
ENABLE_AI_FEATURES=true
ENABLE_VR_FEATURES=true
ENABLE_ANALYTICS=true
`;

  fs.writeFileSync(envPath, envContent);
  log.success('Created backend .env file');
}

// Install backend dependencies
function installBackendDeps() {
  log.step('Installing backend dependencies...');
  try {
    execSync('npm install', { cwd: 'backend', stdio: 'inherit' });
    log.success('Backend dependencies installed');
  } catch (error) {
    log.error('Failed to install backend dependencies');
    process.exit(1);
  }
}

// Install frontend dependencies
function installFrontendDeps() {
  log.step('Installing frontend dependencies...');
  try {
    execSync('npm install', { cwd: 'frontend', stdio: 'inherit' });
    log.success('Frontend dependencies installed');
  } catch (error) {
    log.error('Failed to install frontend dependencies');
    process.exit(1);
  }
}

// Initialize database
function initializeDatabase() {
  log.step('Initializing database...');
  try {
    execSync('node scripts/seed.js', { cwd: 'backend', stdio: 'inherit' });
    log.success('Database initialized with sample data');
  } catch (error) {
    log.error('Failed to initialize database');
    process.exit(1);
  }
}

// Create README files
function createReadmeFiles() {
  const backendReadme = `# PRE_HISTORIC_VR Backend

## Overview
Express.js backend for the Prehistoric Liberia VR application, providing APIs for cultural content, user management, and VR experiences.

## Features
- User authentication and authorization
- Cultural content management (tribes, artifacts, languages)
- VR experience management
- Achievement system
- File upload handling
- SQLite database

## Quick Start

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. Initialize database:
   \`\`\`bash
   npm run seed
   \`\`\`

4. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

- \`GET /api/health\` - Health check
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login
- \`GET /api/tribes\` - Get all tribes
- \`GET /api/artifacts\` - Get all artifacts
- \`GET /api/vr\` - Get VR experiences
- \`GET /api/languages\` - Get languages

## Database Models

- User - User accounts and profiles
- Tribe - Liberian tribal information
- Artifact - Cultural artifacts
- VRExperience - VR experiences
- Achievement - User achievements
- Language - Tribal languages

## Environment Variables

See \`.env.example\` for all available configuration options.
`;

  const frontendReadme = `# PRE_HISTORIC_VR Frontend

## Overview
React Native/Expo frontend for the Prehistoric Liberia VR application, providing an immersive cultural learning experience.

## Features
- Cultural exploration and learning
- VR experiences
- Language learning
- Achievement system
- User profiles and progress tracking
- Offline support

## Quick Start

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start development server:
   \`\`\`bash
   npx expo start
   \`\`\`

3. Run on device/simulator:
   - Press \`i\` for iOS simulator
   - Press \`a\` for Android emulator
   - Scan QR code with Expo Go app

## Project Structure

\`\`\`
app/
├── (tabs)/          # Main tab navigation
├── auth/            # Authentication screens
├── onboarding.tsx   # User onboarding
├── welcome.tsx      # Welcome screen
└── splash.tsx       # Splash screen
\`\`\`

## Configuration

Edit \`app.config.js\` to configure:
- API endpoints
- Feature flags
- Cultural content
- VR settings

## Available Scripts

- \`npm start\` - Start Expo development server
- \`npm run android\` - Run on Android
- \`npm run ios\` - Run on iOS
- \`npm run web\` - Run on web
`;

  fs.writeFileSync('backend/README.md', backendReadme);
  fs.writeFileSync('frontend/README.md', frontendReadme);
  log.success('Created README files');
}

// Create startup scripts
function createStartupScripts() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  packageJson.scripts = {
    ...packageJson.scripts,
    "setup": "node setup-everything.js",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npx expo start",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npx expo build",
    "seed": "cd backend && npm run seed",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd backend && npm test",
    "test:frontend": "cd frontend && npm test"
  };

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  log.success('Updated root package.json scripts');
}

// Main setup function
async function main() {
  try {
    log.step('Checking prerequisites...');
    checkNodeVersion();

    log.step('Creating directories...');
    createDirectories();

    log.step('Creating environment files...');
    createBackendEnv();

    log.step('Installing dependencies...');
    installBackendDeps();
    installFrontendDeps();

    log.step('Initializing database...');
    initializeDatabase();

    log.step('Creating documentation...');
    createReadmeFiles();

    log.step('Setting up scripts...');
    createStartupScripts();

    console.log(`\n${colors.green}${colors.bright}🎉 Setup completed successfully!${colors.reset}\n`);
    
    console.log(`${colors.cyan}${colors.bright}Next Steps:${colors.reset}`);
    console.log(`1. Start the backend: ${colors.yellow}cd backend && npm run dev${colors.reset}`);
    console.log(`2. Start the frontend: ${colors.yellow}cd frontend && npx expo start${colors.reset}`);
    console.log(`3. Or run both: ${colors.yellow}npm run dev${colors.reset}\n`);
    
    console.log(`${colors.cyan}${colors.bright}Test Credentials:${colors.reset}`);
    console.log(`Email: ${colors.yellow}test@prehistoricliberia.com${colors.reset}`);
    console.log(`Password: ${colors.yellow}password123${colors.reset}\n`);
    
    console.log(`${colors.cyan}${colors.bright}API Endpoints:${colors.reset}`);
    console.log(`Health Check: ${colors.yellow}http://localhost:3000/api/health${colors.reset}`);
    console.log(`API Base: ${colors.yellow}http://localhost:3000/api${colors.reset}\n`);
    
    console.log(`${colors.green}Happy coding! 🚀${colors.reset}`);

  } catch (error) {
    log.error('Setup failed: ' + error.message);
    process.exit(1);
  }
}

// Run setup
if (require.main === module) {
  main();
}

module.exports = { main }; 