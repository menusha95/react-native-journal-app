import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './src/pages/register';
import LoginScreen from './src/pages/login';
import HomeScreen from './src/pages/home';
import ItemScreen from './src/pages/item_full_view';
import SplashScreen from './src/pages/splash';


const Stack = createStackNavigator();

//stacks used for navigation 
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Item" component={ItemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
