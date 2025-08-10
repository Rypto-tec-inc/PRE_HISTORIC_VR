# ��️ PRE_HISTORIC_VR - Liberian Cultural Heritage VR Experience

[![Node.js](https://img.shields.io/badge/Node.js-22.14.0-green.svg)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.73.0-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2053-purple.svg)](https://expo.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-3.44.0-orange.svg)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> An immersive Virtual Reality application that preserves and showcases the rich cultural heritage of Liberia's 17 tribes through interactive experiences, language learning, and archaeological artifacts.

## 🌟 Features

### 🥽 Virtual Reality Experiences
- **Immersive Cultural Tours** - Explore traditional Liberian villages
- **Interactive Artifacts** - 3D models of cultural artifacts
- **Educational VR Scenes** - Learn about tribal customs and traditions
- **Google Cardboard Compatible** - Accessible VR experience
- **A-Frame Powered** - Web-based VR technology

### 🏘️ Cultural Content
- **17 Liberian Tribes** - Complete cultural information
- **Traditional Artifacts** - Archaeological items with 3D models
- **Language Learning** - Tribal language preservation
- **Historical Timelines** - Cultural evolution and migration
- **Interactive Maps** - Geographic tribal distribution

### 🤖 AI Assistant (Mis Nova)
- **Cultural Education** - Intelligent responses about Liberian culture
- **VR Guidance** - Help with virtual reality experiences
- **Language Support** - Translation and pronunciation help
- **Personalized Learning** - Adaptive educational content

### 👤 User System
- **Profile Management** - User preferences and progress
- **Achievement System** - Gamified learning experience
- **Progress Tracking** - Learning milestones and completion
- **Community Features** - Share experiences and discoveries

### 📱 Mobile Application
- **Cross-Platform** - iOS and Android support
- **Offline Capability** - Content available without internet
- **Responsive Design** - Optimized for all screen sizes
- **Native Performance** - Smooth animations and interactions

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/PRE_HISTORIC_VR.git
   cd PRE_HISTORIC_VR
   ```

2. **Run the complete setup script**
   ```bash
   node setup-everything.js
   ```

3. **Start the development servers**
   ```bash
   # Start both backend and frontend
   npm run dev
   
   # Or start them separately:
   npm run dev:backend  # Backend only
   npm run dev:frontend # Frontend only
   ```

### Manual Setup (Alternative)

#### Backend Setup
```bash
cd backend
npm install
npm run seed  # Initialize database with sample data
npm run dev   # Start development server
```

#### Frontend Setup
```bash
cd frontend
npm install
npx expo start
```

## 📊 Database Schema

### Core Models

#### 👤 User
- Authentication and profile management
- Progress tracking and achievements
- Cultural preferences and interests
- VR experience completion history

#### 🏘️ Tribe
- Cultural information for all 17 Liberian tribes
- Geographic data and population statistics
- Traditional customs and social organization
- Media resources and learning modules

#### 🏺 Artifact
- Archaeological items and cultural objects
- 3D models and interactive content
- Historical context and significance
- VR integration and educational content

#### 🥽 VRExperience
- Virtual reality scenes and environments
- Interactive elements and educational content
- Technical specifications and compatibility
- User analytics and engagement metrics

#### 🏆 Achievement
- Gamification system for user engagement
- Progress milestones and rewards
- Cultural learning objectives
- Social sharing and community features

#### 🗣️ Language
- Tribal language preservation
- Learning modules and pronunciation guides
- Cultural context and historical significance
- Audio resources and interactive content

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Cultural Content
- `GET /api/tribes` - Get all tribes
- `GET /api/tribes/:id` - Get specific tribe
- `GET /api/artifacts` - Get all artifacts
- `GET /api/artifacts/:id` - Get specific artifact
- `GET /api/vr` - Get VR experiences
- `GET /api/vr/:id` - Get specific VR experience

### User Progress
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/progress/vr-experience` - Record VR completion
- `POST /api/users/progress/tribe-visit` - Record tribe visit
- `POST /api/users/progress/artifact-view` - Record artifact view

### AI Assistant
- `POST /api/ai/chat` - Send message to AI assistant
- `GET /api/ai/suggestions` - Get chat suggestions
- `POST /api/ai/feedback` - Submit AI feedback

### System
- `GET /api/health` - Health check
- `GET /api/achievements` - Get achievements
- `GET /api/languages` - Get languages

## 🏗️ Project Structure

```
PRE_HISTORIC_VR/
├── backend/                 # Express.js backend
│   ├── config/             # Database and app configuration
│   ├── middleware/         # Authentication and security
│   ├── models/             # Database models and associations
│   ├── routes/             # API endpoints
│   ├── scripts/            # Database seeding and utilities
│   ├── uploads/            # File uploads
│   ├── logs/               # Application logs
│   └── server.js           # Main server file
├── frontend/               # React Native/Expo frontend
│   ├── app/                # Main application screens
│   │   ├── (tabs)/         # Tab navigation
│   │   ├── auth/           # Authentication screens
│   │   └── onboarding.tsx  # User onboarding
│   ├── components/         # Reusable components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # API client and utilities
│   └── assets/             # Images, fonts, and static files
├── database/               # Database migrations and scripts
├── .gitignore             # Git ignore rules
├── package.json           # Root package configuration
├── setup-everything.js    # Complete setup script
└── README.md              # This file
```

## 🎮 Usage

### For Users
1. **Download the app** from your device's app store
2. **Create an account** or sign in
3. **Complete onboarding** to personalize your experience
4. **Explore tribes** and learn about Liberian culture
5. **Experience VR** with Google Cardboard or VR headset
6. **Track progress** and earn achievements
7. **Connect with community** and share discoveries

### For Developers
1. **Clone the repository** and run setup
2. **Start development servers** for backend and frontend
3. **Access API documentation** at `http://localhost:3000/api/health`
4. **Test VR experiences** in the frontend application
5. **Add new content** through the database seeding scripts
6. **Customize features** by modifying the source code

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
DB_TYPE=sqlite
DB_PATH=./database.sqlite
```

#### Frontend (app.config.js)
```javascript
export default {
  expo: {
    extra: {
      API_URL: "http://localhost:3000/api",
      ENABLE_AI_FEATURES: true,
      ENABLE_VR_FEATURES: true,
    }
  }
}
```

### Database Configuration
- **SQLite** - File-based database (no server required)
- **Sequelize ORM** - Object-relational mapping
- **Automatic migrations** - Schema management
- **Sample data** - Pre-populated cultural content

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Get tribes
curl http://localhost:3000/api/tribes

# Get artifacts
curl http://localhost:3000/api/artifacts
```

## 🚀 Deployment

### Backend Deployment
1. **Set environment variables** for production
2. **Build the application** with `npm run build`
3. **Deploy to your preferred platform** (Heroku, AWS, etc.)
4. **Configure database** for production use

### Frontend Deployment
1. **Configure production API endpoints**
2. **Build the application** with `expo build`
3. **Submit to app stores** (iOS App Store, Google Play)
4. **Configure analytics** and monitoring

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Liberian Cultural Heritage** - For preserving and sharing this rich culture
- **Expo Team** - For the amazing React Native development platform
- **A-Frame Community** - For the WebVR framework
- **Open Source Contributors** - For the tools and libraries that made this possible

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/PRE_HISTORIC_VR/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/PRE_HISTORIC_VR/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/PRE_HISTORIC_VR/discussions)
- **Email**: support@prehistoricliberia.com

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic VR experiences
- ✅ Cultural content management
- ✅ User authentication
- ✅ Achievement system

### Phase 2 (Next)
- 🔄 Advanced VR interactions
- 🔄 Multi-language support
- 🔄 Community features
- 🔄 Offline content

### Phase 3 (Future)
- 📋 AR experiences
- 📋 Social VR
- 📋 Advanced AI features
- 📋 International expansion

---

**Made with ❤️ for Liberian Cultural Heritage Preservation**

*This project aims to preserve and share the rich cultural heritage of Liberia through modern technology, making it accessible to people around the world while respecting and honoring the traditions of the Liberian people.* 