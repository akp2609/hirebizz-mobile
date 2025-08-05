import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { useAppSelector } from '../store/hooks'
import { Ionicons } from '@expo/vector-icons'
import EmployerDrawer from './EmployerNavigator'
import HomeScreen from '../screens/HomeScreen'
import MyApplicationsScreen from '../screens/Candidate/MyApplicationsScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ChatListScreen from '../screens/ChatListScreen'
import LogoutScreen from '../screens/LogoutScreen'
import Bookmarks from '../screens/Candidate/BookMarks'

const Drawer = createDrawerNavigator()


const AppDrawer = () => {
  const user = useAppSelector((state) => state.user.user)

  if (!user) return null

  const isEmployer = user.role === 'employer'

  if (isEmployer) {
    return <EmployerDrawer />
  }


  return (
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
          drawerLabel: 'Job Listings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Your Applications"
        component={MyApplicationsScreen}
        options={{
          drawerLabel: 'My Applications',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
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
        name='Bookmarks'
        component={Bookmarks}
        options={{
          drawerLabel: 'Bookmarks',
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name='bookmark-outline' size={size} color={color}
            />
          )
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
}

export default AppDrawer
