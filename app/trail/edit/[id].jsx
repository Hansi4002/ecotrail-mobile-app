import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTrails } from '../../../context/TrailContext';

export default function EditTrail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { trails, editTrail } = useTrails();
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const trail = trails.find(t => t.id === id);
    if (trail) {
      setName(trail.name);
      setLocation(trail.location);
      setDescription(trail.description);
      setDistance(trail.distance.toString());
      setDuration(trail.duration);
      setDifficulty(trail.difficulty);
    }
    setInitialLoading(false);
  }, [id, trails]);

  const handleSubmit = async () => {
    if (!name || !location || !description || !distance || !duration) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    const result = await editTrail(id, {
      name,
      location,
      description,
      distance: parseFloat(distance),
      duration,
      difficulty
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Trail updated successfully!');
      router.back();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>✏️ Edit Trail</Text>
      
      <Text style={styles.label}>Trail Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      
      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />
      
      <Text style={styles.label}>Description</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        value={description} 
        onChangeText={setDescription} 
        multiline
        numberOfLines={4}
      />
      
      <Text style={styles.label}>Distance (km)</Text>
      <TextInput style={styles.input} value={distance} onChangeText={setDistance} keyboardType="numeric" />
      
      <Text style={styles.label}>Duration</Text>
      <TextInput style={styles.input} value={duration} onChangeText={setDuration} />
      
      <Text style={styles.label}>Difficulty</Text>
      <View style={styles.difficultyContainer}>
        {['Easy', 'Medium', 'Hard'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.difficultyButton,
              difficulty === level && styles.difficultySelected
            ]}
            onPress={() => setDifficulty(level)}
          >
            <Text style={[
              styles.difficultyText,
              difficulty === level && styles.difficultyTextSelected
            ]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitText}>{loading ? 'Updating...' : 'Update Trail'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  difficultyContainer: { flexDirection: 'row', gap: 10, marginTop: 5 },
  difficultyButton: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#ddd',
    marginRight: 10,
  },
  difficultySelected: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  difficultyText: { color: '#333' },
  difficultyTextSelected: { color: '#fff' },
  submitButton: { 
    backgroundColor: '#2E7D32', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 30,
    marginBottom: 40,
  },
  submitText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});