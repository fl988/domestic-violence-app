import * as React from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");
import { Icon } from "react-native-elements";
import { Container, Content, Body, H3 } from "native-base";
import { NavigationRoute } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";
/* ***************************************************************************************** */
// Consts, styles, scripts
import * as Constants from "constants/Constants";
import styles from "styles/Styles";
import {
  grabCompletedOrDroppedGoals,
  formatGoalHistoryAsJSONObj,
  debugPrintScript,
} from "db/SelectScripts";
import { deleteUserGoal } from "db/DeleteScripts";

/* ***************************************************************************************** */
// Interface
interface completedOrDroppedGoalsObjStructure {
  userGoalId: number;
  userGoalDesc: string;
  startTimestamp: string;
}
interface IProps {
  navigation: any;
  route: NavigationRoute;
}
interface IState {
  userGoalHistoryItems: completedOrDroppedGoalsObjStructure[];
  modalVisible: boolean;
  screenLoader: React.ReactFragment;
}

export default class ViewGoalHistory extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      userGoalHistoryItems: [],
      modalVisible: false,
      screenLoader: <></>,
    };
  }

  async componentDidMount() {
    await debugPrintScript(
      "select count(*) from usergoal; "
      //   "SELECT datetime('now','localtime');"
      //   "select strftime('%d', '2020-06-06') as day, case strftime('%m', '2020-06-06') when '01' then 'January' when '02' then 'Febuary' when '03' then 'March' when '04' then 'April' when '05' then 'May' when '06' then 'June' when '07' then 'July' when '08' then 'August' when '09' then 'September' when '10' then 'October' when '11' then 'November' when '12' then 'December' else '' end as month; "
    );
    this.loadData();
  }

  loadData = async () => {
    this.screenLoader(true);
    let rsUserGoal = await grabCompletedOrDroppedGoals(
      this.props.route.params.isCompletedGoals
    );

    let userGoalHistoryArr: completedOrDroppedGoalsObjStructure[] = await formatGoalHistoryAsJSONObj(
      rsUserGoal
    );

    this.setState({
      userGoalHistoryItems: userGoalHistoryArr,
    });
    this.screenLoader(false);
  };

  modalVisibleHandler = (v) => {
    this.setState({
      modalVisible: v,
    });
  };

  deleteUserGoalHandler = async (userGoalId: number) => {
    let success = await deleteUserGoal(userGoalId);
    this.loadData();
  };

  screenLoader = (show: boolean) => {
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
    return (
      <Container style={styles.bgPurple1}>
        <Content contentContainerStyle={styles.rneContentHomeDashboard}>
          <ScrollView
            contentContainerStyle={{
              // flex: 1,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
              <H3 style={{ fontWeight: "bold", color: Constants.COLOUR_WHITE }}>
                {this.props.route.params.screenName}
              </H3>
            </View>

            {this.state.userGoalHistoryItems.map((item, idx) => (
              <LinearGradient
                key={idx}
                colors={Constants.LINEAR_GRADIENT_MAIN}
                style={{
                  marginTop: 12,
                  marginBottom: 24,
                  borderRadius: 8,
                  height: "auto",
                  width: width - 36,
                  backgroundColor: Constants.COLOUR_EAST_BAY,
                }}
              >
                <View>
                  <View style={{ margin: 8 }}>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flex: 1 }}>
                        {!!item.startTimestamp && (
                          <Text style={[styles.lmText]}>
                            {item.startTimestamp}
                          </Text>
                        )}
                      </View>

                      <View>
                        <TouchableOpacity>
                          <Icon
                            name="times-circle"
                            type="font-awesome"
                            color="white"
                            onPress={() => {
                              this.deleteUserGoalHandler(item.userGoalId);
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        paddingTop: 10,
                        paddingBottom: 10,
                      }}
                    >
                      {!!item.userGoalDesc && (
                        <Body>
                          <Text
                            style={{
                              color: Constants.COLOUR_WHITE,
                              fontSize: 15,
                              fontWeight: "bold",
                              paddingBottom: 10,
                            }}
                          >
                            {item.userGoalDesc}
                          </Text>
                        </Body>
                      )}
                    </View>
                  </View>
                </View>
              </LinearGradient>
            ))}
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
