import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { TrailProvider } from '../context/TrailContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <TrailProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="trail/add" />
          <Stack.Screen name="trail/[id]" />
          <Stack.Screen name="trail/edit/[id]" />
        </Stack>
      </TrailProvider>
    </AuthProvider>
  );
}