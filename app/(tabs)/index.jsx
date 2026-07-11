import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTrails } from '../../context/TrailContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

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
    <View style={styles.container}>
      <Text style={styles.title}>🌿 EcoTrail</Text>
      <Text style={styles.subtitle}>Discover Sri Lanka's Trails</Text>
      
      {isAdmin && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/trail/add')}
        >
          <Text style={styles.addButtonText}>+ Add New Trail</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={trails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.trailCard}
            onPress={() => router.push(`/trail/${item.id}`)}
          >
            <Text style={styles.trailName}>{item.name}</Text>
            <Text style={styles.trailLocation}>📍 {item.location}</Text>
            <View style={styles.trailStats}>
              <Text>⏱️ {item.duration}</Text>
              <Text>📏 {item.distance} km</Text>
              <Text style={[
                styles.difficulty,
                item.difficulty === 'Easy' && styles.easy,
                item.difficulty === 'Medium' && styles.medium,
                item.difficulty === 'Hard' && styles.hard,
              ]}>
                {item.difficulty}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No trails yet. Add your first trail!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  addButton: { 
    backgroundColor: '#2E7D32', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 20 
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  trailCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trailName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  trailLocation: { fontSize: 14, color: '#666', marginTop: 5 },
  trailStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  difficulty: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 5 },
  easy: { backgroundColor: '#4CAF50', color: '#fff' },
  medium: { backgroundColor: '#FF9800', color: '#fff' },
  hard: { backgroundColor: '#f44336', color: '#fff' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 50 },
});