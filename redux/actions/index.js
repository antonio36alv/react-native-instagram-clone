import { USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA } from "../constants"
import firebase from "firebase"
require("firebase/firestore")

export function clearData() {
    return(dispatch => {
        dispatch({ type: CLEAR_DATA })
    })
}

export function fetchUser() {
    return(dispatch => {
        firebase.firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .get()
                .then(snapshot => {
                    if(snapshot.exists) {
                        dispatch(
                            { 
                                type: USER_STATE_CHANGE,
                                currentUser: snapshot.data()
                            }
                        )
                    } else {
                        console.log("does not exist")
                    }
                })
    })
}

export function fetchUserPosts() {
    return(dispatch => {
        firebase.firestore()
                .collection("posts")
                .doc(firebase.auth().currentUser.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then(snapshot => {
                    const posts = snapshot.docs.map(doc => {
                        const data = doc.data()
                        const id = doc.id;
                        return { id, ...data }
                    })
                    // console.log(posts)
                    dispatch(
                        { 
                            type: USER_POSTS_STATE_CHANGE,
                            posts
                        }
                    )
                })
    })
}

export function fetchUserFollowing() {
    return(dispatch => {
        firebase.firestore()
                .collection("following")
                .doc(firebase.auth().currentUser.uid)
                .collection("userFollowing")
                .onSnapshot(snapshot => {
                    const following = snapshot.docs.map(doc => {
                        const id = doc.id;
                        return id
                    })
                    dispatch(
                        { 
                            type: USER_FOLLOWING_STATE_CHANGE,
                            following
                        }
                    )
                    following.forEach(follow => dispatch(fetchUsersData(follow, true)))
                })
    })
}

export function fetchUsersData(uid, getPosts) {
    return((dispatch, getState) => {

        console.log(`wtf right now ${uid}`)
        const found = getState().usersState.users.some(el => el.uid === uid);

        uid === undefined ?
        console.log("undefined within fetchUsersData")
        :
        console.log(`barnacles ${uid}`)

        if(!found) {
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then(snapshot => {
                    if(snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id
                        dispatch({ type: USERS_DATA_STATE_CHANGE, user });
                    } else {
                        console.log("does not exist")
                    }
                })
                if(getPosts) {
                    dispatch(fetchUsersFollowingPosts(uid))
                }
        }
    })
}

export function fetchUsersFollowingPosts(uid) {
    return ((dispatch, getState) => {
        firebase.firestore()
                .collection("posts")
                .doc(uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then(snapshot => {

                    const uid = snapshot.query._.C_.Ft.path.segments[1]

                    const user = getState().usersState.users.find(el => el.uid === uid);

                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data()
                        const id = doc.id;
                        return { id, ...data, user }
                    })
                    console.log("should have exposed")
                    // console.log(posts)
                    dispatch(
                        { 
                            type: USERS_POSTS_STATE_CHANGE,
                            posts,
                            uid
                        }
                    )
                })
    })
}