import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TextInput,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useTrails } from '../../context/TrailContext';
import { getCurrentLocation, watchLocation } from '../../services/location';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Explore() {
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);
  const { trails } = useTrails();
  const router = useRouter();

  useEffect(() => {
    getCurrentLocationAndSetRegion();
  }, []);

  const getCurrentLocationAndSetRegion = async () => {
    setLoading(true);
    const location = await getCurrentLocation();
    if (location) {
      setRegion(location);
      setUserLocation(location);
      setLoading(false);
    } else {
      setRegion({
        latitude: 7.8731,
        longitude: 80.7718,
        latitudeDelta: 2,
        longitudeDelta: 2,
      });
      setLoading(false);
    }
  };

  //Search Location
  const searchLocation = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Search', 'Please enter a place name');
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&countrycodes=LK`
      );
      const data = await response.json();

      if (data.length > 0) {
        const result = data[0];
        const newRegion = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
        Alert.alert('Found', `📍 ${result.display_name}`);
      } else {
        Alert.alert('Not Found', 'No results found for this location');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search location. Please try again.');
      console.error('Search error:', error);
    }
  };

  const toggleTracking = async () => {
    if (tracking) {
      setTracking(false);
      return;
    }

    const location = await getCurrentLocation();
    if (location) {
      setTracking(true);
      setUserLocation(location);
      mapRef.current?.animateToRegion(location, 1000);
    }
  };

  const goToUserLocation = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion(userLocation, 1000);
    } else {
      getCurrentLocationAndSetRegion();
    }
  };

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
        
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>🗺️ Explore</Text>
          <Text style={styles.subtitle}>Find trails near you</Text>
        </View>

        {/*  Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a place..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchLocation}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={searchLocation} style={styles.searchButton}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            showsScale={true}
          >
            {trails.map((trail) => (
              <Marker
                key={trail.id}
                coordinate={{
                  latitude: trail.latitude || 7.8731 + (Math.random() - 0.5) * 0.5,
                  longitude: trail.longitude || 80.7718 + (Math.random() - 0.5) * 0.5,
                }}
                title={trail.name}
                description={`${trail.distance} km • ${trail.difficulty}`}
                pinColor={
                  trail.difficulty === 'Easy' ? '#4CAF50' :
                  trail.difficulty === 'Medium' ? '#FF9800' : '#f44336'
                }
                onCalloutPress={() => router.push(`/trail/${trail.id}`)}
              >
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{trail.name}</Text>
                    <Text style={styles.calloutLocation}>📍 {trail.location}</Text>
                    <Text style={styles.calloutStats}>{trail.distance} km • {trail.duration}</Text>
                    <Text style={styles.calloutDifficulty}>🔴 {trail.difficulty}</Text>
                    <Text style={styles.calloutAction}>👆 Tap to view</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, tracking && styles.trackingActive]}
            onPress={toggleTracking}
          >
            <Ionicons
              name={tracking ? 'locate' : 'locate-outline'}
              size={24}
              color={tracking ? '#fff' : '#2E7D32'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={goToUserLocation}>
            <Ionicons name="navigate-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={getCurrentLocationAndSetRegion}>
            <Ionicons name="refresh-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        {/* Tracking Status */}
        {tracking && (
          <View style={styles.trackingStatus}>
            <View style={styles.trackingDot} />
            <Text style={styles.trackingText}>Live Tracking</Text>
          </View>
        )}

        {/* Trail Count */}
        <View style={styles.trailCount}>
          <Ionicons name="trail-sign-outline" size={18} color="#2E7D32" />
          <Text style={styles.trailCountText}>
            {trails.length} Trails Nearby
          </Text>
        </View>
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
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  //TITLE
  titleContainer: {
    paddingVertical: 12,
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

  //SEARCH BAR
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    gap: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    padding: 0,
    height: 40,
  },
  searchButton: {
    backgroundColor: '#2E7D32',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },

  //MAP
  mapContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  map: {
    flex: 1,
  },

  //CONTROLS
  controls: {
    position: 'absolute',
    right: 24,
    bottom: 100,
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackingActive: {
    backgroundColor: '#2E7D32',
  },

  //TRACKING STATUS
  trackingStatus: {
    position: 'absolute',
    top: 110,
    left: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trackingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f44336',
    marginRight: 8,
  },
  trackingText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },

  //TRAIL COUNT
  trailCount: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  trailCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  // CALLOUT
  callout: {
    padding: 10,
    width: 200,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  calloutLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  calloutStats: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  calloutDifficulty: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  calloutAction: {
    fontSize: 11,
    color: '#2E7D32',
    marginTop: 6,
    fontStyle: 'italic',
  },
});