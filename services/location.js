import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

// Location permission request
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required for this feature.');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Location permission error:', error);
    return false;
  }
};

// Get current location
export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  } catch (error) {
    console.error('Get location error:', error);
    return null;
  }
};

// Watch location changes
export const watchLocation = (callback) => {
  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 10,
    },
    (location) => {
      callback({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  );
};

// Reverse geocode - get address from coordinates
export const getAddressFromCoords = async (latitude, longitude) => {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    if (addresses.length > 0) {
      const address = addresses[0];
      return `${address.city || ''}, ${address.region || ''}`;
    }
    return 'Unknown location';
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return 'Unknown location';
  }
};