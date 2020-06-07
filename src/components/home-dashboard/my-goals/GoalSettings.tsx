import * as React from "react";
import * as Constants from "constants/Constants";
import { Component } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";
import { Container, Content, Right } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
const PAGE_WIDTH = Dimensions.get("window").width;

/* *************************************** */
// Import Custom Components
import styles from "styles/Styles";
import { dropUserGoal } from "db/DropScripts";
import {
  debugPrintScript,
  // grabUserGoalSettingsById,
  grabActiveUserGoal,
  grabAllUserGoal,
  grabNumberOfCompletedOrDroppedGoals,
} from "db/SelectScripts";
import { TouchableOpacity } from "react-native-gesture-handler";

interface IProps {
  navigation: any;
}
interface IState {
  userHasGoalsHistory: boolean;
  screenLoader: React.ReactFragment;
  goalHeaderAndBodyComponent: React.ReactFragment;
  userGoalId: number;
  goalsCompleted: number;
  goalsDropped: number;
  currentGoalHeader: string;
  currentGoalBody: string;
  currentGoalIconAndFunction: React.ReactFragment;
}

export default class GoalSettings extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      userHasGoalsHistory: false,
      screenLoader: <></>,
      goalHeaderAndBodyComponent: <></>,
      userGoalId: 0,
      goalsCompleted: 0,
      goalsDropped: 0,
      currentGoalHeader: "",
      currentGoalBody: "",
      currentGoalIconAndFunction: <></>,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.refreshData();
    });
    this.init();
  }

  componentWillUnmount() {
    this.props.navigation.removeListener("focus");
  }

  private refreshData = () => {
    this.init();
  };

  private async init() {
    this.screenLoader(true);
    // await debugPrintScript("drop table usergoal;");
    // await debugPrintScript(
    // "SELECT userGoalId, userGoalComplete, userGoalDesc FROM userGoal WHERE userGoalComplete = 3; "
    // "insert into usergoal(userGoalDesc, userGoalActive, userGoalComplete) values('Get Drunk As Fuark', 0, 1); "
    // );
    // await dropUserGoal(); //for testings only.

    // await debugPrintScript("select userGoalId from userGoal; ");
    let rs = await grabActiveUserGoal();
    if (rs != null && rs.rows.length > 0) {
      await this.userGoalHistoryHandler();
      this.setState({
        userGoalId: rs.rows.item(0).userGoalId,
        currentGoalHeader: "Current Goal",
        currentGoalBody: rs.rows.item(0).userGoalDesc,
        currentGoalIconAndFunction: (
          <Icon
            name="edit"
            type="font-awesome"
            color="white"
            onPress={() =>
              this.props.navigation.navigate(Constants.GOAL_EDIT, {
                userGoalId: rs.rows.item(0).userGoalId,
              })
            }
          />
        ),
      });
    } else {
      await this.userGoalHistoryHandler();
      this.setState({
        currentGoalHeader: "No goals currently set",
        currentGoalBody: "Let's set a goal for you",
        currentGoalIconAndFunction: (
          <Icon
            reverse
            name="arrow-right"
            type="font-awesome"
            onPress={() =>
              this.props.navigation.navigate(Constants.GOAL_CREATE)
            }
          />
        ),
      });
    }
    this.screenLoader(false);
  }

  private userGoalHistoryHandler = async () => {
    let rsUserGoals = await grabAllUserGoal();
    if (rsUserGoals !== null && rsUserGoals.rows.length > 0) {
      let goalsDropped = await grabNumberOfCompletedOrDroppedGoals(0);
      let goalsCompleted = await grabNumberOfCompletedOrDroppedGoals(1);
      let userHasGoalHistory = goalsDropped > 0 || goalsCompleted > 0;
      this.setState({
        userHasGoalsHistory: userHasGoalHistory,
        goalHeaderAndBodyComponent: <></>,
        goalsCompleted: goalsCompleted,
        goalsDropped: goalsDropped,
        // set something here to show user if we have something on our table otherwise hide this component
      });
    } else {
    }
  };

  private screenLoader = (show: boolean) => {
    this.setState({
      screenLoader: show ? (
        <ActivityIndicator
          size="large"
          style={styles.activityIndicatorOverlayCentre}
        />
      ) : (
        <></>
      ),
    });
  };

  render() {
    const ITEMS = [
      {
        screenNav: Constants.GOAL_VIEW_HISTORY,
        screenName: "Completed Goals",
        count: this.state.goalsCompleted,
        isCompletedGoals: 1,
      },
      {
        screenNav: Constants.GOAL_VIEW_HISTORY,
        screenName: "Dropped Goals",
        count: this.state.goalsDropped,
        isCompletedGoals: 0,
      },
    ];

    return (
      // prettier-ignore
      <Container style={styles.bgPurple1}>
        <Content contentContainerStyle={styles.rneContentHomeDashboard}>
          <View style={stylesBlock.settingsContainer}>
            {/* ******************************************************************** */}
            {/* User Current Goal Section */}
            <LinearGradient
              colors={Constants.LINEAR_GRADIENT_MAIN}
              style={styles.goalSettingsContainer}
            >
              <View style={styles.goalSettingsContent}>
                <Text style={styles.goalSettingsTextHeader}>
                  {this.state.currentGoalHeader}
                </Text>
                <Text style={styles.goalSettingsTextBody}>
                  {this.state.currentGoalBody}
                </Text>
                {/* <View style={stylesBlock.currentGoalIconCenter}> */}
                <View style={stylesBlock.currentGoalIconCenter}>
                  {this.state.currentGoalIconAndFunction}
                </View>
              </View>
            </LinearGradient>

            {/* ******************************************************************** */}
            {/* User Goal Completed and Dropped goals section. */}
            {this.state.userHasGoalsHistory && (
              <>
                <View style={styles.homeDashboardHeading}>
                  <Text style={styles.homeDashboardHeader}>{"Goals history"}</Text>
                </View>

                {ITEMS.map((item, x) => (
                  <TouchableOpacity 
                    key={x}
                    onPress={() => this.props.navigation.navigate(item.screenNav, {
                      screenName: item.screenName,
                      isCompletedGoals: item.isCompletedGoals
                    })}     
                  >
                    <LinearGradient
                      colors={Constants.LINEAR_GRADIENT_MAIN}
                      style={styles.homeDashboardEngageItems}
                    >
                      <Text style={stylesBlock.goalsHistoryBody}>{item.count}</Text>
                      <Text style={styles.homeDashboardContent}>{item.screenName}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
          {/* The screenloader that will overlay on top of everything */}
          {this.state.screenLoader}
        </Content>
      </Container>
    );
  }
}

const stylesBlock = StyleSheet.create({
  settingsContainer: {
    backgroundColor: Constants.COLOUR_EBONY,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  settingsContentTop: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "#fff",
    borderBottomColor: "#fff",
    // backgroundColor: "red",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
    paddingTop: 8,
  },
  settingsContents: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    // backgroundColor: "red",
    alignItems: "center",
    marginBottom: 8,
  },
  settingsTextHeader: {
    color: Constants.COLOUR_WHITE,
    fontSize: 16,
    fontWeight: "bold",
    // backgroundColor: "blue",
    alignSelf: "flex-start",
  },
  goalsHistoryBody: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: Constants.COLOUR_WHITE,
  },
  currentGoalIconCenter: {
    paddingTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  currentGoalIconRight: {
    paddingTop: 8,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

const pickerSelectStyles = StyleSheet.create({
  // inputIOS: {
  //   fontSize: 16,
  //   paddingVertical: 12,
  //   paddingHorizontal: 10,
  //   borderWidth: 1,
  //   borderColor: "gray",
  //   borderRadius: 4,
  //   color: "white",
  //   paddingRight: 30, // to ensure the text is never behind the icon
  // },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "white",
    borderRadius: 8,
    color: "white",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  settingItemStyle: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "white",
    // paddingRight: 30, // to ensure the text is never behind the icon
    borderBottomWidth: 1,
    borderBottomColor: Constants.COLOUR_WHITE,
    marginBottom: 10,
  },
});
