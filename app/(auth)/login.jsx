import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          {/* Logo */}
          <View style={styles.header}>
            <Text style={styles.logo}>🌿</Text>
            <Text style={styles.title}>EcoTrail</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Log In</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.divider}>
              <View style={styles.line} />
            </View>
            <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerText}>Don't have an account? <Text style={styles.registerLink}>Sign Up</Text></Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 30 },

  header: { alignItems: 'center', marginTop: 40 },
  logo: { fontSize: 56, marginBottom: 4 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1B5E20', letterSpacing: 0.5 },

  form: { marginTop: 30 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 14, 
    fontSize: 15, 
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  loginBtn: { 
    backgroundColor: '#2E7D32', 
    paddingVertical: 13, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 6,
  },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  forgotBtn: { alignItems: 'center', marginTop: 12 },
  forgotText: { color: '#2E7D32', fontSize: 13, fontWeight: '500' },

  footer: { marginTop: 30, paddingBottom: 20 },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#ddd' },
  registerBtn: { alignItems: 'center' },
  registerText: { fontSize: 14, color: '#666' },
  registerLink: { color: '#2E7D32', fontWeight: '600' },
});