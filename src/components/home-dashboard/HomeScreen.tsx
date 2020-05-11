/* *************************************** */
// Import Modules
import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Container, Header, Content, Left, Right, Body } from "native-base";
import { Icon, Text } from "react-native-elements";
import { NavigationContainer, DrawerActions } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

import {
  NavigationState,
  NavigationParams,
  NavigationScreenProp,
} from "react-navigation"; //React Navigation with TypeScript => https://dev.to/andreasbergqvist/react-navigation-with-typescript-29ka

/* *************************************** */
// Import Custom Components
// import CircularProgress from "components/home-dashboard/CircularProgress";
import styles from "styles/Styles";
import * as Constants from "constants/Constants";
import db from "db/User";
import LearningModule from "components/home-dashboard/LearningModule";
import Support from "components/home-dashboard/Support";
import { PROFILE_PIC } from "images/Images";

/* *************************************** */
// Interface
interface IProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface IState {
  initials?: string;
}

export default class HomeScreen extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { initials: "" };
  }

  componentDidMount() {
    db.grabUserDetails().then((data) => {
      if (data != null) {
        let user = data.rows.item(0);
        this.setState({
          initials: user.initials,
        });
      }
    });
  }

  fetchUserInitials = () => {
    if (this.state.initials != "") {
      return <>{"Hello " + this.state.initials + "!"}</>;
    } else {
      return <></>;
    }
  };

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
    // {
    //   icon: <Icon name="users" type="font-awesome" color="white" />,
    //   screenName: Constants.HOME_SCREEN_STATISTICS,
    // },
    // {
    //   icon: <Icon name="users" type="font-awesome" color="white" />,
    //   screenName: Constants.HOME_SCREEN_SUPPORT,
    // },
  ];

  render() {
    const homeScreenLinkComponents = ({ navigation }) => {
      return (
        <View
          style={{
            backgroundColor: Constants.COLOUR_EBONY,
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <LinearGradient
            colors={["#522154", "#5f1f4a", "#721937"]}
            style={styles.homeDashboardGreeterContainer}
          >
            <Left style={styles.homeDashboardGreeterLeftContent}>
              <Text style={styles.homeDashboardContent}>{"1000 points"}</Text>
            </Left>
            <Right style={styles.homeDashboardGreeterRightContent}>
              <Text style={styles.homeDashboardContent}>
                <this.fetchUserInitials />
              </Text>
            </Right>
          </LinearGradient>
          <View style={{ paddingBottom: 10, width: "100%" }}>
            <Text style={styles.homeDashboardHeader}>{"Engage"}</Text>
          </View>
          {this.PAGES.map((page, x) => (
            <TouchableOpacity
              key={x}
              onPress={() => navigation.navigate(page.screenName)}
            >
              <LinearGradient
                colors={["#522154", "#5f1f4a", "#721937"]}
                style={styles.homeDashboardItems}
              >
                {page.icon}
                <Text style={styles.homeDashboardContent}>
                  {page.screenName}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      );
    };
    return (
      <Container style={styles.bgPurple1}>
        <Content contentContainerStyle={styles.rneContentHomeDashboard}>
          {/* *************************** */}
          {/* START */}
          {/* <View style={{ paddingBottom: 10, width: "100%" }}>
            <Text> </Text>
          </View> */}
          <Stack.Navigator>
            <Stack.Screen
              name={Constants.HOME_SCREEN_MY_AVO}
              component={homeScreenLinkComponents}
              options={this.homeScreenHeaderOptions}
            />
            <Stack.Screen
              name={Constants.HOME_SCREEN_LEARNING_MODULES}
              component={LearningModule}
              options={this.learningModuleHeaderOptions}
            />
            {/* <Stack.Screen
              name={Constants.HOME_SCREEN_INTERACTIVE_STORIES}
              component={LearningModule}
              options={this.learningModuleHeaderOptions}
            /> */}
            {/* <Stack.Screen
              name={Constants.HOME_SCREEN_STATISTICS}
              component={LearningModule}
              options={this.learningModuleHeaderOptions}
            /> */}
            <Stack.Screen
              name={Constants.HOME_SCREEN_SUPPORT}
              component={Support}
              options={this.learningModuleHeaderOptions}
            />
          </Stack.Navigator>
          {/* END */}
          {/* *************************** */}
        </Content>
      </Container>
    );
  }

  //* *************************************** */
  // Below are the header options used for => <Stack.Screen options={myCustomOptions}>
  homeScreenHeaderOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: Constants.COLOUR_EBONY },
    headerTitleAllowFontScaling: true,
    headerTitle: (props) => (
      <Text h4 style={{ color: Constants.COLOUR_WHITE, alignSelf: "center" }}>
        {"Home"}
      </Text>
    ),
    headerRight: () => <View />,
    headerLeft: () => (
      <View style={{ marginLeft: 10 }}>
        <Icon
          name="bars"
          type="font-awesome"
          color="white"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      </View>
    ),
  });

  learningModuleHeaderOptions = ({}) => ({
    headerStyle: { backgroundColor: Constants.COLOUR_EBONY },
    headerTintColor: "white",
    headerTitleStyle: {
      color: "white",
    },
  });
}

// Status bar issues fix using native-base
// https://github.com/GeekyAnts/NativeBase/issues/899

// Menu burger icon not staying on the left when using the native-base <Left>
// When you include a <Left> component you will also HAVE to include it's accompanying counterpart => <Right>
