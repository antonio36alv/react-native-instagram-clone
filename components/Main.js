import React, { useState, useEffect} from 'react'
import { Text, View } from "react-native"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUser } from "../redux/actions"

export const Main = () => {

    useEffect(() => {
        fetchUser()
    }, [])

    const { currentUser } = fetchUser()
    console.log(currentUser)

    currentUser === undefined ?
        <View></View>
        :
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>{currentUser.name} is logged in</Text>
        </View>
}

const mapStateToProps = store => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = dispatch => bindActionCreators({fetchUser}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main)
