import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAppSelector } from '../store/hooks'
import LoginScreenLocal from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegistrationScreen'
import type { RootStackParamList } from './types'
import ResetPassword from '../components/common/ResetPassword'
import CandidateStackNavigator from './CandidateNavigator'
import SplashScreen from '../screens/SplashScreen'


  const Stack = createNativeStackNavigator<RootStackParamList>()

  const AppNavigator = () => {
    const user = useAppSelector((state) => state.user.user)

    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
  {!user ? (
    <>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreenLocal} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Reset" component={ResetPassword} />
    </>
  ) : (
    <Stack.Screen name="Main" component={CandidateStackNavigator} />
  )}
</Stack.Navigator>


    )
  }

  export default AppNavigator
