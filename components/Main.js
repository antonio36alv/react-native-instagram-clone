import React, { useState, useEffect, useCallback } from 'react'
import { Text, View } from "react-native"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUser } from "../redux/actions/index"

// export class Main extends Component {
export function Main(props) {

    const [ currentUser, setCurrentUser ] = useState({})

    useEffect(() => {
        // const user = fetchUser()
        // const USER = user()
        // setCurrentUser(USER);
        // const jawn = fetchUser()
        const { fetchUser } = props
        console.log(typeof fetchUser)
        const user = fetchUser()
        console.log(typeof user)
        setCurrentUser(fetchUser())
        // setCurrentUser(jibs)
    }, [])


    return(
    
    currentUser === undefined ?
        <View>
            <Text>You here?</Text>
        </View>
        :
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>{currentUser.name} is logged in</Text>
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main)
