import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { Bubble, GiftedChat, SystemMessage } from 'react-native-gifted-chat';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'firebase/compat/auth'

//Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDzzxkdm5_4_SmxDtQDUVglpHMkA9BKrCc",
    authDomain: "chatapp-9eecb.firebaseapp.com",
    projectId: "chatapp-9eecb",
    storageBucket: "chatapp-9eecb.appspot.com",
    messagingSenderId: "519392559048",
    appId: "1:519392559048:web:4098377042c3bd1c834afd",
};

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
            },
            isConnected: false,
            image: null,
            location: null,
        };

        //initializing firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        // reference to the Firestore messages collection
        this.referenceChatMessages = firebase.firestore().collection("messages");
    }

    componentDidMount() {
        // Set the page title once Chat is loaded
        let { name } = this.props.route.params
        // Adds the name to top of screen
        this.props.navigation.setOptions({ title: name })

        // user can sign in anonymously
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }

            //update user state with currently active user data
            this.setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: "https://placeimg.com/140/140/any",
                },
            });

            // listens for updates in the collection
            this.unSubscribe = this.referenceChatMessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onCollectionUpdate);
        });
    }

    componentWillUnmount() {
        this.authUnsubscribe();
        this.unSubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            var data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar
                },
                image: data.image || null,
                location: data.location || null,
            });
        });
        this.setState({
            messages: messages,
        });
    };


    addMessages() {
        const message = this.state.messages[0];
        // add a new messages to the collection
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || null,
            createdAt: message.createdAt,
            user: this.state.user,
            image: message.image || "",
            location: message.location || null,
        });
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessages();
        })
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "#1E90FF"
                    }
                }}
            />
        )
    };

    renderSystemMessage(props) {
        return <SystemMessage {...props} textStyle={{ color: '#000' }} />;
    }

    render() {
        let bgColor = this.props.route.params.bgColor;

        return (
            <View style={styles.container}>
                <View
                    style={{
                        backgroundColor: bgColor,
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <GiftedChat
                        renderSystemMessage={this.renderSystemMessage}
                        renderBubble={this.renderBubble.bind(this)}
                        messages={this.state.messages}
                        onSend={messages => this.onSend(messages)}
                        user={{
                            _id: this.state.user._id,
                            name: this.state.name,
                            avatar: this.state.user.avatar
                        }}
                    />
                    {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
});