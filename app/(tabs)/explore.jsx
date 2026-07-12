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

  // Count trails by difficulty
  const easyCount = trails.filter(t => t.difficulty === 'Easy').length;
  const mediumCount = trails.filter(t => t.difficulty === 'Medium').length;
  const hardCount = trails.filter(t => t.difficulty === 'Hard').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.container}>
        
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>🗺️ Explore</Text>
          <Text style={styles.subtitle}>Find trails near you</Text>
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

        {/* Enhanced Bottom Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarLeft}>
            <Ionicons name="trail-sign-outline" size={20} color="#2E7D32" />
            <Text style={styles.bottomBarCount}>{trails.length}</Text>
            <Text style={styles.bottomBarLabel}>Trails</Text>
          </View>
          
          <View style={styles.bottomBarDivider} />
          
          <View style={styles.bottomBarStats}>
            <View style={styles.bottomBarStat}>
              <View style={[styles.dot, styles.dotEasy]} />
              <Text style={styles.bottomBarStatText}>{easyCount}</Text>
            </View>
            <View style={styles.bottomBarStat}>
              <View style={[styles.dot, styles.dotMedium]} />
              <Text style={styles.bottomBarStatText}>{mediumCount}</Text>
            </View>
            <View style={styles.bottomBarStat}>
              <View style={[styles.dot, styles.dotHard]} />
              <Text style={styles.bottomBarStatText}>{hardCount}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.bottomBarButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Ionicons name="list-outline" size={20} color="#fff" />
          </TouchableOpacity>
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

  //  TITLE 
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

  // MAP 
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

  // CONTROLS
  controls: {
    position: 'absolute',
    right: 28,
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

  // TRACKING STATUS 
  trackingStatus: {
    position: 'absolute',
    top: 80,
    left: 28,
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

  // ENHANCED BOTTOM BAR 
  bottomBar: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bottomBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bottomBarCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  bottomBarLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  bottomBarDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#e0e0e0',
  },
  bottomBarStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomBarStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotEasy: {
    backgroundColor: '#4CAF50',
  },
  dotMedium: {
    backgroundColor: '#FF9800',
  },
  dotHard: {
    backgroundColor: '#f44336',
  },
  bottomBarStatText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bottomBarButton: {
    backgroundColor: '#2E7D32',
    padding: 8,
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
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