import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Button, TextInput } from "react-native"

import firebase from "firebase"
require("firebase/firestore")

import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUsersData } from "../../redux/actions"

function Comment(props) {

    const [ comments, setComments ] = useState([])
    const [ postId, setPostId ] = useState("")
    const [ commentText, setCommentText ] = useState("")

    useEffect(() => {

        const matchUserToComment = comments => {
            comments.forEach(comment => {
                if(comment.hasOnProperty("user")) {
                    return
                }
                const user = props.users.find(x => x.uid === comment.creator)
                user == undefined ?
                    props.fetchUsersData(comment.creator, false)
                    :
                    comment.user = user
            })
            setComments(comments)
        }

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
        <View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({item}) => {
                    <View>
                        {item.user !== undefined ?
                            <Text>
                                {item.user.name}
                            </Text>
                            : null}
                        <Text>{item.text}</Text>
                    </View>
                }}
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
