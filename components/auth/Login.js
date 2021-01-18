import React, { useState } from 'react'
import { Text, View, Button, TextInput } from "react-native"
import firebase from "firebase"

export default function Login() {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const onSignUp = () => {

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(res => {
                console.log(`result\n${res}`)
            })
            .catch(err => {
                console.log(`error\n${err}`)
            })

    }

    return (
        <View>
            <TextInput placeholder="email"
                       onChangeText={email => setEmail(email)} />
            <TextInput placeholder="password"
                       secureTextEntry={true}
                       onChangeText={password => setPassword(password)} />
            <Button title="Sign In" onPress={() => onSignUp()}/>
        </View>
    )
}
