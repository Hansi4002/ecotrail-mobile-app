import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTrails } from '../../context/TrailContext';
import { useAuth } from '../../context/AuthContext';

export default function TrailDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { trails, removeTrail } = useTrails();
  const { isAdmin } = useAuth();
  const [trail, setTrail] = useState(null);

  useEffect(() => {
    const found = trails.find(t => t.id === id);
    setTrail(found);
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

  if (!trail) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{trail.name}</Text>
      <Text style={styles.location}>📍 {trail.location}</Text>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{trail.distance} km</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{trail.duration}</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.difficultyText]}>{trail.difficulty}</Text>
          <Text style={styles.statLabel}>Difficulty</Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{trail.description}</Text>
      
      {isAdmin && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.editButton]}
            onPress={() => router.push(`/trail/edit/${id}`)}
          >
            <Text style={styles.buttonText}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32' },
  location: { fontSize: 18, color: '#666', marginTop: 5 },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, paddingVertical: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 5 },
  difficultyText: { color: '#2E7D32' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
  description: { fontSize: 16, color: '#666', lineHeight: 24 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 40 },
  button: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
  editButton: { backgroundColor: '#2E7D32' },
  deleteButton: { backgroundColor: '#f44336' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});