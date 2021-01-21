import React, { Component, useState, useEffect } from 'react'
import { Text, View } from "react-native"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUser } from "../redux/actions/index"

// export class Main extends Component {
export function Main() {
    // useEffect(() => {
    //     fetchUser()
    // }, [])
    // componentDidMount() {
        // this.props.fetchUser();
        // const { currentUser } = this.props
    // }

    // const { currentUser } = this.props
    // console.log(currentUser)
    const [ currentUser, setCurrentUser ] = useState("")
    // render() {
        // const currentUser = "jawn"
    useEffect(() => {

        // currentUser = "jawn"
    }, [])

    return(
    currentUser === undefined ?
        <View>
            <Text>You here?</Text>
        </View>
        :
        <View style={{ flex: 1, justifyContent: "center" }}>
          {/* <Text>{currentUser.name} is logged in</Text> */}
          <Text>User is logged in</Text>
        </View>
    )
    // }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main)
