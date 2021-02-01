import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from "react-native"

import firebase from "firebase"
require("firebase/firestore")

import { connect } from "react-redux"

function Profile(props) {

    const [ userPosts, setUserPosts ] = useState([])
    const [ user, setUser ] = useState(null)
    const [ following, setFollowing ] = useState(false)

    useEffect(() => {

        const { currentUser, posts } = props

        if(props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
        } else {

            const uid = props.route.params.uid

            firebase.firestore()
                    .collection("users")
                    .doc(uid)
                    .get()
                    .then(snapshot => {
                        console.debug(uid)
                        if(snapshot.exists) {
                            setUser(snapshot.data())
                        } else {
                            console.log("does not exist")
                            console.log("profile.js")
                        }
                    })
            firebase.firestore()
                    .collection("posts")
                    .doc(uid)
                    .collection("userPosts")
                    .orderBy("creation", "asc")
                    .get()
                    .then(snapshot => {
                        const posts = snapshot.docs.map(doc => {
                            const data = doc.data()
                            const id = doc.id;
                            return { id, ...data }
                        })
                        setUserPosts(posts)
                    })
        }

        props.following.indexOf(props.route.params.uid) > -1 ?
            setFollowing(true)
            :
            setFollowing(false)

    }, [ props.route.params.uid, props.following ])

    const follow = () => {
        firebase.firestore()
                .collection("following")
                .doc(firebase.auth().currentUser.uid)
                .collection("userFollowing")
                .doc(props.route.params.uid)
                .set({})
    }

    const onUnfollow = () => {
        firebase.firestore()
                .collection("following")
                .doc(firebase.auth().currentUser.uid)
                .collection("userFollowing")
                .doc(props.route.params.uid)
                .delete()
    }

    if(user === null) {
        return <View />
    }

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
                {props.route.params.uid !== firebase.auth().currentUser.uid
                    ?
                    (<View>
                        {following
                            ?
                            (<Button 
                                style={styles.button}
                                title="Following"
                                onPress={() => onUnfollow()}
                            />) 
                            :
                            (<Button 
                                style={styles.button}
                                title="Follow"
                                onPress={() => follow()}
                            />)
                        }
                    </View>)
                    :
                    null
                }
            </View>
            <View style={styles.galleryContainer}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({item}) => (
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.snapshotURL}}
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
        marginTop: 40,
        // justifyContent: "center"
    },
    infoContainer: {
        margin: 20
    },
    galleryContainer: {
        flex: 1
    },
    imageContainer: {
        flex: 1/3
    },
    image: {
        flex: 1,
        aspectRatio: 1/1,
        // width: 50,
        // height: 50
    }
})

const mapStateToProps = store => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile)