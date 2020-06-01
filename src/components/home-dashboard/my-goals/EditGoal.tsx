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
import { deleteUserGoal } from "db/DeleteScripts";
import { grabUserGoalById } from "db/SelectScripts";
import { updateUserGoalById } from "db/UpdateScripts";
import CustomTextInput from "components/user-setup/CustomTextInput";
import CustomModal from "components/user-setup/CustomModal";

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
  screenLoader: React.ReactFragment;
  errorMsg: string;
}

export default class EditGoal extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false,
      modalDesc: "",
      modalAction: 0,
      userGoalId: 0,
      userGoalDesc: "",
      screenLoader: <></>,
      errorMsg: "",
    };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    let rsUserGoal = await grabUserGoalById(this.props.route.params.userGoalId);
    let item = rsUserGoal.rows.item(0);
    this.setState({
      userGoalId: item.userGoalId,
      userGoalDesc: item.userGoalDesc,
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
    if (this.state.modalAction == 1) {
      this.deleteGoalHandler(this.state.userGoalId);
    } else if (this.state.modalAction == 2) {
      this.saveGoalHandler(this.state.userGoalDesc);
    } else if (this.state.modalAction == 3) {
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

  deleteGoalHandler = async (userGoalId: number) => {
    Keyboard.dismiss(); //dismiss keyboard
    this.screenLoader(true);
    let deleteSuccess = await deleteUserGoal(userGoalId);
    if (deleteSuccess) {
      //this is a function from GoalSettings that is currently binded. Will refresh the page first.
      await this.props.route.params.refreshData();
      //after refresh we go back.
      this.props.navigation.navigate(Constants.LEFT_NAV_GOAL_SETTINGS);
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
      let updateSuccess = await updateUserGoalById(userGoalDesc, this.state.userGoalId); //prettier-ignore
      if (!updateSuccess) {
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
        <this.goalTextAreaComponent />

        <CustomTextInput
          editable={false}
          onPress={() => {
            this.modalVisibleHandler(
              true,
              1,
              "Are you sure you want to remove your goal?"
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
              2,
              "Remember, changing your goal will reset progress on your current goal. \n\nDo you want to continue?"
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
