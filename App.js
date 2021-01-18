import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native"
import LandingScreen from "./components/auth/Landing"
import RegisterScreen from "./components/auth/Register"
import firebase from "firebase"
import config from "./config"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: config.API_KEY,
  authDomain: config.AUTH_DOMAIN,
  projectId: config.PROJECT_ID,
  storageBucket: config.STORAGE_BUCKET,
  messagingSenderId: config.MESSAGING_SENDER_ID,
  appId: config.APP_ID, 
  measurementId: config.MEASUREMENT_ID
};

if(firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
  console.log("initialized app")
  console.log(`api-key: ${config.API_KEY}`)
  console.log(`api-key: ${config.AUTH_DOMAIN}`)

}

const Stack = createStackNavigator();

export default function App() {

  const [ loaded, setLoaded ] = useState(false);
  const [ loggedIn, setLoggedIn ] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setLoaded(true)
      user ? setLoggedIn(true) : setLoggedIn(false)
    })
  }, [])

  if(!loaded) {
    return(
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Loading</Text>
      </View>
    )
  } 

  if(!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  if(loggedIn) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>User is logged in</Text>
      </View>
    )
  }

}
