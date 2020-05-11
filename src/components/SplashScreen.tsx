import React, { Component } from "react";
import { View, Animated } from "react-native";
import { Icon } from "react-native-elements";
import styles from "styles/Styles";

/*
This screen's main purpose is to always show a splash screen every time the app is opened or resumed.
*/

interface IProps {}
interface IState {
  isLoading?: boolean;
  animation?: Animated.Value;
}

export default class SplashScreen extends Component<IProps, IState> {
  /****************************************************************************************************************************************************/
  //We set 'isLoading' to 'true'
  constructor(props: IProps) {
    super(props);
    this.state = { isLoading: true, animation: new Animated.Value(0) };
  }

  /****************************************************************************************************************************************************/
  //Please read this link about async functions => https://blog.expo.io/react-native-meets-async-functions-3e6f81111173
  async componentDidMount() {
    this.startAnimation();

    //We then run the function which will take us about 'n' second(s).
    const data = await this.performTimeConsumingTask(); //Hold CTRL and Click "performTimeConsumingTask" to see where this function is.
    //After 'n' second(s) we already received our data.

    if (data !== null) {
      // Since we already have some fake data as a return, we then set the isLoading to false.
      this.setState({ isLoading: false });
      // This would cause the screen to re-render again.
    }
  }
  /****************************************************************************************************************************************************/
  //First we create a function that can consume time.
  performTimeConsumingTask = async () => {
    return new Promise(
      (resolve) =>
        setTimeout(() => {
          resolve("Henlo, i'm a fake data."); //This is a fake data that this function will be returning.
        }, 1500) //We set it to 1.50 seconds
    );
  };

  startAnimation = () => {
    Animated.timing(this.state.animation, {
      toValue: 0,
      // timing: 400,
      duration: 400,
    }).start(() => {
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 400,
      }).start();
    });
  };

  /****************************************************************************************************************************************************/
  render() {
    const viewStyles = [
      styles.splashScreenContainer,
      { backgroundColor: "#003c8f" },
    ];
    const textStyles = {
      color: "white",
      fontSize: 40,
      fontWeight: "bold",
    };
    const animatedStyle = {
      opacity: this.state.animation,
    };

    if (this.state.isLoading) {
      //This will always be rendered FIRST
      return (
        <View style={styles.screenDimension}>
          <View style={viewStyles}>
            <Animated.View style={[animatedStyle]}>
              <Icon
                name="hand-peace-o"
                type="font-awesome"
                size={100}
                color="white"
              />
            </Animated.View>
          </View>
        </View>
      );
    }

    //We then return null once finished 'splashing'
    return null;
  }
}
