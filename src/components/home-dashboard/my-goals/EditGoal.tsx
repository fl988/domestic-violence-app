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

/* ***************************************************************************************** */
// Import Custom Components
import { deleteUserGoal } from "db/DeleteScripts";
import { grabUserGoalById } from "db/SelectScripts";
import {
  updateUserGoalDescById,
  updateUserGoalActiveById,
} from "db/UpdateScripts";
import CustomTextInput from "components/user-setup/CustomTextInput";
import CustomModal from "components/user-setup/CustomModal";
import { RotationGestureHandler } from "react-native-gesture-handler";

interface IProps {
  navigation: any;
  route: NavigationRoute;
}
interface IState {
  modalVisible: boolean;
  modalDesc: string;
  modalAction: number;
  userGoalId: number;
  userGoalDesc: string;
  prevUserGoalDesc: string;
  isShowResetButton: boolean;
  screenLoader: React.ReactFragment;
  errorMsg: string;
}

/* ***************************************************************************************** */
// Local constants
const GOAL_ACTION_DELETE = 1;
const GOAL_ACTION_SAVE = 2;
const GOAL_ACTION_RESET = 3;
const GOAL_ACTION_COMPLETE = 4;

export default class EditGoal extends Component<IProps, IState> {
  /* ***************************************************************************************** */
  // constructor, props and state
  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false,
      modalDesc: "",
      modalAction: 0,
      userGoalId: 0,
      userGoalDesc: "",
      prevUserGoalDesc: "",
      isShowResetButton: false,
      screenLoader: <></>,
      errorMsg: "",
    };
  }

  /* ***************************************************************************************** */
  // Functions
  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    console.log(this.props.route.params.userGoalId);
    let rsUserGoal = await grabUserGoalById(this.props.route.params.userGoalId);
    let item = rsUserGoal.rows.item(0);
    this.setState({
      userGoalId: item.userGoalId,
      userGoalDesc: item.userGoalDesc,
      prevUserGoalDesc: item.userGoalDesc,
      isShowResetButton: false,
    });
  }

  modalVisibleHandler = (
    v: boolean,
    modalAction: number,
    ...modalDesc: string[]
  ) => {
    if (modalAction > 0) {
      this.setState({ modalAction: modalAction });
    }

    this.setState({
      modalVisible: v,
      modalDesc: modalDesc[0],
    });
  };

  modalAction = () => {
    if (this.state.modalAction == GOAL_ACTION_DELETE) {
      this.updateGoalHandler(this.state.userGoalId, false);
    } else if (this.state.modalAction == GOAL_ACTION_SAVE) {
      this.saveGoalHandler(this.state.userGoalDesc);
    } else if (this.state.modalAction == GOAL_ACTION_COMPLETE) {
      this.updateGoalHandler(this.state.userGoalId, true);
    } else if (this.state.modalAction == GOAL_ACTION_RESET) {
      this.loadData(); //reload data
    }
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
            onChangeText={(userGoalDesc: string) => {
              this.setState({
                userGoalDesc,
                isShowResetButton: userGoalDesc !== this.state.prevUserGoalDesc,
              });
            }}
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

  updateGoalHandler = async (userGoalId: number, isComplete: boolean) => {
    Keyboard.dismiss(); //dismiss keyboard
    this.screenLoader(true);
    let updateSuccess = await updateUserGoalActiveById(
      false,
      isComplete,
      userGoalId
    );
    if (updateSuccess) {
      //this is a function from GoalSettings that is currently binded. Will refresh the page first.
      // await this.props.route.params.refreshData();
      //after refresh we go back to the previous page.
      this.props.navigation.navigate(Constants.HOME_SCREEN_GOALS);
      this.screenLoader(false);
    } else {
      this.screenLoader(false);
    }
  };

  saveGoalHandler = async (userGoalDesc: string) => {
    if (userGoalDesc.length > 2) {
      Keyboard.dismiss(); //dismiss keyboard
      this.screenLoader(true); //show screen loader

      // do db scripts here and wait.
      let updateSuccess = await updateUserGoalDescById(userGoalDesc, this.state.userGoalId); //prettier-ignore
      if (!updateSuccess) {
        this.errorMsgHandler("Failed to save goal.", 3);
        this.screenLoader(false);
      } else {
        //this is a function from GoalSettings that is currently binded. Will refresh the page first.
        this.props.route.params.refreshData();
        //after refresh we go back.
        setTimeout(() => {
          this.props.navigation.navigate(Constants.HOME_SCREEN_GOALS);
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
          style={styles.activityIndicatorOverlayCentre}
        />
      ) : (
        <></>
      ),
    });
  };

  resetButton = () => {
    if (this.state.isShowResetButton) {
      return (
        <CustomTextInput
          editable={false}
          onPress={() => {
            this.loadData();
          }}
          rightIcon={"refresh"}
          rightIconType={"font-awesome"}
          rightIconColor={"white"}
          textInputPlaceholder={"Reset"}
          textInputPlaceholderColor={"white"}
          value={null}
        />
      );
    } else {
      return <></>;
    }
  };

  /* ***************************************************************************************** */
  // RENDER
  render() {
    return (
      <Container style={styles.bgPurple1}>
        <this.goalTextAreaComponent />

        <CustomTextInput
          editable={false}
          onPress={() => {
            this.modalVisibleHandler(
              true,
              GOAL_ACTION_DELETE,
              "You are about to remove your goal. \n\nAre you sure you want to continue?"
            );
            // this.saveGoalHandler(this.state.userGoalDesc);
          }}
          rightIcon={"times"}
          rightIconType={"font-awesome"}
          rightIconColor={"white"}
          textInputPlaceholder={"Remove Goal"}
          textInputPlaceholderColor={"white"}
          value={null}
        />

        <CustomTextInput
          editable={false}
          onPress={() => {
            this.modalVisibleHandler(
              true,
              GOAL_ACTION_COMPLETE,
              "You are about to complete your goal. \n\nPlease make sure you've actually completed this goal."
            );
            // this.saveGoalHandler(this.state.userGoalDesc);
          }}
          rightIcon={"trophy"}
          rightIconType={"font-awesome"}
          rightIconColor={"white"}
          textInputPlaceholder={"Complete Goal"}
          textInputPlaceholderColor={"white"}
          value={null}
        />

        <CustomTextInput
          editable={false}
          onPress={() => {
            this.modalVisibleHandler(
              true,
              GOAL_ACTION_SAVE,
              "You are about to change your goal. \n\nDo you want to continue?"
            );
            // this.saveGoalHandler(this.state.userGoalDesc);
          }}
          rightIcon={"check"}
          rightIconType={"font-awesome"}
          rightIconColor={"white"}
          textInputPlaceholder={"Save Goal"}
          textInputPlaceholderColor={"white"}
          value={null}
        />

        <this.resetButton />

        <CustomModal
          modalVisible={this.state.modalVisible}
          modalVisibleHandler={this.modalVisibleHandler}
          action={() => {
            this.modalAction();
          }}
          modalHeader={"Confirmation"}
          modalBody={this.state.modalDesc}
        />
      </Container>
    );
  }
}
