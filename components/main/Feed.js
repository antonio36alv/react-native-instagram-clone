import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from "react-native"

import firebase from "firebase"
require("firebase/firestore")

import { connect } from "react-redux"

function Feed(props) {

    const [ posts, setPosts ] = useState([])

    useEffect(() => {

        if(props.usersFollowingLoaded == props.following.length && props.following.length != 0) {

            props.feed.sort((x, y) => {
                return x.creation - y.creation;
            })

            setPosts(props.feed)
        }
        console.log(posts)

    }, [ props.usersFollowingLoaded, props.feed ])

    const onLike = (userId, postId) => {
        firebase.firestore()
                .collection("posts")
                .doc(userId)
                .collection("userPosts")
                .doc(postId)
                .collection("likes")
                .doc(firebase.auth().currentUser.uid)
                .set({})
    }

    const onUnlike = (userId, postId) => {
        console.log("we are here")
        firebase.firestore()
                .collection("posts")
                .doc(userId)
                .collection("userPosts")
                .doc(postId)
                .collection("likes")
                .doc(firebase.auth().currentUser.uid)
                .delete()
    }

    return (
        <View style={styles.container}>
            <View style={styles.galleryContainer}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({item}) => (
                        <View style={styles.imageContainer}>
                            <Text style={{ flex: 1}}>{item.user.name}</Text>
                            <Image
                                style={styles.image}
                                source={{ uri: item.snapshotURL }}
                            />
                            {item.currentUserLike ? 
                                <Button
                                    title="Dislike"
                                    onPress={() => onUnlike(item.user.uid, item.id)}
                                />
                                :
                                <Button 
                                    title="Like"
                                    onPress={() => onLike(item.user.uid, item.id)}
                                />
                            }
                            <Text
                                onPress={() => props.navigation.navigate("Comment", 
                                            { postId: item.id, uid: item.user.uid })}
                            >
                            View Comments...
                            </ Text>
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
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
})

export default connect(mapStateToProps, null)(Feed)