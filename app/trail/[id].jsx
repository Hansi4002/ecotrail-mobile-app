import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  Image,
  Linking,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTrails } from '../../context/TrailContext';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function TrailDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { trails, removeTrail } = useTrails();
  const { isAdmin } = useAuth();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = trails.find(t => t.id === id);
    setTrail(found);
    setLoading(false);
  }, [id, trails]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Trail',
      'Are you sure you want to delete this trail?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const result = await removeTrail(id);
            if (result.success) {
              Alert.alert('Success', 'Trail deleted successfully!');
              router.back();
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  const openInGoogleMaps = () => {
    if (!trail?.latitude || !trail?.longitude) {
      Alert.alert('Error', 'Location data not available for this trail.');
      return;
    }
    const url = `https://www.google.com/maps?q=${trail.latitude},${trail.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open maps app.');
    });
  };

  const navigateToTrail = () => {
    if (!trail?.latitude || !trail?.longitude) {
      Alert.alert('Error', 'Location data not available for this trail.');
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${trail.latitude},${trail.longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open maps app.');
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (!trail) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Trail not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trail Details</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/*Trail Image */}
        {trail.imageUrl ? (
          <Image source={{ uri: trail.imageUrl }} style={styles.trailImage} resizeMode="cover" />
        ) : (
          <View style={styles.trailImagePlaceholder}>
            <Ionicons name="image-outline" size={60} color="#ccc" />
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        {/* Trail Info */}
        <View style={styles.content}>
          <Text style={styles.trailName}>{trail.name}</Text>
          <Text style={styles.trailLocation}>
            <Ionicons name="location-outline" size={18} color="#666" /> {trail.location}
          </Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={22} color="#2E7D32" />
              <Text style={styles.statValue}>{trail.duration}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="resize-outline" size={22} color="#2E7D32" />
              <Text style={styles.statValue}>{trail.distance} km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="flag-outline" size={22} color="#2E7D32" />
              <Text style={[
                styles.statValue,
                trail.difficulty === 'Easy' && styles.easyText,
                trail.difficulty === 'Medium' && styles.mediumText,
                trail.difficulty === 'Hard' && styles.hardText,
              ]}>
                {trail.difficulty}
              </Text>
              <Text style={styles.statLabel}>Difficulty</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📖 Description</Text>
            <Text style={styles.description}>{trail.description}</Text>
          </View>

          {/* Map Actions */}
          {trail.latitude && trail.longitude && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📍 Location</Text>
              <View style={styles.mapButtons}>
                <TouchableOpacity style={[styles.mapButton, styles.googleMapsBtn]} onPress={openInGoogleMaps}>
                  <Ionicons name="map-outline" size={20} color="#fff" />
                  <Text style={styles.mapButtonText}>Open in Google Maps</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.mapButton, styles.navigateBtn]} onPress={navigateToTrail}>
                  <Ionicons name="navigate-outline" size={20} color="#fff" />
                  <Text style={styles.mapButtonText}>Navigate Here</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.coordinates}>
                <Text style={styles.coordText}>
                  📍 {trail.latitude.toFixed(6)}, {trail.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          )}

          {/* Admin Actions */}
          {isAdmin && (
            <View style={styles.adminSection}>
              <TouchableOpacity 
                style={[styles.adminButton, styles.editButton]}
                onPress={() => router.push(`/trail/edit/${id}`)}
              >
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.adminButtonText}>Edit Trail</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.adminButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.adminButtonText}>Delete Trail</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Created Date */}
          <Text style={styles.dateText}>
            Added on {new Date(trail.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  //HEADER 
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerPlaceholder: {
    width: 32,
  },

  //CONTAINER
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  //IMAGE 
  trailImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#f0f0f0',
  },
  trailImagePlaceholder: {
    width: '100%',
    height: 240,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },

  //CONTENT 
  content: {
    padding: 16,
  },
  trailName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  trailLocation: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },

  //STATS 
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  easyText: {
    color: '#4CAF50',
  },
  mediumText: {
    color: '#FF9800',
  },
  hardText: {
    color: '#f44336',
  },

  //SECTION
  section: {
    marginTop: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
  },

  //MAP
  mapButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  googleMapsBtn: {
    backgroundColor: '#2196F3',
  },
  navigateBtn: {
    backgroundColor: '#4CAF50',
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  coordinates: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  coordText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },

  //ADMIN
  adminSection: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  adminButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 6,
  },
  editButton: {
    backgroundColor: '#2E7D32',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  //DATE 
  dateText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 30,
  },
});