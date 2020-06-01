import * as React from "react";
import * as Constants from "constants/Constants";
import { Component } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { Icon } from "react-native-elements";
import { Container, Content } from "native-base";
import { DrawerActions } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"; //prettier-ignore
const Stack = createStackNavigator();

/* *************************************** */
// Import Custom Components
import styles from "styles/Styles";
import { createUserGoal } from "db/CreateScripts";
import { grabActiveUserGoal } from "db/SelectScripts";
import CreateGoal from "components/home-dashboard/my-goals/CreateGoal";
import EditGoal from "components/home-dashboard/my-goals/EditGoal";

interface IProps {
  navigation: any;
}
interface IState {
  modalVisible: boolean;
  screenLoader: React.ReactFragment;
  isGoalExist: boolean;
  goalHeaderAndBodyComponent: React.ReactFragment;
}

export default class GoalSettings extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false,
      screenLoader: <></>,
      isGoalExist: false,
      goalHeaderAndBodyComponent: <></>,
    };
  }

  componentDidMount() {
    this.props.navigation.removeListener("focus");
    this.init();
  }

  refreshData = () => {
    this.init();
  };

  async init() {
    this.screenLoader(true);
    // await dropUserGoal(); //for testings only.
    let rs = await grabActiveUserGoal();
    if (rs != null && rs.rows.length > 0) {
      this.setState({ goalHeaderAndBodyComponent: <></> });
      this.setState({
        isGoalExist: true,
        goalHeaderAndBodyComponent: (
          <>
            <Text style={styles.goalSettingsTextHeader}>{"Current Goal"}</Text>
            <Text style={styles.goalSettingsTextBody}>
              {rs.rows.item(0).userGoalDesc}
            </Text>
            <View
              style={{
                paddingTop: 8,
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Icon
                name="edit"
                type="font-awesome"
                color="white"
                onPress={() =>
                  this.props.navigation.navigate(Constants.GOAL_EDIT, {
                    userGoalId: rs.rows.item(0).userGoalId,
                    refreshData: this.refreshData.bind(this),
                  })
                }
              />
            </View>
          </>
        ),
      });
    } else {
      //if rs is null, we create a userGoal table.
      await createUserGoal();
      this.setState({
        isGoalExist: false,
        goalHeaderAndBodyComponent: (
          <>
            <Text style={styles.goalSettingsTextHeader}>
              {"No goals currently set"}
            </Text>
            <Text style={styles.goalSettingsTextBody}>
              {"Let's set a goal for you"}
            </Text>
            <View
              style={{
                paddingTop: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                reverse
                name="arrow-right"
                type="font-awesome"
                onPress={() =>
                  this.props.navigation.navigate(Constants.GOAL_CREATE, {
                    refreshData: this.refreshData.bind(this),
                  })
                }
              />
            </View>
          </>
        ),
      });
    }
    this.screenLoader(false);
  }

  screenLoader = (show: boolean) => {
    this.setState({
      screenLoader: show ? (
        <ActivityIndicator
          size="large"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: 0.5,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      ) : (
        <></>
      ),
    });
  };

  render() {
    const goalSettingsComponent = ({ navigation }) => {
      return (
        <Content contentContainerStyle={styles.rneContent}>
          <LinearGradient
            colors={Constants.LINEAR_GRADIENT_MAIN}
            style={styles.goalSettingsContainer}
          >
            <View style={styles.goalSettingsContent}>
              {/**************** HEADING ****************/}

              {/**************** BODY ****************/}
              {this.state.goalHeaderAndBodyComponent}
            </View>
          </LinearGradient>
        </Content>
      );
    };

    return (
      <Container style={styles.bgPurple1}>
        <Content contentContainerStyle={styles.rneContentHomeDashboard}>
          <Stack.Navigator
            screenOptions={() => ({
              cardStyle: { backgroundColor: "transparent" },
              cardOverlayEnabled: true,
              ...TransitionPresets.SlideFromRightIOS,
            })}
            mode="modal"
          >
            <Stack.Screen
              name={Constants.LEFT_NAV_GOAL_SETTINGS}
              component={goalSettingsComponent}
              options={this.goalSettingHeaderOptions}
            />
            <Stack.Screen
              name={Constants.GOAL_CREATE}
              component={CreateGoal}
              options={this.goalSettingHeaderOptions}
            />
            <Stack.Screen
              name={Constants.GOAL_EDIT}
              component={EditGoal}
              options={this.goalSettingHeaderOptions}
            />
          </Stack.Navigator>
          {this.state.screenLoader}
        </Content>
      </Container>
    );
  }

  //Constants.GOAL_CREATE
  goalSettingHeaderOptions = ({ navigation }) => ({
    headerStyle: { backgroundColor: Constants.COLOUR_EBONY },
    headerTintColor: "white",
    headerTitleStyle: {
      color: "white",
    },
    headerLeft: () => (
      <View style={{ marginLeft: 20 }}>
        <Icon
          name="bars"
          type="font-awesome"
          color="white"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      </View>
    ),
  });
}
