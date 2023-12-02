import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatUI from './components/ChatUI';
import LaunchPage from './components/launchPage';
import { StyleSheet,View } from 'react-native';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Launch" component={LaunchPage} options={{ headerShown: false }}/>
        <Stack.Screen name="ChatUI" component={ChatUI} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

 
export default App;