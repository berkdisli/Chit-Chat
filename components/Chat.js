import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    componentDidMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello!',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: 'You can start to chat!',
                    createdAt: new Date(),
                    system: true,
                },
            ],
        })
    }

    onSend(messages = []) {
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }))
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



    render() {
        let name = this.props.route.params.name;
        let bgColor = this.props.route.params.bgColor;
        this.props.navigation.setOptions({ title: name });

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
                        renderBubble={this.renderBubble.bind(this)}
                        messages={this.state.messages}
                        onSend={messages => this.onSend(messages)}
                        user={{
                            _id: 1,
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