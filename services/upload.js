import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Cloudinary Config
const CLOUDINARY_CLOUD_NAME = 'dqquiiymz';
const UPLOAD_PRESET = 'ecotrail_preset';

// Upload to Cloudinary
export const uploadImage = async (uri) => {
  try {
    const data = new FormData();
    data.append('file', {
      uri: uri,
      type: 'image/jpeg',
      name: `trail_${Date.now()}.jpg`,
    });
    data.append('upload_preset', UPLOAD_PRESET);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      }
    );

    return { success: true, url: response.data.secure_url };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }
};

// Upload to Firebase Storage
export const uploadToFirebase = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const filename = `trail_${Date.now()}.jpg`;
    const storageRef = ref(storage, `trailImages/${filename}`);
    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    
    return { success: true, url: downloadUrl };
  } catch (error) {
    console.error('Firebase upload error:', error);
    return { success: false, error: error.message };
  }
};

// Pick image from gallery
export const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (!result.canceled) {
    return { success: true, uri: result.assets[0].uri };
  }
  return { success: false, uri: null };
};

// Take photo with camera
export const takePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 0.8,
  });

  if (!result.canceled) {
    return { success: true, uri: result.assets[0].uri };
  }
  return { success: false, uri: null };
};