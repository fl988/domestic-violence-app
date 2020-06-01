import * as React from "react";
import * as Constants from "constants/Constants";
import styles from "styles/Styles";
import { Component } from "react";
import { Text, View, ActivityIndicator, Keyboard } from "react-native";
import Textarea from "react-native-textarea";
import { Icon } from "react-native-elements";
import { DrawerActions } from "@react-navigation/native";
import { Container, Header, Content, Left, Right, Body } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationRoute } from "react-navigation";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
const Stack = createStackNavigator();

/* *************************************** */
// Import Custom Components
import { insertUserGoal } from "db/InsertScripts";
import CustomTextInput from "components/user-setup/CustomTextInput";
import CustomModal from "components/user-setup/CustomModal";

interface IProps {
  navigation: any;
  route: NavigationRoute;
}
interface IState {
  modalVisible: boolean;
  userGoalDesc: string;
  screenLoader: React.ReactFragment;
  errorMsg: string;
  createGoalComponent: React.ReactFragment;
}

export default class CreateGoal extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false,
      userGoalDesc: "",
      screenLoader: <></>,
      errorMsg: "",
      createGoalComponent: <></>,
    };
  }

  //   componentDidMount() {}

  modalVisibleHandler = (v) => {
    this.setState({
      modalVisible: v,
    });
  };

  warningComponent = () => {
    return (
      <LinearGradient
        colors={Constants.LINEAR_GRADIENT_MAIN}
        style={[styles.goalSettingsContainer, { alignSelf: "center" }]}
      >
        <View style={styles.goalSettingsContent}>
          {/**************** HEADING ****************/}
          <Text style={styles.goalSettingsTextBody} onPress={() => {}}>
            {"Changing your goal will reset progress on your current goal"}
          </Text>
        </View>
      </LinearGradient>
    );
  };

  goalHeaderEditCompoent = () => {
    return (
      <View style={[styles.homeDashboardHeading, { paddingTop: 32 }]}>
        <Text
          style={{
            color: Constants.COLOUR_WHITE,
            alignSelf: "center",
            fontWeight: "bold",
          }}
        >
          {"Edit Goal"}
        </Text>
      </View>
    );
  };

  goalTextAreaComponent = () => {
    return (
      <View>
        <View
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            margin: 15,
            borderRadius: 3,
          }}
        >
          <Textarea
            style={{
              margin: 15,
              padding: 5,
            }}
            onChangeText={(userGoalDesc) => this.setState({ userGoalDesc })}
            defaultValue={this.state.userGoalDesc}
            maxLength={200}
            placeholder={"Tap here"}
            placeholderTextColor={"#c7c7c7"}
            underlineColorAndroid={"transparent"}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "red" }}>{this.state.errorMsg}</Text>
        </View>
      </View>
    );
  };

  saveGoalHandler = async (userGoalDesc: string) => {
    if (userGoalDesc.length > 2) {
      Keyboard.dismiss(); //dismiss keyboard
      this.screenLoader(true); //show screen loader

      // do db scripts here and wait.
      let insertSuccess = await insertUserGoal(userGoalDesc);
      if (!insertSuccess) {
        this.errorMsgHandler("Failed to save goal.", 3);
        this.screenLoader(false);
      } else {
        //this is a function from GoalSettings that is currently binded. Will refresh the page first.
        this.props.route.params.refreshData();
        //after refresh we go back.
        setTimeout(() => {
          this.props.navigation.navigate(Constants.LEFT_NAV_GOAL_SETTINGS);
          this.screenLoader(false);
        }, 1000);
      }
    } else {
      this.errorMsgHandler(
        userGoalDesc.length > 0
          ? "That seems like a short goal."
          : "Can't save an empty goal!",
        3
      );
      return;
    }
  };

  // Displays an error message for 'n' seconds.
  errorMsgHandler = (errMsg: string, seconds: number) => {
    this.setState({
      errorMsg: errMsg,
    });
    setTimeout(() => {
      this.setState({
        errorMsg: "",
      });
    }, seconds * 1000);
  };

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
    return (
      <Container style={styles.bgPurple1}>
        {/* <this.warningComponent /> */}
        {/* <this.goalHeaderEditCompoent /> */}

        <this.goalTextAreaComponent />

        <CustomTextInput
          editable={false}
          onPress={() => {
            this.saveGoalHandler(this.state.userGoalDesc);
          }}
          rightIcon={"check"}
          rightIconType={"font-awesome"}
          rightIconColor={"white"}
          textInputPlaceholder={"Save Goal"}
          textInputPlaceholderColor={"white"}
          value={null}
        />

        <CustomTextInput
          editable={false}
          onPress={() => {
            this.modalVisibleHandler(true);
          }}
          rightIcon={"refresh"}
          rightIconType={"font-awesome"}
          rightIconColor={"white"}
          textInputPlaceholder={"Reset"}
          textInputPlaceholderColor={"white"}
          value={null}
        />

        <CustomModal
          modalVisible={this.state.modalVisible}
          modalVisibleHandler={this.modalVisibleHandler}
          action={() => {
            this.setState({
              userGoalDesc: "",
            });
          }}
          modalHeader={"Confirmation"}
          modalBody={"Are you sure you want to reset your goal?"}
        />

        {/* For some reason, you need to place <ActivityIndicator/> here at the very bottom in order for it to overlay on top. */}
        {this.state.screenLoader}
      </Container>
    );
  }
}
