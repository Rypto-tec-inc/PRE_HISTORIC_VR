/**
 * API Client for PRE_HISTORIC_VR
 * Connects React Native frontend to Express backend
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get API URL from environment or use default
const API_BASE_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:3000/api';

console.log('🔗 API Base URL:', API_BASE_URL);

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  // Set authentication token
  async setToken(token) {
    this.token = token;
    if (token) {
      await AsyncStorage.setItem('auth_token', token);
    } else {
      await AsyncStorage.removeItem('auth_token');
    }
  }

  // Get stored token
  async getToken() {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('auth_token');
    }
    return this.token;
  }

  // Make authenticated API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      console.log(`✅ API Success: ${endpoint}`);
      return data;

    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error.message);
      throw error;
    }
  }

  // Authentication endpoints
  async register(data) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success && response.token) {
      await this.setToken(response.token);
    }
    
    return response;
  }

  async login(data) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success && response.token) {
      await this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout error:', error.message);
    } finally {
      await this.setToken(null);
    }
  }

  async getCurrentUser() {
    const response = await this.request('/auth/me');
    return response;
  }

  async forgotPassword(data) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(data) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyPhone(data) {
    return this.request('/auth/verify-phone', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendVerification(data) {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProfile(updates) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async completeOnboarding() {
    return this.request('/auth/complete-onboarding', {
      method: 'POST',
    });
  }

  async deleteAccount(data) {
    return this.request('/auth/delete-account', {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }

  // User endpoints
  async updateUser(updates) {
    const response = await this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response;
  }

  async getUserProgress() {
    const response = await this.request('/users/progress');
    return response.data;
  }

  async recordVRExperience(experienceId, score) {
    return this.request('/users/progress/vr-experience', {
      method: 'POST',
      body: JSON.stringify({ experienceId, score }),
    });
  }

  async recordTribeVisit(tribeName) {
    return this.request('/users/progress/tribe-visit', {
      method: 'POST',
      body: JSON.stringify({ tribeName }),
    });
  }

  async recordArtifactView(artifactId) {
    return this.request('/users/progress/artifact-view', {
      method: 'POST',
      body: JSON.stringify({ artifactId }),
    });
  }

  async awardAchievement(achievementName) {
    return this.request('/users/achievements', {
      method: 'POST',
      body: JSON.stringify({ achievementName }),
    });
  }

  // Tribes endpoints
  async getTribes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/tribes${queryString ? `?${queryString}` : ''}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  async getTribe(id) {
    const response = await this.request(`/tribes/${id}`);
    return response.data;
  }

  async getTribeByName(name) {
    const response = await this.request(`/tribes/name/${name}`);
    return response.data;
  }

  async getTribeArtifacts(tribeId) {
    const response = await this.request(`/tribes/${tribeId}/artifacts`);
    return response.data;
  }

  async getTribeVRExperiences(tribeId) {
    const response = await this.request(`/tribes/${tribeId}/vr-experiences`);
    return response.data;
  }

  // Artifacts endpoints
  async getArtifacts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/artifacts${queryString ? `?${queryString}` : ''}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  async getArtifact(id) {
    const response = await this.request(`/artifacts/${id}`);
    return response.data;
  }

  // VR experiences endpoints
  async getVRExperiences(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/vr${queryString ? `?${queryString}` : ''}`;
    const response = await this.request(endpoint);
    return response.data;
  }

  async getVRExperience(id) {
    const response = await this.request(`/vr/${id}`);
    return response.data;
  }

  // AI Chat endpoints
  async sendChatMessage(message, context = {}) {
    const response = await this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
    return response.data;
  }

  async getChatSuggestions() {
    const response = await this.request('/ai/suggestions');
    return response.data;
  }

  async submitAIFeedback(messageId, rating, feedback) {
    return this.request('/ai/feedback', {
      method: 'POST',
      body: JSON.stringify({ messageId, rating, feedback }),
    });
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/api/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Backend server is not running');
    }
  }

  // Mock AI methods (for when backend is not available)
  async getAICulturalInsights(culture, topic) {
    return {
      success: true,
      data: {
        message: `Here are cultural insights about ${culture} and ${topic}. This is a mock response - connect to your backend for real AI responses!`,
        type: 'cultural_insight'
      }
    };
  }

  async getAIArtifactDescription(artifactName, location) {
    return {
      success: true,
      data: {
        message: `The ${artifactName} from ${location} is a fascinating piece of cultural heritage. This is a mock response - connect to your backend for detailed artifact information!`,
        type: 'artifact_description'
      }
    };
  }

  async getAIHistoricalContext(period, location) {
    return {
      success: true,
      data: {
        message: `During the ${period} in ${location}, many significant cultural developments occurred. This is a mock response - connect to your backend for historical details!`,
        type: 'historical_context'
      }
    };
  }

  async getAIVRExperience(experience, location) {
    return {
      success: true,
      data: {
        message: `The ${experience} VR experience in ${location} offers an immersive journey through time. This is a mock response - connect to your backend for VR guidance!`,
        type: 'vr_guidance'
      }
    };
  }

  async translateToTribalLanguage(text, language) {
    return {
      success: true,
      data: {
        message: `Translation of "${text}" to ${language}: [Mock translation]. Connect to your backend for real language services!`,
        type: 'language_translation'
      }
    };
  }

  async getAIInteractiveStory(setting, character) {
    return {
      success: true,
      data: {
        message: `Once upon a time in ${setting}, a ${character} discovered amazing cultural treasures... This is a mock story - connect to your backend for interactive narratives!`,
        type: 'interactive_story'
      }
    };
  }

  async getAIQuizQuestions(topic, difficulty, count) {
    return {
      success: true,
      data: {
        message: `Here are ${count} ${difficulty} questions about ${topic}. This is a mock response - connect to your backend for educational quizzes!`,
        type: 'quiz_questions'
      }
    };
  }

  async getAIVRNavigation(experience, userLevel) {
    return {
      success: true,
      data: {
        message: `VR Navigation for ${experience} (${userLevel} level): This is a mock response - connect to your backend for VR guidance!`,
        type: 'vr_navigation'
      }
    };
  }

  async getAIEducationalContent(topic, level) {
    return {
      success: true,
      data: {
        message: `Educational content about ${topic} at ${level} level. This is a mock response - connect to your backend for personalized learning!`,
        type: 'educational_content'
      }
    };
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export User type for TypeScript
export const User = {
  id: '',
  email: '',
  fullName: '',
  tribe: '',
  county: '',
  gender: '',
  ageGroup: '',
  educationLevel: '',
  interests: [],
  profileImage: null,
  onboardingCompleted: false,
  vrExperiencesCompleted: [],
  tribesVisited: [],
  artifactsViewed: [],
  achievements: [],
  totalLearningTime: 0,
  notifications: true,
  language: 'English',
  createdAt: '',
  updatedAt: ''
}; 