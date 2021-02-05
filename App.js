import { StatusBar } from 'expo-status-bar';
import React, { Component, useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native"
import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"

import firebase from "firebase"
import config from "./config"
import rootReducer from "./redux/reducers"
import thunk from "redux-thunk"

import LandingScreen from "./components/auth/Landing"
import RegisterScreen from "./components/auth/Register"
import LoginScreen from "./components/auth/Login"
import MainScreen from "./components/Main"
import AddScreen from "./components/main/Add"
import SaveScreen from "./components/main/Save"
import CommentScreen from "./components/main/Comment"

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

export default function App({ navigation }) {

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
          <Stack.Screen name="Login" component={LoginScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            {/* <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/> */}
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Add" component={AddScreen} navigation={ navigation } />
            <Stack.Screen name="Save" component={SaveScreen} navigation={ navigation } />
            <Stack.Screen name="Comment" component={CommentScreen} navigation={ navigation } />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  };

}
