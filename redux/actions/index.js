import { USER_STATE_CHANGE } from "../constants"
import firebase from "firebase"

export function fetchUser() {
    return(dispatch => {
        console.log("FUCKSICKLE830")
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