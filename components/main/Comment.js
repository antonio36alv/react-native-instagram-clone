import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Button, TextInput } from "react-native"

import firebase from "firebase"
require("firebase/firestore")

import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUsersData } from "../../redux/actions/index"

function Comment(props) {

    const [ comments, setComments ] = useState([])
    const [ postId, setPostId ] = useState("")
    const [ commentText, setCommentText ] = useState("")

    useEffect(() => {

        const matchUserToComment = comments => {
        /*
            comments.forEach(comment => {
                if(!comment.hasOwnProperty("user")) {
                    console.log("this did happen I saw something")
                    // continue;
                const user = props.users.find(x => x.uid === comment.creator)
                user == undefined ?
                    props.fetchUsersData(comment.creator, false)
                    :
                    comment.user = user
                    // return
                }
                //    comments.forEach(comment => {
                    //    console.log("comment")
                    //    console.log(comment)
                //    })
            })
            setComments(comments)
        */
            for(let x = 0; x < comments.length; x++) {
                if(comments[x].hasOwnProperty("user")) {
                    break;
                }
                const user = props.users.find(user => user.uid === comments[x].creator)

                if(user == undefined) {
                    props.fetchUsersData(comments[x].creator, false)
                } else {
                    comments[x].user = user
                }
            }
            setComments(comments)
        }

        console.log("fuck it we'll do it live")
        console.log(props.route.params.postId)

        if(props.route.params.postId !== postId) {
            firebase.firestore()
                    .collection("posts")
                    .doc(props.route.params.uid)
                    .collection("userPosts")
                    .doc(props.route.params.postId)
                    .collection("comments")
                    .get()
                    .then(snapshot => {
                        let comments = snapshot.docs.map(doc => {
                            const data = doc.data()
                            const id = doc.id
                            return { id, ...data }
                        })
                        matchUserToComment(comments)
                    })
            setPostId(props.route.params.uid)
        } else {
            matchUserToComment(comments)
        }

        console.log("infetterence")
        console.log(comments.length)
        console.log(`don't wanna go back to selling real estate: ${props.route.params.uid}`)

    }, [ props.route.params.postId, props.users ])

    const submitComment = () => {
        firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .doc(props.route.params.postId)
                .collection("comments")
                .add({
                    creator: firebase.auth().currentUser.uid,
                    text: commentText
                })
    }

    return (
        // <View style={{ flex: 1 }}>
        <View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({item}) => (
                    <View>
                        {item.user !== undefined ?
                            <Text>
                                {item.user.name}
                            </Text>
                            // : null}
                            :
                            <Text>birds</Text>}
                        <Text>{item.text}</Text>
                    </View>
                )}
            />

            <View>
                <TextInput
                    placeholder="comment..."
                    onChangeText={(text) => setCommentText(text)}
                />
                <Button 
                    onPress={() => submitComment()}
                    title="Send"
                />
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    users: store.usersState.users
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Comment)
