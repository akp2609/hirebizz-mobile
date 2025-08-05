import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { registerAPI } from '../api/auth';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../features/user/userSlice';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmployer, setEmployer] = useState(false);

  const dispatch = useAppDispatch();

  const handleRegister = async () => {
    try {
      const role = isEmployer ? 'employer' : 'candidate';
      const data = await registerAPI(name, email, password, role);

      const frontendRole =
        data.user.role === 'candidate'
          ? 'applicant'
          : data.user.role === 'superadmin'
            ? 'admin'
            : data.user.role;

      dispatch(loginSuccess({ ...data.user, role: frontendRole, token: data.token }));
      navigation.replace('Home');
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      Alert.alert('Registration Failed', 'Please check your details or try again later.');
    }
  };

  return (
    <View style={styles.outer}>
      {/* Faux backdrop "glass" layer */}
      <View style={styles.card}>
        <Text style={styles.title}>🌟 Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor={'#000'}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={'#000'}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={'#000'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <BouncyCheckbox
          isChecked={isEmployer}
          fillColor="#4B9EFF"
          text="Register as an employer"
          textStyle={{ textDecorationLine: 'none', color: '#333' }}
          iconStyle={{ borderColor: '#4B9EFF' }}
          innerIconStyle={{ borderWidth: 2 }}
          onPress={() => setEmployer(!isEmployer)}
          style={{ marginBottom: 16 }}
        />

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>🚀 Register</Text>
        </Pressable>

        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Already have an account? <Text style={{ fontWeight: 'bold' }}>Login</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#4B9EFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffffcc',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#2d3436',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#dcdde1',
  },
  button: {
    backgroundColor: '#4B9EFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    fontSize: 14,
    color: '#636e72',
  },
});

export default RegisterScreen;
