import { StatusBar } from 'expo-status-bar';
import React from 'react';

import * as firebase from "firebase";
// import firebase from "firebase"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDBHd46BBKjqbwgfpbgLDfyWf5k_Bqwl4",
  authDomain: "instagram-clone-demo-1416b.firebaseapp.com",
  projectId: "instagram-clone-demo-1416b",
  storageBucket: "instagram-clone-demo-1416b.appspot.com",
  messagingSenderId: "988149112645",
  appId: "1:988149112645:web:948e69a8a75838d98ee82c",
  measurementId: "G-XFT8P7QTBE"
};

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "./components/auth/Landing"

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
