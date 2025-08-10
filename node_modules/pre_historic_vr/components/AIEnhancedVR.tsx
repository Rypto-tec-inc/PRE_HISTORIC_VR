import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { AIResponse, aiService, HistoricalContext, VRExperiencePrompt } from '../services/AIService';

interface AIEnhancedVRProps {
  experienceId: string;
  experienceName: string;
  location: string;
  onExperienceStart: (data: any) => void;
  onExperienceEnd: () => void;
}

interface AIInsight {
  type: 'historical' | 'cultural' | 'educational' | 'interactive';
  title: string;
  content: string;
  timestamp: Date;
}

export default function AIEnhancedVR({
  experienceId,
  experienceName,
  location,
  onExperienceStart,
  onExperienceEnd,
}: AIEnhancedVRProps) {
  const { user } = useAuth();
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 768;

  const [isLoading, setIsLoading] = useState(false);
  const [historicalContext, setHistoricalContext] = useState<HistoricalContext | null>(null);
  const [vrExperience, setVrExperience] = useState<VRExperiencePrompt | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<AIInsight | null>(null);
  const [experienceActive, setExperienceActive] = useState(false);
  const [userProgress, setUserProgress] = useState({
    timeSpent: 0,
    interactions: 0,
    insightsGained: 0,
  });

  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Load AI-generated content on component mount
  useEffect(() => {
    loadAIContent();
  }, [experienceId]);

  // Track user progress
  useEffect(() => {
    if (experienceActive) {
      progressInterval.current = setInterval(() => {
        setUserProgress(prev => ({
          ...prev,
          timeSpent: prev.timeSpent + 1,
        }));
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [experienceActive]);

  const loadAIContent = async () => {
    setIsLoading(true);
    try {
      // Load historical context
      const contextResponse = await aiService.getCachedAIResponse('historicalContext', {
        siteName: experienceName,
        location: location,
      });

      if (contextResponse.success) {
        setHistoricalContext(contextResponse.data);
      }

      // Load VR experience description
      const vrResponse = await aiService.getCachedAIResponse('vrExperience', {
        theme: experienceName,
        location: location,
      });

      if (vrResponse.success) {
        setVrExperience(vrResponse.data);
      }

      // Generate initial insights
      await generateInsight('historical');
    } catch (error) {
      console.error('Error loading AI content:', error);
      Alert.alert('Error', 'Failed to load AI-enhanced content');
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsight = async (type: 'historical' | 'cultural' | 'educational' | 'interactive') => {
    setIsLoading(true);
    try {
      let response: AIResponse;

      switch (type) {
        case 'historical':
          response = await aiService.generateCulturalInsights('Liberian', 'historical significance');
          break;
        case 'cultural':
          response = await aiService.generateCulturalInsights('Liberian', 'cultural practices');
          break;
        case 'educational':
          response = await aiService.generateEducationalContent(experienceName, 'intermediate');
          break;
        case 'interactive':
          response = await aiService.generateInteractiveStory(experienceName, 'explorer');
          break;
        default:
          response = { success: false, error: 'Unknown insight type' };
      }

      if (response.success && response.data) {
        const newInsight: AIInsight = {
          type,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Insight`,
          content: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
          timestamp: new Date(),
        };

        setAiInsights(prev => [newInsight, ...prev]);
        setUserProgress(prev => ({
          ...prev,
          insightsGained: prev.insightsGained + 1,
        }));
      }
    } catch (error) {
      console.error('Error generating insight:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startExperience = () => {
    setExperienceActive(true);
    onExperienceStart({
      historicalContext,
      vrExperience,
      aiInsights,
    });
  };

  const endExperience = () => {
    setExperienceActive(false);
    onExperienceEnd();
    
    // Save progress
    saveUserProgress();
  };

  const saveUserProgress = async () => {
    try {
      // Save to backend
      await fetch('/api/vr/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          experienceId,
          userId: user?.id,
          progress: userProgress,
          insights: aiInsights.length,
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderInsightCard = (insight: AIInsight) => (
    <TouchableOpacity
      key={insight.timestamp.getTime()}
      style={[styles.insightCard, isTablet && styles.insightCardTablet]}
      onPress={() => setCurrentInsight(insight)}
    >
      <View style={styles.insightHeader}>
        <MaterialCommunityIcons
          name={getInsightIcon(insight.type)}
          size={isTablet ? 24 : 20}
          color={getInsightColor(insight.type)}
        />
        <Text style={[styles.insightTitle, isTablet && styles.insightTitleTablet]}>
          {insight.title}
        </Text>
        <Text style={[styles.insightTime, isTablet && styles.insightTimeTablet]}>
          {insight.timestamp.toLocaleTimeString()}
        </Text>
      </View>
      <Text style={[styles.insightPreview, isTablet && styles.insightPreviewTablet]}>
        {insight.content.substring(0, 100)}...
      </Text>
    </TouchableOpacity>
  );

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'historical': return 'history';
      case 'cultural': return 'account-group';
      case 'educational': return 'school';
      case 'interactive': return 'gamepad-variant';
      default: return 'lightbulb';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'historical': return '#f59e0b';
      case 'cultural': return '#10b981';
      case 'educational': return '#3b82f6';
      case 'interactive': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  if (isLoading && !historicalContext) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#EA580C" />
        <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
          Loading AI-enhanced experience...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      {/* Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, isTablet && styles.titleTablet]}>
            {experienceName}
          </Text>
          <Text style={[styles.subtitle, isTablet && styles.subtitleTablet]}>
            AI-Enhanced VR Experience
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.insightsButton, isTablet && styles.insightsButtonTablet]}
            onPress={() => setShowInsights(!showInsights)}
          >
            <Ionicons name="bulb" size={isTablet ? 24 : 20} color="#EA580C" />
            <Text style={[styles.insightsCount, isTablet && styles.insightsCountTablet]}>
              {aiInsights.length}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressContainer, isTablet && styles.progressContainerTablet]}>
        <View style={styles.progressItem}>
          <Text style={[styles.progressLabel, isTablet && styles.progressLabelTablet]}>Time</Text>
          <Text style={[styles.progressValue, isTablet && styles.progressValueTablet]}>
            {formatTime(userProgress.timeSpent)}
          </Text>
        </View>
        <View style={styles.progressItem}>
          <Text style={[styles.progressLabel, isTablet && styles.progressLabelTablet]}>Insights</Text>
          <Text style={[styles.progressValue, isTablet && styles.progressValueTablet]}>
            {userProgress.insightsGained}
          </Text>
        </View>
        <View style={styles.progressItem}>
          <Text style={[styles.progressLabel, isTablet && styles.progressLabelTablet]}>Interactions</Text>
          <Text style={[styles.progressValue, isTablet && styles.progressValueTablet]}>
            {userProgress.interactions}
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Historical Context */}
        {historicalContext && (
          <View style={[styles.section, isTablet && styles.sectionTablet]}>
            <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
              Historical Context
            </Text>
            <View style={[styles.contextCard, isTablet && styles.contextCardTablet]}>
              <Text style={[styles.contextPeriod, isTablet && styles.contextPeriodTablet]}>
                {historicalContext.period}
              </Text>
              <Text style={[styles.contextCulture, isTablet && styles.contextCultureTablet]}>
                {historicalContext.culture}
              </Text>
              <Text style={[styles.contextSignificance, isTablet && styles.contextSignificanceTablet]}>
                {historicalContext.significance}
              </Text>
              {historicalContext.artifacts.length > 0 && (
                <View style={styles.artifactsContainer}>
                  <Text style={[styles.artifactsTitle, isTablet && styles.artifactsTitleTablet]}>
                    Key Artifacts:
                  </Text>
                  {historicalContext.artifacts.map((artifact, index) => (
                    <Text key={index} style={[styles.artifactItem, isTablet && styles.artifactItemTablet]}>
                      • {artifact}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* VR Experience Description */}
        {vrExperience && (
          <View style={[styles.section, isTablet && styles.sectionTablet]}>
            <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
              VR Experience
            </Text>
            <View style={[styles.vrCard, isTablet && styles.vrCardTablet]}>
              <Text style={[styles.vrScene, isTablet && styles.vrSceneTablet]}>
                {vrExperience.scene}
              </Text>
              <Text style={[styles.vrEnvironment, isTablet && styles.vrEnvironmentTablet]}>
                {vrExperience.environment}
              </Text>
              <Text style={[styles.vrNarrative, isTablet && styles.vrNarrativeTablet]}>
                {vrExperience.narrative}
              </Text>
              {vrExperience.interactions.length > 0 && (
                <View style={styles.interactionsContainer}>
                  <Text style={[styles.interactionsTitle, isTablet && styles.interactionsTitleTablet]}>
                    Interactive Elements:
                  </Text>
                  {vrExperience.interactions.map((interaction, index) => (
                    <Text key={index} style={[styles.interactionItem, isTablet && styles.interactionItemTablet]}>
                      • {interaction}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* AI Insights */}
        {showInsights && (
          <View style={[styles.section, isTablet && styles.sectionTablet]}>
            <View style={styles.insightsHeader}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                AI Insights
              </Text>
              <TouchableOpacity
                style={[styles.generateButton, isTablet && styles.generateButtonTablet]}
                onPress={() => generateInsight('educational')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="add" size={isTablet ? 20 : 16} color="#fff" />
                )}
                <Text style={[styles.generateButtonText, isTablet && styles.generateButtonTextTablet]}>
                  Generate
                </Text>
              </TouchableOpacity>
            </View>
            {aiInsights.map(renderInsightCard)}
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actions, isTablet && styles.actionsTablet]}>
        {!experienceActive ? (
          <TouchableOpacity
            style={[styles.startButton, isTablet && styles.startButtonTablet]}
            onPress={startExperience}
          >
            <MaterialCommunityIcons name="play" size={isTablet ? 24 : 20} color="#fff" />
            <Text style={[styles.startButtonText, isTablet && styles.startButtonTextTablet]}>
              Start VR Experience
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.endButton, isTablet && styles.endButtonTablet]}
            onPress={endExperience}
          >
            <MaterialCommunityIcons name="stop" size={isTablet ? 24 : 20} color="#fff" />
            <Text style={[styles.endButtonText, isTablet && styles.endButtonTextTablet]}>
              End Experience
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Insight Detail Modal */}
      <Modal
        visible={!!currentInsight}
        animationType="slide"
        presentationStyle={isTablet ? "formSheet" : "pageSheet"}
        onRequestClose={() => setCurrentInsight(null)}
      >
        <View style={[styles.modalContainer, isTablet && styles.modalContainerTablet]}>
          <View style={[styles.modalHeader, isTablet && styles.modalHeaderTablet]}>
            <TouchableOpacity onPress={() => setCurrentInsight(null)}>
              <Ionicons name="close" size={isTablet ? 32 : 24} color="#fff" />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, isTablet && styles.modalTitleTablet]}>
              {currentInsight?.title}
            </Text>
            <View style={{ width: isTablet ? 32 : 24 }} />
          </View>
          
          <ScrollView style={[styles.modalContent, isTablet && styles.modalContentTablet]}>
            <Text style={[styles.modalText, isTablet && styles.modalTextTablet]}>
              {currentInsight?.content}
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  containerTablet: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Tanker',
  },
  loadingTextTablet: {
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTablet: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  titleTablet: {
    fontSize: 24,
  },
  subtitle: {
    color: '#EA580C',
    fontSize: 14,
    fontFamily: 'SpaceMono-Regular',
  },
  subtitleTablet: {
    fontSize: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  insightsButtonTablet: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  insightsCount: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
    fontFamily: 'Tanker',
  },
  insightsCountTablet: {
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#232323',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  progressContainerTablet: {
    marginHorizontal: 24,
    marginVertical: 12,
    paddingVertical: 16,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressLabel: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
  },
  progressLabelTablet: {
    fontSize: 14,
  },
  progressValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  progressValueTablet: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTablet: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Tanker',
  },
  sectionTitleTablet: {
    fontSize: 20,
  },
  contextCard: {
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 16,
  },
  contextCardTablet: {
    padding: 20,
  },
  contextPeriod: {
    color: '#EA580C',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Tanker',
  },
  contextPeriodTablet: {
    fontSize: 18,
  },
  contextCulture: {
    color: '#38bdf8',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Tanker',
  },
  contextCultureTablet: {
    fontSize: 16,
  },
  contextSignificance: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'SpaceMono-Regular',
  },
  contextSignificanceTablet: {
    fontSize: 16,
  },
  artifactsContainer: {
    marginTop: 12,
  },
  artifactsTitle: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Tanker',
  },
  artifactsTitleTablet: {
    fontSize: 16,
  },
  artifactItem: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 8,
    fontFamily: 'SpaceMono-Regular',
  },
  artifactItemTablet: {
    fontSize: 14,
  },
  vrCard: {
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 16,
  },
  vrCardTablet: {
    padding: 20,
  },
  vrScene: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Tanker',
  },
  vrSceneTablet: {
    fontSize: 18,
  },
  vrEnvironment: {
    color: '#10b981',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Tanker',
  },
  vrEnvironmentTablet: {
    fontSize: 16,
  },
  vrNarrative: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'SpaceMono-Regular',
  },
  vrNarrativeTablet: {
    fontSize: 16,
  },
  interactionsContainer: {
    marginTop: 8,
  },
  interactionsTitle: {
    color: '#8b5cf6',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Tanker',
  },
  interactionsTitleTablet: {
    fontSize: 16,
  },
  interactionItem: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 8,
    fontFamily: 'SpaceMono-Regular',
  },
  interactionItemTablet: {
    fontSize: 14,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  generateButtonTablet: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    fontFamily: 'Tanker',
  },
  generateButtonTextTablet: {
    fontSize: 14,
  },
  insightCard: {
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightCardTablet: {
    padding: 20,
    marginBottom: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
    fontFamily: 'Tanker',
  },
  insightTitleTablet: {
    fontSize: 16,
  },
  insightTime: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
  },
  insightTimeTablet: {
    fontSize: 14,
  },
  insightPreview: {
    color: '#aaa',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'SpaceMono-Regular',
  },
  insightPreviewTablet: {
    fontSize: 14,
  },
  actions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionsTablet: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 12,
  },
  startButtonTablet: {
    paddingVertical: 16,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'Tanker',
  },
  startButtonTextTablet: {
    fontSize: 18,
  },
  endButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 12,
  },
  endButtonTablet: {
    paddingVertical: 16,
  },
  endButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'Tanker',
  },
  endButtonTextTablet: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#191919',
  },
  modalContainerTablet: {
    paddingTop: 44,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalHeaderTablet: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  modalTitleTablet: {
    fontSize: 20,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalContentTablet: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  modalText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'SpaceMono-Regular',
  },
  modalTextTablet: {
    fontSize: 16,
  },
}); 