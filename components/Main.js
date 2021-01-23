import React, { useState, useEffect } from 'react'
import { Text, View } from "react-native"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUser } from "../redux/actions/index"

// export function Main(props) {
export class Main extends React.Component {
    // const [ currentUser, setCurrentUser ] = useState({})
    // useEffect(() => {
    //     const ufck =props.fetchUser()
    //     console.debug(ufck)
    //     const { fetchUser } = props
    //     // console.log(fff)
    //     console.debug(fetchUser)
    //     const shit = fetchUser()
    //     console.debug(shit)
    //     const { currentUser } = props
    //     console.debug(currentUser)
    //     setCurrentUser()
    //     const jawn = props.fetchUser()
    // }, [])

    // return(
    // currentUser === undefined ?
    //     <View>
    //         <Text>You here?</Text>
    //     </View>
    //     :
    //     <View style={{ flex: 1, justifyContent: "center" }}>
    //       <Text>{currentUser.name} is logged in</Text>
    //     </View>
    // )
    componentDidMount() {
        this.props.fetchUser()
    }

    render() {
        const { currentUser } = this.props

        return(

        currentUser == undefined ?

            <View></View>

            :

            <View style={{ flex: 1, justifyContent: "center" }}>
                <Text>{currentUser.name} is logged in</Text>
            </View>
        )
    }

}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main)
