import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTrails } from '../../context/TrailContext';
import { getCurrentLocation } from '../../services/location';
import { uploadImage, pickImage, takePhoto } from '../../services/upload';
import { Ionicons } from '@expo/vector-icons';

export default function AddTrail() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { createTrail } = useTrails();
  const router = useRouter();

  // Get Current Location
  const getLocation = async () => {
    const locationData = await getCurrentLocation();
    if (locationData) {
      setLatitude(locationData.latitude.toString());
      setLongitude(locationData.longitude.toString());
      Alert.alert('Success', '📍 Location captured successfully!');
    } else {
      Alert.alert('Error', 'Could not get location. Please check permissions.');
    }
  };

  // Pick Image from Gallery
  const handlePickImage = async () => {
    const result = await pickImage();
    if (result.success) {
      setImage(result.uri);
    }
  };

  // Take Photo with Camera
  const handleTakePhoto = async () => {
    const result = await takePhoto();
    if (result.success) {
      setImage(result.uri);
    }
  };

  // Remove Image
  const removeImage = () => {
    setImage(null);
    setImageUrl('');
  };

  // Upload Image
  const uploadTrailImage = async () => {
    if (!image) return null;
    
    setUploading(true);
    const result = await uploadImage(image);
    setUploading(false);
    
    if (result.success) {
      return result.url;
    } else {
      Alert.alert('Upload Failed', 'Could not upload image. Trail will be added without image.');
      return null;
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!name || !location || !description || !distance || !duration) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!latitude || !longitude) {
      Alert.alert('Error', 'Please get location first!');
      return;
    }

    setLoading(true);

    // Upload image if selected
    let uploadedImageUrl = null;
    if (image) {
      uploadedImageUrl = await uploadTrailImage();
    }

    const result = await createTrail({
      name,
      location,
      description,
      distance: parseFloat(distance),
      duration,
      difficulty,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      imageUrl: uploadedImageUrl || '',
    });

    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Trail added successfully! 🏔️');
      router.back();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.title}>🏔️ Add New Trail</Text>
        
        {/* 📸 Image Picker */}
        <View style={styles.imageSection}>
          <Text style={styles.label}>Trail Photo</Text>
          
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageBtn} onPress={removeImage}>
                <Ionicons name="close-circle" size={28} color="#f44336" />
              </TouchableOpacity>
              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.uploadingText}>Uploading...</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.imagePickerContainer}>
              <TouchableOpacity style={styles.imagePickerBtn} onPress={handleTakePhoto}>
                <Ionicons name="camera" size={28} color="#2E7D32" />
                <Text style={styles.imagePickerText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imagePickerBtn} onPress={handlePickImage}>
                <Ionicons name="images" size={28} color="#2196F3" />
                <Text style={styles.imagePickerText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/*Form Fields */}
        <Text style={styles.label}>Trail Name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g., Adam's Peak" />
        
        <Text style={styles.label}>Location *</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g., Nuwara Eliya" />
        
        <Text style={styles.label}>Description *</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={description} 
          onChangeText={setDescription} 
          placeholder="Describe the trail..."
          multiline
          numberOfLines={4}
        />
        
        <Text style={styles.label}>Distance (km) *</Text>
        <TextInput 
          style={styles.input} 
          value={distance} 
          onChangeText={setDistance} 
          placeholder="e.g., 5.5"
          keyboardType="numeric"
        />
        
        <Text style={styles.label}>Duration *</Text>
        <TextInput style={styles.input} value={duration} onChangeText={setDuration} placeholder="e.g., 3 hours" />
        
        <Text style={styles.label}>Difficulty *</Text>
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

        {/* Location Section */}
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>📍 Trail Location on Map</Text>
          
          <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
            <Ionicons name="locate" size={20} color="#fff" />
            <Text style={styles.locationButtonText}>Get Current Location</Text>
          </TouchableOpacity>

          <View style={styles.coordinateRow}>
            <View style={styles.coordinateColumn}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput 
                style={styles.input} 
                value={latitude} 
                onChangeText={setLatitude} 
                placeholder="e.g., 6.8765"
                keyboardType="numeric"
                editable={!latitude}
              />
            </View>
            <View style={styles.coordinateColumn}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput 
                style={styles.input} 
                value={longitude} 
                onChangeText={setLongitude} 
                placeholder="e.g., 80.7718"
                keyboardType="numeric"
                editable={!longitude}
              />
            </View>
          </View>
          
          {latitude && longitude && (
            <View style={styles.locationInfo}>
              <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
              <Text style={styles.locationInfoText}>Location captured successfully!</Text>
            </View>
          )}
        </View>
        
        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={loading || uploading}
        >
          <Text style={styles.submitText}>
            {loading || uploading ? 'Adding Trail...' : 'Add Trail'}
          </Text>
        </TouchableOpacity>
        
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  //IMAGE PICKER
  imageSection: {
    marginBottom: 16,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imagePickerBtn: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  imagePickerText: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
  },
  
  //FORM
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  
  //DIFFICULTY
  difficultyContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  difficultyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    flex: 1,
    alignItems: 'center',
  },
  difficultySelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  difficultyText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  difficultyTextSelected: {
    color: '#fff',
  },
  
  //LOCATION
  locationSection: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  locationButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  coordinateColumn: {
    flex: 1,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    gap: 6,
  },
  locationInfoText: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '500',
  },
  
  //SUBMIT
  submitButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});