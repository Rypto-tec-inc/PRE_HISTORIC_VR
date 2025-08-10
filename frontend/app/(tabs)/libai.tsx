import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: string;
  suggestions?: string[];
}

export default function LibAIScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello${user?.fullName ? ` ${user.fullName}` : ''}! I'm Mis Nova, your AI guide to prehistoric Liberia! 🏛️\n\nI can help you explore our rich cultural heritage, learn about different tribes, discover traditional artifacts, and guide you through VR experiences. What would you like to learn about today?`,
      isUser: false,
      timestamp: new Date(),
      type: 'greeting',
      suggestions: [
        'Tell me about Bassa culture',
        'What VR experiences are available?',
        'Show me traditional artifacts',
        'Help me learn tribal languages'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputText.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Send message to AI API
      const response = await apiClient.sendChatMessage(text, {
        userId: user?.id,
        currentTribe: user?.tribe,
        userInterests: user?.interests
      });

      // Simulate typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.response || response.data?.response || "I'm sorry, I couldn't process that request right now.",
          isUser: false,
          timestamp: new Date(),
          type: response.type || response.data?.type,
          suggestions: response.suggestions || response.data?.suggestions || []
        };

        setMessages(prev => [...prev, aiMessage]);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds

    } catch (error) {
      console.error('AI Chat error:', error);
      setIsTyping(false);
      
      // Fallback AI response
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please try again, or ask me about:\n\n🏛️ Liberian tribes and their traditions\n🏺 Traditional artifacts and crafts\n🥽 VR cultural experiences\n🗣️ Indigenous languages\n📜 Historical information",
        isUser: false,
        timestamp: new Date(),
        type: 'error',
        suggestions: [
          'Tell me about Kpelle traditions',
          'Show me Bassa artifacts',
          'What VR experiences can I try?',
          'Help me learn about history'
        ]
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const formatMessageText = (text: string) => {
    // Split text by newlines and render each line
    return text.split('\n').map((line, index) => (
      <Text key={index} style={{ color: '#fff', fontSize: 16, lineHeight: 22 }}>
        {line}
        {index < text.split('\n').length - 1 && '\n'}
      </Text>
    ));
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={{
        alignSelf: message.isUser ? 'flex-end' : 'flex-start',
        backgroundColor: message.isUser ? '#d4af37' : '#2a2a2a',
        borderRadius: 16,
        padding: 12,
        marginVertical: 4,
        maxWidth: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
      }}
    >
      <View style={{ marginBottom: message.suggestions?.length ? 8 : 0 }}>
        {formatMessageText(message.text)}
      </View>
      
      {/* AI Message Suggestions */}
      {!message.isUser && message.suggestions && message.suggestions.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ color: '#999', fontSize: 12, marginBottom: 8 }}>
            Try asking:
          </Text>
          {message.suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderColor: '#d4af37',
                borderWidth: 1,
                borderRadius: 8,
                padding: 8,
                marginBottom: 4
              }}
              onPress={() => handleSuggestionPress(suggestion)}
              disabled={isLoading}
            >
              <Text style={{ color: '#d4af37', fontSize: 14 }}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <Text style={{
        color: message.isUser ? 'rgba(255,255,255,0.7)' : '#666',
        fontSize: 11,
        marginTop: 4,
        textAlign: message.isUser ? 'right' : 'left'
      }}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      {/* Header */}
      <View style={{
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#d4af37',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12
        }}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
            Mis Nova Chat
          </Text>
          <Text style={{ color: '#999', fontSize: 14 }}>
            {isTyping ? 'Mis Nova is typing...' : 'Your AI Cultural Guide'}
          </Text>
        </View>
        <View style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: '#10b981'
        }} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        
        {/* Typing Indicator */}
        {isTyping && (
          <View style={{
            alignSelf: 'flex-start',
            backgroundColor: '#2a2a2a',
            borderRadius: 16,
            padding: 12,
            marginVertical: 4,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <ActivityIndicator size="small" color="#d4af37" style={{ marginRight: 8 }} />
            <Text style={{ color: '#999', fontSize: 14 }}>Mis Nova is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          borderTopWidth: 1,
          borderTopColor: '#333',
          padding: 16,
          backgroundColor: '#1a1a1a'
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          backgroundColor: '#2a2a2a',
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 8
        }}>
          <TextInput
            style={{
              flex: 1,
              color: '#fff',
              fontSize: 16,
              maxHeight: 100,
              paddingVertical: 8
            }}
            placeholder="Ask Mis Nova about Liberian culture..."
            placeholderTextColor="#666"
            value={inputText}
            onChangeText={setInputText}
            multiline
            editable={!isLoading}
            onSubmitEditing={() => sendMessage()}
            blurOnSubmit={false}
          />
          
          <TouchableOpacity
            style={{
              backgroundColor: inputText.trim() && !isLoading ? '#d4af37' : '#555',
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8
            }}
            onPress={() => sendMessage()}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        
        {/* Quick Actions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12 }}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          {[
            'Tell me about tribes',
            'Show VR experiences',
            'Learn languages',
            'Historical artifacts',
            'Cultural traditions'
          ].map((action, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: '#333',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginHorizontal: 4
              }}
              onPress={() => handleSuggestionPress(action)}
              disabled={isLoading}
            >
              <Text style={{ color: '#d4af37', fontSize: 12 }}>{action}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 