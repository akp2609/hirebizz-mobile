import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../features/user/userSlice';

const LogoutScreen = () => {
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="power" size={48} color="#FF3B3B" style={{ marginBottom: 16 }} />
        <Text style={styles.title}>Ready to log out?</Text>
        <Text style={styles.subtitle}>We'll miss you, but your data is safe and waiting for you next time.</Text>

        <Pressable style={styles.logoutButton} onPress={() => dispatch(logout())}>
          <Text style={styles.logoutText}>🚪 Confirm Logout</Text>
        </Pressable>

        <Text style={styles.reminder}>You can log back in anytime — we’ll be here ❤️</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcefee',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#FF3B3B',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    marginBottom: 12,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reminder: {
    fontSize: 12,
    color: '#b2bec3',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LogoutScreen;
