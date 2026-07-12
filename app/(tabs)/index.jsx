import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, StatusBar, Image } from 'react-native';
import { useTrails } from '../../context/TrailContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { trails, loading } = useTrails();
  const { isAdmin } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.container}>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>🌿 EcoTrail</Text>
          <Text style={styles.subtitle}>Discover Sri Lanka's Trails</Text>
        </View>

        {isAdmin && (
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/trail/add')}>
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
            <Text style={styles.addButtonText}>Add New Trail</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.countText}>
          {trails.length} {trails.length === 1 ? 'Trail' : 'Trails'} Available
        </Text>

        <FlatList
          data={trails}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.trailCard} onPress={() => router.push(`/trail/${item.id}`)}>
              {/* 🏔️ Trail Image */}
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.trailImage} resizeMode="cover" />
              ) : (
                <View style={styles.trailImagePlaceholder}>
                  <Ionicons name="image-outline" size={40} color="#ccc" />
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
              
              <View style={styles.trailContent}>
                <View style={styles.trailHeader}>
                  <Text style={styles.trailName}>{item.name}</Text>
                  <View style={[
                    styles.difficultyBadge,
                    item.difficulty === 'Easy' && styles.easyBadge,
                    item.difficulty === 'Medium' && styles.mediumBadge,
                    item.difficulty === 'Hard' && styles.hardBadge,
                  ]}>
                    <Text style={styles.difficultyText}>{item.difficulty}</Text>
                  </View>
                </View>
                
                <Text style={styles.trailLocation}>
                  <Ionicons name="location-outline" size={14} color="#666" /> {item.location}
                </Text>
                
                <View style={styles.trailStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={16} color="#555" />
                    <Text style={styles.statText}>{item.duration}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="resize-outline" size={16} color="#555" />
                    <Text style={styles.statText}>{item.distance} km</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🏔️</Text>
              <Text style={styles.emptyTitle}>No Trails Yet</Text>
              <Text style={styles.emptySubtext}>Start by adding your first trail!</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  countText: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  trailCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  trailImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  trailImagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
  },
  trailContent: {
    padding: 14,
  },
  trailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trailName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
  },
  easyBadge: {
    backgroundColor: '#e8f5e9',
  },
  mediumBadge: {
    backgroundColor: '#fff3e0',
  },
  hardBadge: {
    backgroundColor: '#ffebee',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  trailLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  trailStats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 6,
  },
});