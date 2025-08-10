# 🏛️ PRE_HISTORIC_VR - Complete Cultural Heritage System

> **A comprehensive VR and AI-powered cultural heritage application for exploring prehistoric Liberia**

Welcome to your complete VR cultural heritage system! This project connects **Frontend**, **Backend**, and **Database** to create an immersive educational experience about Liberian tribal history and culture.

## 🎉 **WHAT'S INCLUDED**

### ✅ **FRONTEND** (React Native + Expo)
- **Beautiful Mobile App** with dark theme
- **Complete Authentication System** (login, register, password reset, profile management)
- **VR Museum Experiences** powered by A-Frame
- **AI Chat Assistant** (Mis Nova) for cultural guidance
- **17 Tribal Language Pages** with detailed cultural information
- **Interactive Maps & User Progress Tracking**
- **Professional UI/UX** with smooth animations

### ✅ **BACKEND** (Express.js + MongoDB)
- **Secure API Server** with JWT authentication
- **Complete User Management** (registration, login, profile updates, password changes)
- **Tribal Database** with comprehensive data for all 17 Liberian tribes
- **AI-Powered Chat System** with contextual responses
- **VR Experience Management** and progress tracking
- **Artifact Catalog** with detailed cultural information
- **Admin Features** and content management

### ✅ **DATABASE** (MongoDB)
- **Comprehensive Schema** for users, tribes, artifacts, VR experiences
- **Cultural Heritage Data** for all major Liberian tribes
- **User Progress Tracking** and achievement system
- **AI Conversation History** and analytics
- **Backup & Migration Scripts** for easy deployment

---

## 🚀 **QUICK START**

### **1. Prerequisites**
Make sure you have these installed:
- **Node.js** (v16+) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud)
- **Git** - [Download here](https://git-scm.com/)

### **2. One-Command Setup**
```bash
# Install all dependencies for all 3 folders
npm run install:all

# Start everything at once
npm run dev
```

### **3. Individual Setup (if needed)**

#### **Backend Setup:**
```bash
cd backend
npm install
node server.js
```

#### **Frontend Setup:**
```bash
cd frontend
npm install
npm start
```

#### **Database Setup:**
```bash
cd database
npm install
npm run setup
```

---

## 🔧 **CONFIGURATION**

### **Environment Variables**
The `.env` file in the root directory configures everything:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/prehistoric_vr

# Backend API
PORT=3000
JWT_SECRET=your_secret_key_here

# Frontend
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### **MongoDB Options:**
1. **Local MongoDB**: Install MongoDB Community Server
2. **Cloud MongoDB**: Use MongoDB Atlas (free tier available)
3. **Docker**: `docker run -p 27017:27017 mongo`

---

## 📱 **HOW TO USE**

### **For Users:**
1. **Register/Login** - Create account with secure password
2. **Complete Onboarding** - Set your tribal preferences and interests
3. **Explore Tribes** - Learn about 17 different Liberian cultures
4. **VR Experiences** - Immersive virtual reality cultural tours
5. **Chat with Mis Nova** - AI assistant for cultural questions
6. **Track Progress** - See your learning journey and achievements

### **For Developers:**
1. **API Documentation** - All endpoints documented in backend README
2. **Database Schema** - Complete documentation in database README
3. **Component Library** - Reusable UI components in frontend
4. **Testing** - Unit tests and API testing utilities

---

## 🏛️ **FEATURES**

### **🔐 Complete Authentication**
- User registration with strong password validation
- Secure login with JWT tokens
- Password reset and change functionality
- Profile management and account deletion
- Onboarding flow for new users

### **🤖 AI Assistant (Mis Nova)**
- Intelligent cultural education responses
- Tribal knowledge and artifact information
- VR experience guidance and navigation
- Language learning support
- Interactive storytelling and quizzes

### **🥽 VR Experiences**
- Google Cardboard compatible VR scenes
- A-Frame powered immersive environments
- Virtual tribal villages and ceremonies
- Interactive cultural artifact exploration
- Progress tracking and achievements

### **🏺 Cultural Heritage Database**
- **17 Liberian Tribes** with complete historical data
- **Traditional Artifacts** with 3D models and descriptions
- **Cultural Practices** and ceremony documentation
- **Language Resources** and pronunciation guides
- **Historical Timelines** and migration stories

### **📊 User Features**
- Personal profile and preferences
- Learning progress tracking
- Achievement and badge system
- Favorite content collections
- Community interaction features

---

## 🎯 **ADMIN FEATURES**

### **Default Admin Account:**
- **Email**: `admin@prehistoricvr.com`
- **Password**: `admin123456`

### **Admin Capabilities:**
- User management and analytics
- Content creation and editing
- VR experience management
- Tribal data administration
- System monitoring and logs

---

## 📚 **API ENDPOINTS**

### **Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset

### **Cultural Data:**
- `GET /api/tribes` - Get all tribes
- `GET /api/tribes/:id` - Get specific tribe
- `GET /api/artifacts` - Get all artifacts
- `GET /api/vr` - Get VR experiences

### **AI Assistant:**
- `POST /api/ai/chat` - Send message to AI
- `GET /api/ai/suggestions` - Get conversation starters
- `POST /api/ai/feedback` - Submit AI feedback

---

## 🛠️ **DEVELOPMENT**

### **Project Structure:**
```
PRE_HISTORIC_VR/
├── frontend/          # React Native + Expo app
├── backend/           # Express.js API server
├── database/          # MongoDB setup and data
├── package.json       # Root package manager
└── .env              # Environment configuration
```

### **Available Scripts:**
```bash
npm run dev           # Start everything
npm run backend       # Start backend only
npm run frontend      # Start frontend only
npm run database:setup # Setup database
npm run install:all   # Install all dependencies
```

### **Code Style:**
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **NativeWind** for styling

---

## 🌟 **CULTURAL CONTENT**

### **Included Tribes:**
1. **Bassa** - Coastal pottery and mask traditions
2. **Kpelle** - Largest group with rich storytelling
3. **Grebo** - Coastal fishing and architecture
4. **Gio (Dan)** - Master carvers and musicians
5. **Mano** - Agricultural and healing traditions
6. **Krahn** - Forest dwelling and hunting culture
7. **Vai** - Unique writing system and trade
8. **Mandingo** - Islamic traditions and commerce
9. **Lorma** - Mountain agriculture and crafts
10. **Kissi** - Ironworking and spiritual practices
11. **Gola** - Cross-border cultural connections
12. **Gbandi** - Traditional governance systems
13. **Mende** - Secret societies and initiation
14. **Dei** - River culture and fishing
15. **Belleh** - Forest products and trade
16. **Kru** - Maritime traditions and navigation

---

## 📞 **SUPPORT**

### **Getting Help:**
1. Check the README files in each folder
2. Review the API documentation
3. Look at the example configurations
4. Test with the health check: `curl http://localhost:3000/api/health`

### **Common Issues:**
- **MongoDB not running**: Start MongoDB service or check connection string
- **Port conflicts**: Change PORT in `.env` file
- **Permission errors**: Run with appropriate permissions
- **Dependencies**: Run `npm run install:all` again

---

## 🎉 **SUCCESS!**

Your complete VR cultural heritage system is ready! You now have:

✅ **Professional mobile app** with VR capabilities  
✅ **Intelligent AI assistant** for cultural education  
✅ **Comprehensive database** of Liberian heritage  
✅ **Secure user management** with full authentication  
✅ **Admin dashboard** for content management  
✅ **Production-ready architecture** for deployment  

**Enjoy exploring prehistoric Liberia! 🏛️✨**

---

*Built with ❤️ for cultural preservation and education* 