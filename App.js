import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatUI from './components/ChatUI';
import LaunchPage from './components/launchPage';
import { StyleSheet,View, Linking } from 'react-native';


const Stack = createNativeStackNavigator();

function App() {
  useEffect(() => {
    const handleOpenURL = (event) => {
      // Here, you can handle the deep link
      console.log(event.url);
    };

    Linking.addEventListener('url', handleOpenURL);

    return () => {
      Linking.removeEventListener('url', handleOpenURL);
    };
  }, []);

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