import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, Button } from 'react-native'
import firebase from "firebase"
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Save(props) {
    console.log(props)

    const [ caption, setCaption ] = useState("")

    const uploadImage = async () => {

        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
        const uri = props.route.params.image

        const response = await fetch(uri)
        const blob = await response.blob()

        const task = firebase
                        .storage()
                        .ref()
                        .child(childPath)
                        .put(blob)

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            // console.log(`transferred: ${snapshot.bytesTransferred}`)
            task.snapshot.ref.getDownloadURL().then(snapshotURL => {
                savePostData(snapshotURL)
                // console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted)

    }

    const savePostData = snapshotURL => {
        firebase.firestore()
                    .collection("posts")
                    .doc(firebase.auth().currentUser.uid)
                    .collection("userPosts")
                    .add({
                        snapshotURL,
                        caption,
                        creation: firebase
                                    .firestore
                                    .FieldValue
                                    .serverTimestamp()
                    }).then(() => {
                        props.navigation.popToTop()
                    })
    }

    return (
        <View sytle={{ flex: 1}}>
            <Image source={{ uri: props.route.params.image }} />
            <TextInput 
                placeholder="Write a Caption..." 
                onChangeText={caption =>  setCaption(caption)} 
            />

            <Button title="Save" onPress={() => uploadImage()} />

        </View>
    )
}
