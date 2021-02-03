import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from "react-native"

import firebase from "firebase"
require("firebase/firestore")

import { connect } from "react-redux"

function Feed(props) {

    const [ posts, setPosts ] = useState([])

    useEffect(() => {

        let posts = []
        if(props.usersLoaded == props.following.length) {
            props.following.forEach(following => {
                const user = props.users.find(el => el.uid === following)
                if(user != undefined) {
                    posts = [...posts, ...user.posts]
                }
            })

            posts.sort((x, y) => {
                return x.creation - y.creation;
            })

            setPosts(posts)
        }

    }, [ props.usersLoaded ])

    return (
        <View style={styles.container}>
            <View style={styles.galleryContainer}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({item}) => (
                        <View style={styles.imageContainer}>
                            <Text styles={{ flex: 1}}>{item.user.name}</Text>
                            <Image
                                style={styles.image}
                                source={{ uri: item.snapshotURL }}
                            />
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        color: "#2196f3",
        // borderBottomColor: "black"
        borderColor: "#20232a"
    },
    container: {
        flex: 1,
        // marginTop: 40,
        // justifyContent: "center"
    },
    infoContainer: {
        margin: 20
    },
    galleryContainer: {
        flex: 1
    },
    imageContainer: {
        flex: 1/1
    },
    image: {
        flex: 1,
        aspectRatio: 1/1,
        width: "auto",
        height: "auto"
    }
})

const mapStateToProps = store => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    users: store.usersState.users,
    usersLoaded: store.usersState.usersLoaded
})

export default connect(mapStateToProps, null)(Feed)