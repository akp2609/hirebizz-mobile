import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppNavigator from './app/navigation/AppNavigator';
import { ModalProvider } from './app/context/ModalContext';


const myTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',      // App-wide background
    primary: '#4B9EFF',         // iPhone blue for buttons, links
    text: '#2d3436',            // Dark text for readability
    card: '#FFFFFF',            // Card backgrounds
    border: '#dcdde1',          // Input borders
    notification: '#4B9EFF',    // Accent color
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer theme={myTheme}>
        <ModalProvider>
          <AppNavigator />
        </ModalProvider>
      </NavigationContainer>
    </Provider>
  );
}
