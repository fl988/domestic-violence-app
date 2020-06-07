//Node modules
import * as React from "react";
import { Component } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "react-native-elements";
import { View, Text, TouchableOpacity } from "react-native";

//My components
import * as Constants from "constants/Constants";
import styles from "styles/Styles";
import {
  NavigationState,
  NavigationParams,
  NavigationScreenProp,
} from "react-navigation"; //React Navigation with TypeScript => https://dev.to/andreasbergqvist/react-navigation-with-typescript-29ka

interface IProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface IState {}

export default class Engage extends Component<IProps, IState> {
  // prettier-ignore
  PAGES = [
    {
      icon: <Icon name="balance-scale" type="font-awesome" color="white" />,
      screenName: Constants.HOME_SCREEN_MY_AVO,
    },
    {
      icon: <Icon name="graduation-cap" type="font-awesome" color="white" />,
      screenName: Constants.HOME_SCREEN_LEARNING_MODULES,
    },
    {
      icon: <Icon name="users" type="font-awesome" color="white" />,
      screenName: Constants.HOME_SCREEN_SUPPORT,
    },
    {
      icon: <Icon name="bullseye-arrow" type="material-community" color="white" />,
      screenName: Constants.HOME_SCREEN_GOALS,
    },
    // {
    //   icon: <Icon name="users" type="font-awesome" color="white" />,
    //   screenName: Constants.HOME_SCREEN_SUPPORT,
    // },
  ];

  render() {
    return (
      <>
        <View style={styles.homeDashboardHeading}>
          <Text style={styles.homeDashboardHeader}>{"Engage"}</Text>
        </View>

        {this.PAGES.map((page, x) => (
          <TouchableOpacity
            key={x}
            onPress={() => this.props.navigation.navigate(page.screenName)}
          >
            <LinearGradient
              colors={Constants.LINEAR_GRADIENT_MAIN}
              style={styles.homeDashboardEngageItems}
            >
              {page.icon}
              <Text style={styles.homeDashboardContent}>
                {/* {page.numberOfModules} */}
                {page.screenName}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </>
    );
  }
}
