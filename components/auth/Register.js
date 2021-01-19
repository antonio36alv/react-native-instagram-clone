import React, { useState } from 'react'
import { Text, View, Button, TextInput } from "react-native"
import firebase from "firebase"

export default function Register() {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ name, setName ] = useState("");

    const onSignUp = () => {

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(res => {
                console.log(`result\n${res}`)
                firebase.firestore().collection("users")
                        .doc(firebase.auth().currentUser.uid)
                        .set(
                            {
                                name,
                                email
                            }
                        )
            })
            .catch(err => {
                console.log(`error\n${err}`)
            })

    }

    return (
        <View>
            <TextInput placeholder="name"
                       onChangeText={name => setName(name)} />
            <TextInput placeholder="email"
                       onChangeText={email => setEmail(email)} />
            <TextInput placeholder="password"
                       secureTextEntry={true}
                       onChangeText={password => setPassword(password)} />
            <Button title="Sign Up" onPress={() => onSignUp()}/>
        </View>
    )
}
