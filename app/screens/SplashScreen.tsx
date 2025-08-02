import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoadingDots from '../components/common/LoadingDots';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types'; 

const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LoadingDots color="#4B9EFF" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    marginBottom: 30,
  },
});
