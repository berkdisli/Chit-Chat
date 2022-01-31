import React from 'react';
import {
    View,
    Text,
    ImageBackground,
    StyleSheet
} from 'react-native';


export default class Chat extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let name = this.props.route.params.name;
        let bgColor = this.props.route.params.bgColor;
        let textColor = this.props.route.params.textColor;

        return (
            <ImageBackground
                style={styles.image}
                resizeMode="cover"
                source={require("../assets/bg.png")}
            >
                <View
                    style={{
                        backgroundColor: bgColor,
                        alignItems: 'flex-start',
                        margin: 20,
                        padding: 30,
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: textColor,
                        }}
                    >Hello, {name} !</Text>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column-reverse",
        alignItems: "center",
    },
    image: {
        flex: 1,
    }
});