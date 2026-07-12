import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await register(email, password);
    setLoading(false);
    if (result.success) {
      Alert.alert('Success', 'Account created!');
      router.replace('/(tabs)');
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          <View style={styles.header}>
            <Text style={styles.logo}>🌿</Text>
            <Text style={styles.title}>EcoTrail</Text>
          </View>

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
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
            />

            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerBtnText}>Sign Up</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.divider}>
              <View style={styles.line} />
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={() => router.back()}>
              <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Log In</Text></Text>
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

  form: { marginTop: 24 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 14, 
    fontSize: 15, 
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  registerBtn: { 
    backgroundColor: '#2E7D32', 
    paddingVertical: 13, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 6,
  },
  registerBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  footer: { marginTop: 30, paddingBottom: 20 },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#ddd' },
  loginBtn: { alignItems: 'center' },
  loginText: { fontSize: 14, color: '#666' },
  loginLink: { color: '#2E7D32', fontWeight: '600' },
});