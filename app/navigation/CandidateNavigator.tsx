import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AppDrawer from './AppDrawer'
import ChatScreen from '../screens/ChatScreen'
import { RootStackParamList } from './types'
import ApplicantsScreen from '../screens/Employer/ApplicantsScreen'
import { Image, View } from 'react-native'
import Bookmarks from '../screens/Candidate/BookMarks'

const Stack = createNativeStackNavigator<RootStackParamList>()

const CandidateStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Drawer"
      component={AppDrawer}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({ route }) => ({
        title: `${route.params.participant.name}`,
        headerRight: () => (
          <View style={{ paddingRight: 16, marginRight: 16, marginTop: 4 }}>
            <Image
              source={{ uri: route.params.participant.profilePicture }}
              style={{ width: 36, height: 36, borderRadius: 16, borderColor: 'black', borderWidth: 1 }}
            />
          </View>
        ),
        headerBackTitleVisible: false,
        headerTintColor: '#4B9EFF',
      })}
    />
    <Stack.Screen
      name='ApplicantsScreen'
      component={ApplicantsScreen}
      options={{
        title: 'Applications',
        headerStyle: {
          backgroundColor: '#4B9EFF',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
          color: '#FFFFFF',
          fontSize: 18,
        },
      }}
    />
  </Stack.Navigator>
)


export default CandidateStackNavigator
