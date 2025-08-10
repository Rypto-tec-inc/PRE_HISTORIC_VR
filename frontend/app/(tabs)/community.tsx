import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

interface VideoParticipant {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isCameraOn: boolean;
  isHost: boolean;
  isScreenSharing: boolean;
  position: { x: number; y: number };
}

interface CallRoom {
  id: string;
  name: string;
  participants: VideoParticipant[];
  isActive: boolean;
  maxParticipants: number;
}

export default function CommunityScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Mock socket data since backend is removed
  const isConnected = false;
  const onlineUsers: any[] = [];
  
  const [currentRoom, setCurrentRoom] = useState<CallRoom | null>(null);
  const [participants, setParticipants] = useState<VideoParticipant[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Available meeting rooms
  const meetingRooms = [
    { id: '1', name: 'General Meeting', participants: 0, maxParticipants: 50 },
    { id: '2', name: 'Team Collaboration', participants: 0, maxParticipants: 20 },
    { id: '3', name: 'Training Session', participants: 0, maxParticipants: 30 },
    { id: '4', name: 'Cultural Exchange', participants: 0, maxParticipants: 25 },
    { id: '5', name: 'Business Meeting', participants: 0, maxParticipants: 15 },
  ];

  // Load meeting rooms from API
  const [rooms, setRooms] = useState(meetingRooms);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Load meeting rooms
  const loadMeetingRooms = async () => {
    setLoadingRooms(true);
    try {
      // Mock API response since backend is removed
      setTimeout(() => {
        setRooms(meetingRooms); // Use the default rooms
        setLoadingRooms(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading meeting rooms:', error);
      setLoadingRooms(false);
    }
  };

  // Load rooms on component mount
  useEffect(() => {
    loadMeetingRooms();
  }, []);

  // Initialize call timer
  useEffect(() => {
    if (currentRoom) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [currentRoom]);

  // Join a meeting room
  const joinMeeting = async (room: any) => {
    try {
      // Mock API response since backend is removed
      // const response = await apiClient.joinMeeting(room.id, user?.fullName, user?.avatarUrl);
      
      const newParticipant: VideoParticipant = {
        id: Date.now().toString(),
        userId: user?.id.toString() || '',
        userName: user?.fullName || user?.email || 'Anonymous',
        userAvatar: user?.avatarUrl || '',
        isSpeaking: false,
        isMuted: false,
        isCameraOn: true,
        isHost: room.participants === 0, // First person becomes host
        isScreenSharing: false,
        position: { x: 0, y: 0 }
      };

      const newRoom: CallRoom = {
        id: room.id,
        name: room.name,
        participants: [newParticipant],
        isActive: true,
        maxParticipants: room.maxParticipants
      };

      setCurrentRoom(newRoom);
      setParticipants([newParticipant]);
      setIsHost(newParticipant.isHost);
      
      Alert.alert('Meeting Joined', `Welcome to ${room.name}! You are ${newParticipant.isHost ? 'the host' : 'a participant'}.`);
    } catch (error) {
      console.error('Error joining meeting:', error);
      Alert.alert('Error', 'Failed to join meeting. Please try again.');
    }
  };

  // Leave meeting
  const leaveMeeting = async () => {
    if (currentRoom) {
      Alert.alert(
        'Leave Meeting',
        'Are you sure you want to leave this meeting?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Leave', 
            style: 'destructive',
            onPress: async () => {
              try {
                // Mock API call since backend is removed
                // await apiClient.leaveMeeting(currentRoom.id);
              } catch (error) {
                console.error('Error leaving meeting:', error);
              }
              
              setCurrentRoom(null);
              setParticipants([]);
              setIsMuted(false);
              setIsCameraOn(true);
              setIsScreenSharing(false);
              setIsHost(false);
              setCallDuration(0);
              setIsRecording(false);
              setShowChat(false);
            }
          }
        ]
      );
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    setParticipants(prev => 
      prev.map(p => p.userId === user?.id.toString() ? { ...p, isMuted: !isMuted } : p)
    );
  };

  // Toggle camera
  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    setParticipants(prev => 
      prev.map(p => p.userId === user?.id.toString() ? { ...p, isCameraOn: !isCameraOn } : p)
    );
  };

  // Toggle screen sharing
  const toggleScreenSharing = () => {
    setIsScreenSharing(!isScreenSharing);
    setParticipants(prev => 
      prev.map(p => p.userId === user?.id.toString() ? { ...p, isScreenSharing: !isScreenSharing } : p)
    );
    Alert.alert('Screen Sharing', isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started');
  };

  // Toggle recording
  const toggleRecording = () => {
    if (isHost) {
      setIsRecording(!isRecording);
      Alert.alert('Recording', isRecording ? 'Recording stopped' : 'Recording started');
    } else {
      Alert.alert('Permission Denied', 'Only the host can control recording.');
    }
  };

  // Add participant (simulate)
  const addParticipant = () => {
    const newParticipant: VideoParticipant = {
      id: Date.now().toString(),
      userId: `user_${Date.now()}`,
      userName: `Participant ${participants.length + 1}`,
      userAvatar: `https://randomuser.me/api/portraits/lego/${participants.length + 1}.jpg`,
      isSpeaking: Math.random() > 0.7,
      isMuted: Math.random() > 0.5,
      isCameraOn: Math.random() > 0.3,
      isHost: false,
      isScreenSharing: false,
      position: { x: 0, y: 0 }
    };
    setParticipants(prev => [...prev, newParticipant]);
  };

  // Remove participant
  const removeParticipant = (participantId: string) => {
    if (isHost) {
      setParticipants(prev => prev.filter(p => p.id !== participantId));
    }
  };

  // Format call duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render video participant
  const renderVideoParticipant = ({ item }: { item: VideoParticipant }) => {
    const isOwnParticipant = item.userId === user?.id.toString();
    const isSpeaking = item.isSpeaking;
    const isMuted = item.isMuted;
    const isCameraOff = !item.isCameraOn;

    return (
      <View style={[
        styles.videoParticipant,
        isSpeaking && styles.speakingParticipant,
        isOwnParticipant && styles.ownParticipant
      ]}>
        {isCameraOff ? (
          <View style={styles.cameraOffContainer}>
            <Ionicons name="videocam-off" size={32} color="#fff" />
            <Text style={styles.cameraOffText}>{item.userName}</Text>
          </View>
        ) : (
          <Image 
            source={{ uri: item.userAvatar || 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
            style={styles.videoParticipantAvatar} 
          />
        )}
        
        <View style={styles.participantInfo}>
          <Text style={styles.participantName}>{item.userName}</Text>
          {item.isHost && <Text style={styles.hostBadge}>Host</Text>}
          {item.isScreenSharing && <Text style={styles.screenShareBadge}>Screen</Text>}
        </View>
        
        <View style={styles.participantStatus}>
          {isMuted && <Ionicons name="mic-off" size={16} color="#ef4444" />}
          {isCameraOff && <Ionicons name="videocam-off" size={16} color="#ef4444" />}
          {item.isScreenSharing && <Ionicons name="desktop" size={16} color="#10b981" />}
        </View>
        
        {isHost && !isOwnParticipant && (
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeParticipant(item.id)}
          >
            <Ionicons name="close-circle" size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Render meeting room
  const renderMeetingRoom = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.meetingRoom}
      onPress={() => joinMeeting(item)}
    >
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.roomParticipants}>
          {item.participants}/{item.maxParticipants} participants
        </Text>
      </View>
      <Ionicons name="videocam" size={24} color="#EA580C" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Video Meetings</Text>
          <View style={[styles.connectionStatus, { backgroundColor: isConnected ? '#10b981' : '#ef4444' }]}>
            <Text style={styles.connectionText}>
              {isConnected ? '🟢' : '🔴'} Connected
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={() => setShowSettings(!showSettings)}
          >
            <Ionicons name="settings" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {currentRoom ? (
          /* Video Call Interface */
          <View style={styles.videoCallContainer}>
            {/* Call Info */}
            <View style={styles.callInfo}>
              <Text style={styles.callTitle}>{currentRoom.name}</Text>
              <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
              <Text style={styles.participantCount}>
                {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </Text>
            </View>

            {/* Video Grid */}
            <FlatList
              data={participants}
              keyExtractor={item => item.id}
              renderItem={renderVideoParticipant}
              numColumns={2}
              style={styles.videoGrid}
              contentContainerStyle={styles.videoGridContent}
            />

            {/* Video Controls */}
            <View style={styles.videoControls}>
              <TouchableOpacity 
                style={[styles.controlButton, isMuted && styles.controlButtonActive]} 
                onPress={toggleMute}
              >
                <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={24} color={isMuted ? '#ef4444' : '#fff'} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.controlButton, !isCameraOn && styles.controlButtonActive]} 
                onPress={toggleCamera}
              >
                <Ionicons name={isCameraOn ? 'videocam' : 'videocam-off'} size={24} color={isCameraOn ? '#fff' : '#ef4444'} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.controlButton, isScreenSharing && styles.controlButtonActive]} 
                onPress={toggleScreenSharing}
              >
                <Ionicons name="desktop" size={24} color={isScreenSharing ? '#10b981' : '#fff'} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.controlButton, styles.controlButtonDanger]} 
                onPress={leaveMeeting}
              >
                <Ionicons name="call" size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.controlButton, showChat && styles.controlButtonActive]} 
                onPress={() => setShowChat(!showChat)}
              >
                <Ionicons name="chatbubble" size={24} color={showChat ? '#3b82f6' : '#fff'} />
              </TouchableOpacity>
              
              {isHost && (
                <TouchableOpacity 
                  style={[styles.controlButton, isRecording && styles.controlButtonActive]} 
                  onPress={toggleRecording}
                >
                  <Ionicons name={isRecording ? 'stop-circle' : 'radio-button-on'} size={24} color={isRecording ? '#ef4444' : '#fff'} />
                </TouchableOpacity>
              )}
            </View>

            {/* Demo: Add participant button */}
            <TouchableOpacity 
              style={styles.addParticipantButton}
              onPress={addParticipant}
            >
              <Text style={styles.addParticipantText}>Add Demo Participant</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Meeting Rooms List */
          <View style={styles.meetingRoomsContainer}>
            <Text style={styles.sectionTitle}>Available Meetings</Text>
            <FlatList
              data={rooms}
              keyExtractor={item => item.id}
              renderItem={renderMeetingRoom}
              style={styles.meetingRoomsList}
              showsVerticalScrollIndicator={false}
            />
            
            <View style={styles.createMeetingSection}>
              <Text style={styles.createMeetingTitle}>Create New Meeting</Text>
              <TouchableOpacity 
                style={styles.createMeetingButton}
                onPress={() => Alert.alert('Create Meeting', 'Meeting creation feature coming soon!')}
              >
                <Ionicons name="add-circle" size={24} color="#EA580C" />
                <Text style={styles.createMeetingText}>Start New Meeting</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Participants Panel */}
      {showParticipants && currentRoom && (
        <View style={styles.participantsPanel}>
          <View style={styles.participantsHeader}>
            <Text style={styles.participantsTitle}>Participants ({participants.length})</Text>
            <TouchableOpacity onPress={() => setShowParticipants(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={participants}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.participantItem}>
                <Image 
                  source={{ uri: item.userAvatar || 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
                  style={styles.participantAvatar} 
                />
                <View style={styles.participantInfo}>
                  <Text style={styles.participantName}>{item.userName}</Text>
                  <Text style={styles.participantStatus}>
                    {item.isHost ? 'Host' : 'Participant'}
                  </Text>
                </View>
                <View style={styles.participantControls}>
                  {item.isMuted && <Ionicons name="mic-off" size={16} color="#ef4444" />}
                  {!item.isCameraOn && <Ionicons name="videocam-off" size={16} color="#ef4444" />}
                </View>
              </View>
            )}
            style={styles.participantsList}
          />
        </View>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <View style={styles.settingsPanel}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.settingsContent}>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="mic" size={20} color="#fff" />
              <Text style={styles.settingText}>Audio Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="videocam" size={20} color="#fff" />
              <Text style={styles.settingText}>Video Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="wifi" size={20} color="#fff" />
              <Text style={styles.settingText}>Network Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="shield-checkmark" size={20} color="#fff" />
              <Text style={styles.settingText}>Privacy Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  connectionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  settingsButton: {
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 8,
  },
  mainContent: {
    flex: 1,
  },
  videoCallContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  callInfo: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  callTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  callDuration: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'SpaceMono-Regular',
    marginTop: 4,
  },
  participantCount: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
    marginTop: 2,
  },
  videoGrid: {
    flex: 1,
  },
  videoGridContent: {
    padding: 8,
  },
  videoParticipant: {
    flex: 1,
    margin: 4,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
  speakingParticipant: {
    borderWidth: 2,
    borderColor: '#10b981',
  },
  ownParticipant: {
    borderWidth: 2,
    borderColor: '#EA580C',
  },
  cameraOffContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cameraOffText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Tanker',
  },
  videoParticipantAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  participantInfo: {
    alignItems: 'center',
  },
  participantName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    textAlign: 'center',
  },
  hostBadge: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  screenShareBadge: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  participantStatus: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  controlButton: {
    backgroundColor: '#333',
    borderRadius: 25,
    padding: 12,
    marginHorizontal: 8,
  },
  controlButtonActive: {
    backgroundColor: '#ef4444',
  },
  controlButtonDanger: {
    backgroundColor: '#ef4444',
  },
  addParticipantButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addParticipantText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Tanker',
  },
  meetingRoomsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginBottom: 16,
  },
  meetingRoomsList: {
    flex: 1,
  },
  meetingRoom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  roomParticipants: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'SpaceMono-Regular',
    marginTop: 4,
  },
  createMeetingSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  createMeetingTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginBottom: 12,
  },
  createMeetingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    borderRadius: 12,
    padding: 16,
  },
  createMeetingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
    marginLeft: 8,
  },
  participantsPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#232323',
    borderLeftWidth: 1,
    borderLeftColor: '#333',
  },
  participantsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  participantsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  participantsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Tanker',
  },
  participantStatus: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'SpaceMono-Regular',
  },
  participantControls: {
    flexDirection: 'row',
    gap: 4,
  },
  settingsPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#232323',
    borderLeftWidth: 1,
    borderLeftColor: '#333',
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Tanker',
  },
  settingsContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Tanker',
    marginLeft: 12,
  },
}); 