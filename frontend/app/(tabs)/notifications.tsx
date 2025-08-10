import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    FlatList,
    Image,
    Modal,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { apiClient } from '../../lib/api';

interface Notification {
  id: string;
  userId: string;
  type: 'community_post' | 'achievement' | 'vr_join' | 'map_visit' | 'daily_reminder' | 'weekly_challenge' | 'mention' | 'reaction' | 'comment' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  isArchived: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  relatedPostId?: string;
  relatedAchievementId?: string;
  badgeCount?: number;
}

interface NotificationStats {
  total: number;
  unread: number;
  archived: number;
  byType: { [key: string]: number };
  byPriority: { [key: string]: number };
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { width: screenWidth } = useWindowDimensions();
  const { connected } = useSocket();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    archived: 0,
    byType: {},
    byPriority: {},
  });
  
  // Filter states
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Responsive breakpoints
  const isTablet = screenWidth >= 768;

  // Notification categories
  const notificationCategories = [
    { key: 'all', label: 'All', icon: 'notifications' },
    { key: 'community_post', label: 'Community', icon: 'chatbubble' },
    { key: 'achievement', label: 'Achievements', icon: 'trophy' },
    { key: 'vr_join', label: 'VR Experiences', icon: 'glasses' },
    { key: 'map_visit', label: 'Map Activity', icon: 'map' },
    { key: 'mention', label: 'Mentions', icon: 'at' },
    { key: 'reaction', label: 'Reactions', icon: 'heart' },
    { key: 'comment', label: 'Comments', icon: 'chatbubble-ellipses' },
    { key: 'system', label: 'System', icon: 'settings' },
  ];

  // Priority colors
  const priorityColors = {
    low: '#10b981',
    normal: '#3b82f6',
    high: '#f59e0b',
    urgent: '#ef4444',
  };

  // Mock notification methods
  const mockApiMethods = {
    getNotifications: async () => ({
      notifications: [
        {
          id: '1',
          userId: user?.id || '',
          type: 'achievement' as const,
          title: 'Achievement Unlocked!',
          message: 'You\'ve completed your first VR experience',
          data: {},
          isRead: false,
          isArchived: false,
          priority: 'normal' as const,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          userId: user?.id || '',
          type: 'system' as const,
          title: 'Welcome to Prehistoric VR!',
          message: 'Start exploring Liberian culture today',
          data: {},
          isRead: true,
          isArchived: false,
          priority: 'low' as const,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        }
      ]
    }),
    markNotificationAsRead: async (id: string) => ({ success: true }),
    markAllNotificationsAsRead: async () => ({ success: true }),
    archiveNotification: async (id: string) => ({ success: true }),
    deleteNotification: async (id: string) => ({ success: true }),
  };

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await mockApiMethods.getNotifications();
      setNotifications(response.notifications || []);
      updateStats(response.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await mockApiMethods.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await mockApiMethods.markAllNotificationsAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true, readAt: new Date().toISOString() }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Archive notification
  const archiveNotification = async (notificationId: string) => {
    try {
      await mockApiMethods.archiveNotification(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isArchived: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error archiving notification:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await mockApiMethods.deleteNotification(notificationId);
              setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
            } catch (error) {
              console.error('Error deleting notification:', error);
            }
          }
        }
      ]
    );
  };

  // Update notification statistics
  const updateStats = (notificationList: Notification[]) => {
    const newStats: NotificationStats = {
      total: notificationList.length,
      unread: notificationList.filter(n => !n.isRead).length,
      archived: notificationList.filter(n => n.isArchived).length,
      byType: {},
      byPriority: {},
    };

    // Count by type
    notificationList.forEach(notif => {
      newStats.byType[notif.type] = (newStats.byType[notif.type] || 0) + 1;
      newStats.byPriority[notif.priority] = (newStats.byPriority[notif.priority] || 0) + 1;
    });

    setStats(newStats);
  };

  // Filter and search notifications
  const filterAndSearchNotifications = useCallback(() => {
    let filtered = [...notifications];

    // Filter by type
    if (filterType !== 'all') {
      switch (filterType) {
        case 'unread':
          filtered = filtered.filter(n => !n.isRead);
          break;
        case 'read':
          filtered = filtered.filter(n => n.isRead);
          break;
        case 'archived':
          filtered = filtered.filter(n => n.isArchived);
          break;
      }
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(n => n.type === filterCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query) ||
        (n.senderName && n.senderName.toLowerCase().includes(query))
      );
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredNotifications(filtered);
  }, [notifications, filterType, filterCategory, searchQuery]);

  // Handle notification press
  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    setSelectedNotification(notification);
    setShowNotificationModal(true);

    // Handle navigation based on notification type
    switch (notification.type) {
      case 'vr_join':
        if (notification.data?.vrExperienceId) {
          router.push('/(tabs)/vr');
        }
        break;
      case 'map_visit':
        router.push('/(tabs)/map');
        break;
      case 'achievement':
        router.push('/(tabs)/achievements');
        break;
      case 'community_post':
        if (notification.data?.postId) {
          router.push('/(tabs)/community');
        }
        break;
    }
  };

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, []);

  // Setup focus effect and initial load
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [user])
  );

  // Filter notifications when dependencies change
  useEffect(() => {
    filterAndSearchNotifications();
  }, [filterAndSearchNotifications]);

  // Entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Render notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const isUnread = !item.isRead;
    const priorityColor = priorityColors[item.priority];

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          isUnread && styles.unreadNotification,
          { borderLeftColor: priorityColor }
        ]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIcon}>
            <Ionicons
              name={getNotificationIcon(item.type)}
              size={20}
              color={priorityColor}
            />
          </View>
          <View style={styles.notificationContent}>
            <Text style={[styles.notificationTitle, isUnread && styles.unreadText]}>
              {item.title}
            </Text>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {item.message}
            </Text>
            <View style={styles.notificationMeta}>
              <Text style={styles.notificationTime}>
                {formatRelativeTime(item.createdAt)}
              </Text>
              {item.senderName && (
                <Text style={styles.notificationSender}>
                  from {item.senderName}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.notificationActions}>
            {isUnread && <View style={styles.unreadDot} />}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => archiveNotification(item.id)}
            >
              <Ionicons name="archive" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Get notification icon
  const getNotificationIcon = (type: string): any => {
    const iconMap: { [key: string]: any } = {
      community_post: 'chatbubble',
      achievement: 'trophy',
      vr_join: 'glasses',
      map_visit: 'map',
      daily_reminder: 'alarm',
      weekly_challenge: 'calendar',
      mention: 'at',
      reaction: 'heart',
      comment: 'chatbubble-ellipses',
      system: 'settings',
    };
    return iconMap[type] || 'notifications';
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const now = new Date().getTime();
    const notificationTime = new Date(dateString).getTime();
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Date(dateString).toLocaleDateString();
  };

  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-off" size={64} color="#666" />
      <Text style={styles.emptyStateTitle}>No notifications</Text>
      <Text style={styles.emptyStateMessage}>
        {filterType === 'all' 
          ? "You're all caught up! Check back later for updates."
          : `No ${filterType} notifications found.`
        }
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="notifications" size={48} color="#EA580C" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with stats and actions */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerStats}>
            <View style={styles.statBadge}>
              <Text style={styles.statNumber}>{stats.unread}</Text>
              <Text style={styles.statLabel}>Unread</Text>
            </View>
            <TouchableOpacity
              style={styles.connectionStatus}
              onPress={() => Alert.alert('Connection Status', connected ? 'Connected to server' : 'Offline mode')}
            >
              <View style={[styles.connectionDot, { backgroundColor: connected ? '#10b981' : '#ef4444' }]} />
              <Text style={styles.connectionText}>{connected ? 'Online' : 'Offline'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={20} color="#EA580C" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={markAllAsRead}
            disabled={stats.unread === 0}
          >
            <Ionicons 
              name="checkmark-done" 
              size={20} 
              color={stats.unread > 0 ? "#EA580C" : "#666"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <Animated.View style={[styles.filtersContainer, { opacity: fadeAnim }]}>
          {/* Search */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={16} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search notifications..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
            {['all', 'unread', 'read', 'archived'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterChip,
                  filterType === type && styles.activeFilterChip
                ]}
                onPress={() => setFilterType(type as any)}
              >
                <Text style={[
                  styles.filterChipText,
                  filterType === type && styles.activeFilterChipText
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Category filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryChips}>
            {notificationCategories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryChip,
                  filterCategory === category.key && styles.activeCategoryChip
                ]}
                onPress={() => setFilterCategory(category.key)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={14} 
                  color={filterCategory === category.key ? "#fff" : "#666"} 
                />
                <Text style={[
                  styles.categoryChipText,
                  filterCategory === category.key && styles.activeCategoryChipText
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Notifications list */}
      <Animated.View 
        style={[
          styles.listContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContent,
            filteredNotifications.length === 0 && styles.emptyListContent
          ]}
        />
      </Animated.View>

      {/* Notification detail modal */}
      <Modal
        visible={showNotificationModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotificationModal(false)}
      >
        {selectedNotification && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowNotificationModal(false)}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Notification Details</Text>
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => deleteNotification(selectedNotification.id)}
              >
                <Ionicons name="trash" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalNotificationHeader}>
                <View style={styles.modalNotificationIcon}>
                  <Ionicons
                    name={getNotificationIcon(selectedNotification.type)}
                    size={24}
                    color={priorityColors[selectedNotification.priority]}
                  />
                </View>
                <View style={styles.modalNotificationMeta}>
                  <Text style={styles.modalNotificationTitle}>
                    {selectedNotification.title}
                  </Text>
                  <Text style={styles.modalNotificationTime}>
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.modalNotificationMessage}>
                {selectedNotification.message}
              </Text>
              
              {selectedNotification.senderName && (
                <View style={styles.modalSenderInfo}>
                  <Text style={styles.modalSenderLabel}>From:</Text>
                  <Text style={styles.modalSenderName}>
                    {selectedNotification.senderName}
                  </Text>
                </View>
              )}
              
              <View style={styles.modalMetaInfo}>
                <View style={styles.modalMetaRow}>
                  <Text style={styles.modalMetaLabel}>Type:</Text>
                  <Text style={styles.modalMetaValue}>
                    {selectedNotification.type.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
                <View style={styles.modalMetaRow}>
                  <Text style={styles.modalMetaLabel}>Priority:</Text>
                  <View style={[
                    styles.modalPriorityBadge,
                    { backgroundColor: priorityColors[selectedNotification.priority] }
                  ]}>
                    <Text style={styles.modalPriorityText}>
                      {selectedNotification.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalMetaRow}>
                  <Text style={styles.modalMetaLabel}>Status:</Text>
                  <Text style={[
                    styles.modalMetaValue,
                    { color: selectedNotification.isRead ? '#10b981' : '#f59e0b' }
                  ]}>
                    {selectedNotification.isRead ? 'READ' : 'UNREAD'}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d97706',
  },
  statLabel: {
    fontSize: 10,
    color: '#92400e',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  connectionText: {
    fontSize: 12,
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 8,
  },
  filterChips: {
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#EA580C',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  categoryChips: {
    marginBottom: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  activeCategoryChip: {
    backgroundColor: '#EA580C',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  activeCategoryChipText: {
    color: '#fff',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#fefefe',
  },
  notificationHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginRight: 12,
  },
  notificationSender: {
    fontSize: 12,
    color: '#EA580C',
  },
  notificationActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EA580C',
    marginBottom: 8,
  },
  actionButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalActionButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalNotificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalNotificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalNotificationMeta: {
    flex: 1,
  },
  modalNotificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  modalNotificationTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  modalNotificationMessage: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalSenderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  modalSenderLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  modalSenderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  modalMetaInfo: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  modalMetaLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  modalMetaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  modalPriorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalPriorityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 