import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface TabItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
  color: string;
  gradientColors?: string[];
}

const tabs: TabItem[] = [
  {
    name: 'properties',
    icon: 'home-outline',
    iconFocused: 'home',
    label: 'Home',
    route: '/main/screens/(tabs)/properties',
    color: '#10B981',
    gradientColors: ['#10B981', '#059669'],
  },
  {
    name: 'wallet',
    icon: 'wallet-outline',
    iconFocused: 'wallet',
    label: 'Wallet',
    route: '/main/screens/(tabs)/wallet',
    color: '#8B5CF6',
    gradientColors: ['#8B5CF6', '#7C3AED'],
  },
  {
    name: 'portfolio',
    icon: 'bar-chart-outline',
    iconFocused: 'bar-chart',
    label: 'Portfolio',
    route: '/main/screens/(tabs)/portfolio',
    color: '#F59E0B',
    gradientColors: ['#F59E0B', '#D97706'],
  },
  {
    name: 'chatbot',
    icon: 'chatbubble-outline',
    iconFocused: 'chatbubble',
    label: 'AI Chat',
    route: '/main/screens/(tabs)/chatbot',
    color: '#667eea',
    gradientColors: ['#667eea', '#764ba2'],
  },
  {
    name: 'profile',
    icon: 'person-outline',
    iconFocused: 'person',
    label: 'Profile',
    route: '/main/screens/(tabs)/profile',
    color: '#EF4444',
    gradientColors: ['#EF4444', '#DC2626'],
  },
];

const CustomTabBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const getCurrentTab = () => {
    const currentTab = tabs.find(tab => pathname.includes(tab.name));
    return currentTab ? currentTab.name : 'properties';
  };

  const currentTab = getCurrentTab();

  const handleTabPress = (tab: TabItem) => {
    router.push(tab.route as any);
  };

  const ProfileAvatar = ({ isActive }: { isActive: boolean }) => (
    <View style={[styles.avatarContainer, isActive && styles.avatarActive]}>
      <LinearGradient
        colors={isActive ? ['#EF4444', '#DC2626'] : ['#E5E7EB', '#D1D5DB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatar}
      >
        <Text style={[styles.avatarText, { color: isActive ? 'white' : '#6B7280' }]}>
          JD
        </Text>
      </LinearGradient>
    </View>
  );

  const TabButton: React.FC<{ tab: TabItem; isActive: boolean }> = ({
    tab,
    isActive,
  }) => {
    const isProfileTab = tab.name === 'profile';
    
    return (
      <TouchableOpacity
        onPress={() => handleTabPress(tab)}
        style={[styles.tabButton, isActive && styles.tabButtonActive]}
        activeOpacity={0.7}
      >
        <View style={styles.tabContent}>
          {isProfileTab ? (
            <ProfileAvatar isActive={isActive} />
          ) : (
            <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
              {isActive ? (
                <LinearGradient
                  colors={tab.gradientColors || [tab.color, tab.color]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.activeIconBackground}
                >
                  <Ionicons
                    name={tab.iconFocused}
                    size={22}
                    color="white"
                  />
                </LinearGradient>
              ) : (
                <Ionicons
                  name={tab.icon}
                  size={22}
                  color="#8E8E93"
                />
              )}
            </View>
          )}
          
          <Text
            style={[
              styles.tabLabel,
              isActive && { color: tab.color, fontWeight: '600' }
            ]}
            numberOfLines={1}
          >
            {tab.label}
          </Text>
          
          {/* Active indicator dot */}
          {isActive && (
            <View style={[styles.activeDot, { backgroundColor: tab.color }]} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {/* Subtle gradient background */}
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Top border with gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topBorder}
      />
      
      <View style={styles.tabRow}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.name}
            tab={tab}
            isActive={currentTab === tab.name}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  tabRow: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  tabButtonActive: {
    transform: [{ scale: 1.02 }],
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconContainerActive: {
    transform: [{ scale: 1.1 }],
  },
  activeIconBackground: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 4,
  },
  avatarActive: {
    transform: [{ scale: 1.1 }],
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabLabel: {
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});

export default CustomTabBar; 