import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from "react-native"

import firebase from "firebase"
// import { TouchableOpacity } from 'react-native-gesture-handler'
require("firebase/firestore")

export default function Search({ navigation }) {

    const [ users, setUsers ] = useState([])

    const fetchUsers = search => {
        firebase
            .firestore()
            .collection("users")
            .where("name", ">=", search)
            .get()
            .then(snapshot => {
                const users = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id;
                    return { id, ...data }
                })
                console.log("happening...")
                console.log(users)
                setUsers(users)
            })
    }

    return (
        <View>
            <TextInput 
                placeholder="Type Here..."
                onChangeText={searchString => fetchUsers(searchString)} 
            />
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) => (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("Profile", { uid: item.uid })}
                    >
                        <Text style={styles.userTextBox}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    userTextBox: {
        flex: 1
    }
})