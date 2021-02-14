import React, { Component, useState, useEffect } from 'react'
import { Text, View } from "react-native"
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import firebase from "firebase"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from "../redux/actions/index"

import FeedScreen from "./main/Feed"
import ProfileScreen from "./main/Profile"
import SearchScreen from "./main/Search"

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return(null)
}

// export function Main(props) {
export class Main extends Component {
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
        this.props.clearData()
        this.props.fetchUser()
        this.props.fetchUserPosts()
        this.props.fetchUserFollowing()
    }

    render() {
        const { currentUser } = this.props

        return(
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                <Tab.Screen name="Feed" component={FeedScreen} 
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                }} />
                <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="magnify" color={color} size={26} />
                        ),
                }} />
                <Tab.Screen name="AddContainer" component={EmptyScreen} 
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add")
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                        ),
                }} />
                <Tab.Screen name="Profile" component={ProfileScreen} 
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account" color={color} size={26} />
                        ),
                }} />
            </Tab.Navigator>
        )
    }

}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts, fetchUserFollowing, clearData }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main)
