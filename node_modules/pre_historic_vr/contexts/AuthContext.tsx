import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../lib/api';

interface User {
  id: string;
  email?: string;
  phone?: string;
  fullName: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  hasCompletedOnboarding: boolean;
  avatar?: string;
  tribe?: string;
  county?: string;
  gender?: string;
  ageGroup?: string;
  educationLevel?: string;
  interests?: string[];
  profileImage?: string | null;
  vrExperiencesCompleted: string[];
  tribesVisited: string[];
  artifactsViewed: string[];
  achievements: string[];
  totalLearningTime: number;
  notifications: boolean;
  language: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (email: string | null, password: string, fullName: string, phone?: string | null) => Promise<boolean>;
  signIn: (email: string | null, password: string, phone?: string | null) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (emailOrPhone: string, type: 'email' | 'phone') => Promise<{ success: boolean; resetToken?: string }>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  completeOnboarding: () => Promise<boolean>;
  deleteAccount: (password: string) => Promise<boolean>;
  checkOnboardingStatus: () => boolean;
  hasCompletedOnboarding: () => boolean;
  verifyEmail: (code: string) => Promise<boolean>;
  verifyPhone: (code: string) => Promise<boolean>;
  resendVerification: (type: 'email' | 'phone') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        apiClient.setToken(token);
        const response = await apiClient.getCurrentUser();
        
        if (response.success && response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          // Token might be invalid
          await signOut();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await signOut();
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string | null, password: string, fullName: string, phone?: string | null): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiClient.register({ email, password, fullName, phone });
      
      if (response.success && response.token && response.user) {
        await AsyncStorage.setItem('authToken', response.token);
        apiClient.setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string | null, password: string, phone?: string | null): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiClient.login({ email, password, phone });
      
      if (response.success && response.token && response.user) {
        await AsyncStorage.setItem('authToken', response.token);
        apiClient.setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('authToken');
      apiClient.setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (emailOrPhone: string, type: 'email' | 'phone'): Promise<{ success: boolean; resetToken?: string }> => {
    try {
      const response = await apiClient.forgotPassword({ email: emailOrPhone, phone: emailOrPhone, type });
      return {
        success: response.success,
        resetToken: response.resetToken
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<boolean> => {
    try {
      const response = await apiClient.changePassword({ 
        currentPassword, 
        newPassword, 
        confirmPassword 
      });
      return response.success;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    try {
      const response = await apiClient.updateProfile(updates);
      
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  const completeOnboarding = async (): Promise<boolean> => {
    try {
      const response = await apiClient.completeOnboarding();
      
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Complete onboarding error:', error);
      return false;
    }
  };

  const deleteAccount = async (password: string): Promise<boolean> => {
    try {
      const response = await apiClient.deleteAccount({ 
        password, 
        confirmDeletion: 'DELETE' 
      });
      
      if (response.success) {
        await signOut();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Delete account error:', error);
      return false;
    }
  };

  // Check onboarding status
  const checkOnboardingStatus = (): boolean => {
    return user?.hasCompletedOnboarding ?? false;
  };

  // Alias for checkOnboardingStatus (for backwards compatibility)
  const hasCompletedOnboarding = (): boolean => {
    return user?.hasCompletedOnboarding ?? false;
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    try {
      const response = await apiClient.verifyEmail({ code });
      if (response.success) {
        await updateUser({ isEmailVerified: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Verify email error:', error);
      return false;
    }
  };

  const verifyPhone = async (code: string): Promise<boolean> => {
    try {
      const response = await apiClient.verifyPhone({ code });
      if (response.success) {
        await updateUser({ isPhoneVerified: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Verify phone error:', error);
      return false;
    }
  };

  const resendVerification = async (type: 'email' | 'phone'): Promise<boolean> => {
    try {
      const response = await apiClient.resendVerification({ type });
      return response.success;
    } catch (error) {
      console.error('Resend verification error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    changePassword,
    updateUser,
    completeOnboarding,
    deleteAccount,
    checkOnboardingStatus,
    hasCompletedOnboarding,
    verifyEmail,
    verifyPhone,
    resendVerification
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 