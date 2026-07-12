import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import SplashScreen from '../components/SplashScreen';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    if (!loading && !showSplash) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [user, loading, showSplash]);

  // Show Splash Screen first
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Show loading while checking auth
  if (loading) {
    return null;
  }

  return null;
}