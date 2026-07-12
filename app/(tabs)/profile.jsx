import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useTrails } from '../../context/TrailContext';
import { useSpecies } from '../../context/SpeciesContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const { trails } = useTrails();
  const { logs } = useSpecies();
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user?.email) {
      setUserName(user.email.split('@')[0]);
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        await logout();
        router.replace('/(auth)/login');
      }},
    ]);
  };

  const trailCount = trails?.length || 0;
  const speciesCount = logs?.length || 0;
  const badgeCount = (trailCount >= 1 ? 1 : 0) + (trailCount >= 5 ? 1 : 0) + (speciesCount >= 1 ? 1 : 0);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'This feature is coming soon! 🚀');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This feature is coming soon! 🔐');
  };

  const handleHikingHistory = () => {
    Alert.alert('Hiking History', `You have completed ${trailCount} trails! 🏔️`);
  };

  const handleAppSettings = () => {
    Alert.alert('App Settings', 'This feature is coming soon! ⚙️');
  };

  const handleManageUsers = () => {
    Alert.alert('Manage Users', 'This feature is coming soon! 👥');
  };

  const handleViewAnalytics = () => {
    Alert.alert('View Analytics', 
      `📊 Your Stats:\n\n` +
      `🏔️ Trails: ${trailCount}\n` +
      `📸 Species: ${speciesCount}\n` +
      `🏆 Badges: ${badgeCount}`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>👤 Profile</Text>
          <Text style={styles.subtitle}>Your hiking journey</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="trail-sign-outline" size={28} color="#2E7D32" />
            <Text style={styles.statNumber}>{trailCount}</Text>
            <Text style={styles.statLabel}>Trails</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="camera-outline" size={28} color="#2196F3" />
            <Text style={styles.statNumber}>{speciesCount}</Text>
            <Text style={styles.statLabel}>Species</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="medal-outline" size={28} color="#FF9800" />
            <Text style={styles.statNumber}>{badgeCount}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        {/* Badges */}
        {badgeCount > 0 && (
          <View style={styles.badgesSection}>
            <Text style={styles.sectionTitle}>🏆 Achievements</Text>
            <View style={styles.badgesContainer}>
              {trailCount >= 1 && <View style={styles.badgeItem}><Text style={styles.badgeText}>🌱 First Hike</Text></View>}
              {trailCount >= 5 && <View style={styles.badgeItem}><Text style={styles.badgeText}>🗺️ Explorer</Text></View>}
              {speciesCount >= 1 && <View style={styles.badgeItem}><Text style={styles.badgeText}>🌿 Nature Lover</Text></View>}
            </View>
          </View>
        )}

        {/* Settings Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>⚙️ Settings</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile} activeOpacity={0.7}>
            <Ionicons name="person-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" style={styles.menuArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword} activeOpacity={0.7}>
            <Ionicons name="lock-closed-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" style={styles.menuArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleHikingHistory} activeOpacity={0.7}>
            <Ionicons name="time-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Hiking History</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" style={styles.menuArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleAppSettings} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={22} color="#333" />
            <Text style={styles.menuText}>App Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" style={styles.menuArrow} />
          </TouchableOpacity>
        </View>

        {/* Admin Panel */}
        {user?.email === 'admin@gmail.com' && (
          <View style={styles.adminSection}>
            <Text style={styles.sectionTitle}>👑 Admin Panel</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/trail/add')} activeOpacity={0.7}>
              <Ionicons name="add-circle-outline" size={22} color="#2E7D32" />
              <Text style={[styles.menuText, styles.adminText]}>Add New Trail</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" style={styles.menuArrow} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleManageUsers} activeOpacity={0.7}>
              <Ionicons name="people-outline" size={22} color="#2E7D32" />
              <Text style={[styles.menuText, styles.adminText]}>Manage Users</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" style={styles.menuArrow} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleViewAnalytics} activeOpacity={0.7}>
              <Ionicons name="stats-chart-outline" size={22} color="#2E7D32" />
              <Text style={[styles.menuText, styles.adminText]}>View Analytics</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" style={styles.menuArrow} />
            </TouchableOpacity>
          </View>
        )}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>EcoTrail v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  titleContainer: { paddingVertical: 12, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  avatarContainer: { alignItems: 'center', paddingVertical: 20, backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, elevation: 2 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  userName: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginTop: 12 },
  userEmail: { fontSize: 14, color: '#888', marginTop: 4 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 16, elevation: 2 },
  statCard: { alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 4 },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  badgesSection: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 16, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#999', marginBottom: 10 },
  badgesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badgeItem: { backgroundColor: '#e8f5e9', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 13, color: '#2E7D32', fontWeight: '500' },
  menuSection: { backgroundColor: '#fff', paddingHorizontal: 16, borderRadius: 16, marginBottom: 16, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuText: { fontSize: 16, color: '#333', marginLeft: 12, flex: 1 },
  menuArrow: { marginLeft: 'auto' },
  adminText: { color: '#2E7D32' },
  adminSection: { backgroundColor: '#fff', paddingHorizontal: 16, borderRadius: 16, marginBottom: 16, elevation: 2 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f44336', padding: 15, borderRadius: 12, marginTop: 8, gap: 8 },
  logoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  versionText: { textAlign: 'center', color: '#999', fontSize: 12, marginTop: 16, marginBottom: 30 },
});