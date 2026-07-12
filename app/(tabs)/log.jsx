import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useSpecies } from '../../context/SpeciesContext';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { uploadImage } from '../../services/upload';

export default function LogScreen() {
  const { logs, loading, createLog, removeLog } = useSpecies();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [speciesName, setSpeciesName] = useState('');
  const [speciesType, setSpeciesType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } catch (error) {}
      setModalVisible(true);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } catch (error) {}
      setModalVisible(true);
    }
  };

  const handleSubmit = async () => {
    if (!speciesName || !speciesType || !photo) {
      Alert.alert('Error', 'Please fill all fields and select a photo');
      return;
    }
    setUploading(true);
    const uploadResult = await uploadImage(photo);
    if (!uploadResult.success) {
      Alert.alert('Upload Failed', 'Could not upload photo');
      setUploading(false);
      return;
    }
    const result = await createLog({
      speciesName,
      speciesType,
      description,
      location: location ? `${location.latitude}, ${location.longitude}` : '',
      userId: user?.uid,
      userEmail: user?.email,
      photoUrl: uploadResult.url,
    }, photo);
    setUploading(false);
    if (result.success) {
      Alert.alert('✅ Success', 'Species logged successfully!');
      setModalVisible(false);
      setPhoto(null);
      setSpeciesName('');
      setSpeciesType('');
      setDescription('');
      setLocation(null);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleDelete = (id, photoUrl) => {
    Alert.alert('Delete Log', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await removeLog(id, photoUrl);
      }},
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.logCard}>
      <Image source={{ uri: item.photoUrl }} style={styles.logImage} />
      <View style={styles.logInfo}>
        <Text style={styles.logName}>{item.speciesName}</Text>
        <Text style={styles.logType}>📋 {item.speciesType}</Text>
        {item.description ? <Text style={styles.logDescription}>{item.description}</Text> : null}
        {item.location ? <Text style={styles.logLocation}>📍 {item.location}</Text> : null}
        <Text style={styles.logDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        {item.userId === user?.uid && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id, item.photoUrl)}>
            <Ionicons name="trash-outline" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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
          <Text style={styles.title}>📸 Species Log</Text>
          <Text style={styles.subtitle}>Document wildlife & nature</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.actionButton, styles.cameraButton]} onPress={openCamera}>
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.galleryButton]} onPress={openGallery}>
            <Ionicons name="images" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {logs.length > 0 ? (
          <FlatList
            data={logs}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🦋</Text>
            <Text style={styles.emptyText}>No species logged yet</Text>
            <Text style={styles.emptySubText}>Take a photo to start logging!</Text>
          </View>
        )}

        <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>📝 Log Species</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={28} color="#333" />
                  </TouchableOpacity>
                </View>
                {photo && <Image source={{ uri: photo }} style={styles.previewImage} />}
                <Text style={styles.label}>Species Name *</Text>
                <TextInput style={styles.input} value={speciesName} onChangeText={setSpeciesName} placeholder="e.g., Sri Lankan Leopard" />
                <Text style={styles.label}>Species Type *</Text>
                <TextInput style={styles.input} value={speciesType} onChangeText={setSpeciesType} placeholder="Mammal, Bird, Plant..." />
                <Text style={styles.label}>Description</Text>
                <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Describe what you saw..." multiline numberOfLines={3} />
                {location && (
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationText}>📍 Location captured</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={uploading}>
                  <Text style={styles.submitButtonText}>{uploading ? '⏳ Uploading...' : '✅ Save Log'}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titleContainer: { paddingVertical: 12, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  buttonRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 8 },
  cameraButton: { backgroundColor: '#2E7D32' },
  galleryButton: { backgroundColor: '#2196F3' },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  listContent: { paddingBottom: 20 },
  logCard: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 12, overflow: 'hidden', elevation: 2 },
  logImage: { width: '100%', height: 200 },
  logInfo: { padding: 14 },
  logName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  logType: { fontSize: 14, color: '#666', marginTop: 2 },
  logDescription: { fontSize: 14, color: '#666', marginTop: 4 },
  logLocation: { fontSize: 12, color: '#999', marginTop: 4 },
  logDate: { fontSize: 12, color: '#999', marginTop: 2 },
  deleteButton: { position: 'absolute', top: 10, right: 10, backgroundColor: '#f44336', padding: 8, borderRadius: 20, width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#333' },
  emptySubText: { fontSize: 14, color: '#999', marginTop: 6, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2E7D32' },
  previewImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  locationInfo: { backgroundColor: '#e8f5e9', padding: 10, borderRadius: 8, marginTop: 10 },
  locationText: { color: '#2E7D32', fontSize: 12 },
  submitButton: { backgroundColor: '#2E7D32', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 10 },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});