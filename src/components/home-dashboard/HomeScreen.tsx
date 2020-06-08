/* ***************************************************************************************** */
// Import Modules
import React, { Component, ReactFragment } from "react";
import {
  View,
  AppState,
  ImageBackground,
  Dimensions,
  Button,
} from "react-native";
import { Container, Content, Right } from "native-base";
import { Icon, Text } from "react-native-elements";
import { DrawerActions } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
const { width, height } = Dimensions.get("window");
import { HOME_BACKGROUND } from "images/Images";
import {
  NavigationState,
  NavigationParams,
  NavigationScreenProp,
  NavigationRoute,
} from "react-navigation"; //React Navigation with TypeScript => https://dev.to/andreasbergqvist/react-navigation-with-typescript-29ka
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

/* ***************************************************************************************** */
// Import Custom Components
import * as Constants from "constants/Constants";
import styles from "styles/Styles";
import db from "db/User";
import {
  grabAllArticles,
  grabLatestCourtDateReminder,
  getDifferenceInDaysVsNow,
  debugPrintScript,
} from "db/SelectScripts";
import { fetchArticlesAndSave } from "db/FetchAndSaveScripts";
import MyAVO from "components/home-dashboard/my-avo/MyAVO";
import LearningModule from "components/home-dashboard/learning-modules/LearningModule";
import Module from "components/home-dashboard/learning-modules/Module";
import Quiz from "components/home-dashboard/learning-modules/Quiz";
import SupportLinks from "components/home-dashboard/SupportLinks";
import QuickHelp from "components/QuickHelp";
import ArticleOfTheDay from "components/home-dashboard/ArticleOfTheDay";
import Engage from "components/home-dashboard/Engage";
import GoalSettings from "components/home-dashboard/my-goals/GoalSettings";
import CreateGoal from "components/home-dashboard/my-goals/CreateGoal";
import EditGoal from "components/home-dashboard/my-goals/EditGoal";
import ViewGoalHistory from "components/home-dashboard/my-goals/ViewGoalHistory";

/* ***************************************************************************************** */
// Interface
interface IProps {
  navigation: any;
  route: NavigationRoute;
}
interface IState {
  initials?: string;
  numberOfModules: number;
  appState?: any;
  articleOfTheDay: ReactFragment;
  courtDateReminder: string;
}

export default class HomeScreen extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      initials: "",
      numberOfModules: 0,
      appState: AppState.currentState,
      articleOfTheDay: <></>,
      courtDateReminder: "",
    };
  }

  componentDidMount() {
    //Display initials
    db.grabUserDetails().then((data) => {
      if (data != null) {
        let user = data.rows.item(0);
        this.setState({
          initials: user.initials,
        });
      }
    });

    this.callFunctions();
  }

  async callFunctions() {
    let rsCDM: SQLResultSet = await grabLatestCourtDateReminder();
    if (rsCDM !== null) {
      if (rsCDM.rows.length > 0) {
        let i = rsCDM.rows.item(0);
        let remaining = await getDifferenceInDaysVsNow(
          i.courtDateReminderId,
          i.endTimestamp
        );
        this.setState({
          courtDateReminder:
            "\n\nYou have a court date due in " +
            parseInt(remaining) +
            " day" +
            (parseInt(remaining) <= 1 ? "" : "s."),
        });
      }
    }

    await this.fetchLeaningModules();
    await this.fetchArticles();
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
    let rs = await grabAllArticles();
    if (rs != null && rs.rows.length > 0) {
      this.setState({
        articleOfTheDay: <ArticleOfTheDay />,
      });
    } else {
      let success = await fetchArticlesAndSave();
      if (success) {
        this.setState({
          articleOfTheDay: <ArticleOfTheDay />,
        });
      }
    }
  }

  getUserInitials = () => {
    if (this.state.initials !== "") {
      return <Text>{"Hello " + this.state.initials + "!"}</Text>;
    } else {
      return <Text>{"Hello There!"}</Text>;
    }
  };

  courtDateReminderComponent = () => {
    if (
      this.state.courtDateReminder.length > 0 &&
      this.state.courtDateReminder !== ""
    ) {
      return <Text>{this.state.courtDateReminder}</Text>;
    } else {
      return <></>;
    }
  };

  render() {
    const homeScreenLinkComponents = ({ navigation }) => {
      return (
        <ScrollView>
          <View
            style={{
              // backgroundColor: Constants.COLOUR_EBONY,
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <ImageBackground
              source={HOME_BACKGROUND}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 24,
                backgroundColor: Constants.COLOUR_EAST_BAY, //"rgba(255,255,255, 0.3)",
                justifyContent: "center",
                height: width / 2,
                width: width,
              }}
            >
              <Right style={styles.homeDashboardGreeterRightContent}>
                <Text style={styles.homeDashboardContent}>
                  <this.getUserInitials />
                  <this.courtDateReminderComponent />
                </Text>
              </Right>
            </ImageBackground>

            {/* ENGAGE ITEMS */}
            <Engage navigation={navigation} />

            {/* ARTICLE OF THE DAY */}
            {this.state.articleOfTheDay}
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
              component={SupportLinks}
              options={this.learningModuleHeaderOptions}
            />
            <Stack.Screen
              name={Constants.HOME_SCREEN_GOALS}
              component={GoalSettings}
              options={this.learningModuleHeaderOptions}
            />
            <Stack.Screen
              name={Constants.GOAL_CREATE}
              component={CreateGoal}
              options={this.learningModuleHeaderOptions}
            />
            <Stack.Screen
              name={Constants.GOAL_EDIT}
              component={EditGoal}
              options={this.learningModuleHeaderOptions}
            />
            <Stack.Screen
              name={Constants.GOAL_VIEW_HISTORY}
              component={ViewGoalHistory}
              options={this.learningModuleHeaderOptions}
            />
          </Stack.Navigator>
          <QuickHelp redoTutorial={this.props.route.params.redoTutorial} />

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
