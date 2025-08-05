import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import PostJobScreen from '../screens/Employer/PostJobScreen'
import ProfileScreen from '../screens/ProfileScreen'
import LogoutScreen from '../screens/LogoutScreen'
import HomeScreen from '../screens/HomeScreen'
import Applicants from '../screens/Employer/Applicants'
import ApplicantsScreen from '../screens/Employer/ApplicantsScreen'
import ChatListScreen from '../screens/ChatListScreen'
import ChatScreen from '../screens/ChatScreen'

const Drawer = createDrawerNavigator()

const EmployerDrawer = () => (
  <Drawer.Navigator initialRouteName="Home" screenOptions={{
    headerStyle: {
      backgroundColor: '#4B9EFF',
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
  }}>
    <Drawer.Screen
      name="Home"
      component={HomeScreen}
      options={{
        drawerLabel: 'Dashboard',
        drawerIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Post Job"
      component={PostJobScreen}
      options={{
        drawerLabel: 'Post Job',
        drawerIcon: ({ color, size }) => (
          <Ionicons name="add-circle-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Applicants"
      component={Applicants}
      options={{
        drawerLabel: 'Applicants',
        drawerIcon: ({ color, size }) => (
          <Ionicons name="people-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Chats"
      component={ChatListScreen}
      options={{
        drawerLabel: 'Chats',
        drawerIcon: ({ color, size }) => (
          <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        drawerLabel: 'My Profile',
        drawerIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Logout"
      component={LogoutScreen}
      options={{
        drawerLabel: 'Logout',
        drawerIcon: ({ color, size }) => (
          <Ionicons name="power" size={size} color={color} />
        ),
      }}
    />

  </Drawer.Navigator>
)

export default EmployerDrawer
