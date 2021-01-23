import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native"
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import LandingScreen from "./components/auth/Landing"
import RegisterScreen from "./components/auth/Register"
import MainScreen from "./components/Main"
import firebase from "firebase"
import config from "./config"
import rootReducer from "./redux/reducers"
import thunk from "redux-thunk"

const store = createStore(rootReducer, applyMiddleware(thunk))

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
}

const Stack = createStackNavigator();

export default function App() {

  const [ loaded, setLoaded ] = useState(false);
  const [ loggedIn, setLoggedIn ] = useState(false);

  useEffect(() => {    
    setLoaded(true);
    firebase.auth().onAuthStateChanged(user => {
      user ? setLoggedIn(true) : setLoggedIn(false);
    });
  }, []);

  if(!loaded) {
    return(
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Loading</Text>
      </View>
    );
  } 

  if(!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Register" component={RegisterScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <Provider store={store}>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </Provider>
    );
  };

}
