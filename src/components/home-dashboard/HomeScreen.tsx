/* *************************************** */
// Import Modules
import React, { Component } from "react";
import { View, Image, TouchableOpacity, AppState } from "react-native";
import { Container, Header, Content, Left, Right, Body } from "native-base";
import { Icon, Text } from "react-native-elements";
import { NavigationContainer, DrawerActions } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
const Stack = createStackNavigator();
// const forFade = ({ current, closing }) => ({
//   // cardStyle: {
//   //   opacity: current.progress,
//   // },
// });

import {
  NavigationState,
  NavigationParams,
  NavigationScreenProp,
} from "react-navigation"; //React Navigation with TypeScript => https://dev.to/andreasbergqvist/react-navigation-with-typescript-29ka

/* *************************************** */
// Import Custom Components
// import CircularProgress from "components/home-dashboard/CircularProgress";
import db from "db/User";
import { grabAllArticles } from "db/SelectScripts";
import { fetchArticlesAndSave } from "db/FetchAndSaveScripts";
import styles from "styles/Styles";
import * as Constants from "constants/Constants";
import MyAVO from "components/home-dashboard/my-avo/MyAVO";
import LearningModule from "components/home-dashboard/learning-modules/LearningModule";
import Module from "components/home-dashboard/learning-modules/Module";
import Quiz from "components/home-dashboard/learning-modules/Quiz";
import Support from "components/home-dashboard/Support";
import QuickHelp from "components/QuickHelp";
import { ScrollView } from "react-native-gesture-handler";
import ArticleOfTheDay from "components/home-dashboard/ArticleOfTheDay";
import Engage from "components/home-dashboard/Engage";

/* *************************************** */
// Interface
interface IProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface IState {
  initials?: string;
  numberOfModules: number;
  appState?: any;
}

export default class HomeScreen extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      initials: "",
      numberOfModules: 0,
      appState: AppState.currentState,
    };
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);

    //Display initials
    db.grabUserDetails().then((data) => {
      if (data != null) {
        let user = data.rows.item(0);
        this.setState({
          initials: user.initials,
        });
      }
    });

    //fetch learning modules.
    this.fetchLeaningModules();
    this.fetchArticles();
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    this.grabCurrentDate();
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!. save this time");
    }
    console.log("App sent to the background!. save this time. ");
    /// difference between both the times is the time spent by user on app
    this.setState({ appState: nextAppState });
  };

  async grabCurrentDate() {
    await db.getCurrentTime();
  }

  async fetchLeaningModules() {
    //we first check if we have pre-existing learning modules
    let checkForLearningModules = await db.checkForLearningModuleData();
    if (!checkForLearningModules) {
      //drop the create the tables.
      await db.setUpLearningModules();

      //fetch learning modules data
      let jsonData = await db.fetchLearningModulesData(); //fetch then save the data

      //save learning modules data
      await db.saveLearningModulesData(JSON.parse(jsonData));
    }

    let rsLM = await db.grabAllLearningModulesData();
    this.setState({
      numberOfModules: rsLM.rows.length,
    });
  }

  async fetchArticles() {
    await grabAllArticles().then(async (rs) => {
      if (rs != null && rs.rows.length > 0) {
        console.log("SOMETHING = " + rs.rows.length);
      } else {
        await fetchArticlesAndSave();
      }
    });
  }

  fetchUserInitials = () => {
    if (this.state.initials !== "") {
      return <>{"Hello " + this.state.initials + "!"}</>;
    } else {
      return <>{"Hello There!"}</>;
    }
  };

  render() {
    const homeScreenLinkComponents = ({ navigation }) => {
      return (
        <ScrollView>
          <View
            style={{
              backgroundColor: Constants.COLOUR_EBONY,
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <LinearGradient
              colors={Constants.LINEAR_GRADIENT_MAIN}
              style={styles.homeDashboardGreeterContainer}
            >
              <Right style={styles.homeDashboardGreeterRightContent}>
                <Text style={styles.homeDashboardContent}>
                  <this.fetchUserInitials />
                </Text>
              </Right>
            </LinearGradient>

            {/* ENGAGE ITEMS */}
            <Engage navigation={navigation} />

            {/* ARTICLE OF THE DAY */}
            <ArticleOfTheDay />
          </View>
        </ScrollView>
      );
    };

    return (
      <Container style={styles.bgPurple1}>
        <Content contentContainerStyle={styles.rneContentHomeDashboard}>
          {/* *************************** */}
          {/* START */}
          <Stack.Navigator
            // Makes the transition be like cards
            screenOptions={() => ({
              cardStyle: { backgroundColor: "transparent" },
              cardOverlayEnabled: true,
              ...TransitionPresets.SlideFromRightIOS,
            })}
            mode="modal"
          >
            <Stack.Screen
              name={Constants.HOME_SCREEN_MAIN}
              component={homeScreenLinkComponents}
              options={this.homeScreenHeaderOptions}
            />
            <Stack.Screen
              name={Constants.HOME_SCREEN_MY_AVO}
              component={MyAVO}
              options={this.learningModuleHeaderOptions}
            />
            <Stack.Screen
              name={Constants.HOME_SCREEN_LEARNING_MODULES}
              component={LearningModule}
              options={this.learningModuleHeaderOptions}
            />
            <Stack.Screen
              name={Constants.MODULE}
              component={Module}
              options={this.learningModuleHeaderOptions}
            />
            <Stack.Screen
              name={Constants.QUIZZES}
              component={Quiz}
              options={this.learningModuleHeaderOptions}
            />
            <Stack.Screen
              name={Constants.HOME_SCREEN_SUPPORT}
              component={Support}
              options={this.learningModuleHeaderOptions}
            />
          </Stack.Navigator>
          <QuickHelp />

          {/* END */}
          {/* *************************** */}
        </Content>
      </Container>
    );
  }

  //* *************************************** */
  // Below are the header options used for => <Stack.Screen options={myCustomOptions}>

  //Constants.HOME_SCREEN_MAIN
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
      <View style={{ paddingLeft: 20 }}>
        <Icon
          name="bars"
          type="font-awesome"
          color="white"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      </View>
    ),
  });

  //Constants.HOME_SCREEN_LEARNING_MODULES
  learningModuleHeaderOptions = ({}) => ({
    headerStyle: { backgroundColor: Constants.COLOUR_EBONY },
    headerTintColor: "white",
    headerTitleStyle: {
      color: "white",
    },
  });

  //Constants.MODULE
  moduleHeaderOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: Constants.COLOUR_EBONY },
    headerTintColor: "white",
    headerTitleStyle: {
      color: "white",
    },
    headerLeft: () => (
      <View style={{ marginLeft: 10 }}>
        <Icon
          name="arrow-left"
          type="material-community"
          color="white"
          onPress={() => navigation.goBack()}
        />
      </View>
    ),
  });
}

// Status bar issues fix using native-base
// https://github.com/GeekyAnts/NativeBase/issues/899

// Menu burger icon not staying on the left when using the native-base <Left>
// When you include a <Left> component you will also HAVE to include it's accompanying counterpart => <Right>
