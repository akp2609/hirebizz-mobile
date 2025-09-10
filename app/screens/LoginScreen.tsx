import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { loginAPI } from '../api/auth';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../features/user/userSlice';

const LoginScreenLocal = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState('');
  const [dots, setDots] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password cannot be empty.');
      return;
    }

    setLoading(true)

    try {
      const data = await loginAPI(email, password);
      const frontendRole =
        data.user.role === 'candidate' ? 'applicant' :
          data.user.role === 'superadmin' ? 'admin' :
            data.user.role;

      dispatch(loginSuccess({ ...data.user, role: frontendRole, token: data.token }));
      navigation.replace('Main');
    } catch (err) {
      console.error('❌ Login error:', err);
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
      interval = setInterval(() => {
        setDots((prev) => {
          if (prev === '...') return '.';
          return prev + '.';
        });
      }, 500);
    } else {
      setDots('');
    }

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <View style={styles.outer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.card}>
          <Image
            source={require('../../assets/hirebizz-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>🔐 Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={'#000'}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={'#000'}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              secureTextEntry={hidePassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setHidePassword(!hidePassword)}
            >
              <Icon name={hidePassword ? 'eye-off' : 'eye'} size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {loading ? (
            <View style={styles.loadingWrapper}>
              <Text style={styles.loadingText}>Logging in</Text>
              <Text style={styles.dots}>⏳{dots}</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>🚀 Login</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.link} onPress={() => navigation.navigate('Reset')}>
            Forgot your password? <Text style={{ fontWeight: 'bold' }}>Reset</Text>
          </Text>

          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            New here? <Text style={{ fontWeight: 'bold' }}>Create an account</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
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
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
    borderRadius:100
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
    minHeight: 48, 
    minWidth:150
  },
  passwordWrapper: {
    width: '100%',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  error: {
    color: '#ff4d4f',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
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
  loadingWrapper: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    width: '100%',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3436',
    marginBottom: 4,
  },
  dots: {
    fontSize: 24,
    letterSpacing: 4,
    color: '#4B9EFF',
  },

});

export default LoginScreenLocal;
