import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "react-native-elements";
import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
// Database
import db from "db/User";
// Styles
import myStyles from "styles/Styles";
import * as Constants from "constants/Constants";

const InitialsInput = (props) => {
  /***********************************************************************************/
  // States
  const [getInitialsEntered, setInitialsEntered] = useState(""); // "" by default.
  const [getButtonHideStatus, setButtonHideStatus] = useState({}); //The button that will show "Continue" when initials are completely filled out. Otherwise hide it.
  const [getIconStatus, setIconStatus] = useState(<></>);

  React.useEffect(() => {
    initialsHandler();
  }, []);

  const initialsHandler = async () => {
    let rs = await db.grabUserDetails();
    if (rs != null && rs.rows.length > 0)
      setInitialsEntered(rs.rows.item(0).initials);
  };
  /***********************************************************************************/
  // Functional components
  const initialsInputHandler = (userInput) => {
    setButtonHideStatus(userInput.length >= 2 ? true : false);
    if (userInput.length >= 3) {
      return;
    }
    userInput = userInput.toUpperCase().replace(/[^a-zA-Z ]/g, "");
    setInitialsEntered(userInput); //Turn it to upper case then only accept A-z

    if (props.isSettingsPage) {
      autoUpdateInitials(userInput);
    }
  };

  const autoUpdateInitials = (userInput: string) => {
    setIconStatus(<ActivityIndicator />);
    db.updateUserInitials(userInput);
    setTimeout(() => {
      setIconStatus(
        <Icon
          style={{ alignSelf: "flex-end" }}
          name="check-circle"
          type="font-awesome"
          color="green"
        />
      );
      props.refreshHomeScreen();
    }, 500); //We set it to .50 seconds
  };

  const onNextHandler = (userInitials) => {
    Keyboard.dismiss(); //Dismiss the keyboard.
    props.onNext(); //Swipe to next page.
    db.updateUserInitials(userInitials);
  };

  /***********************************************************************************/
  // The "Next" button that shows once the user successfully entered the required fields.
  var button = null;
  if (getButtonHideStatus) {
    button = (
      <TouchableOpacity
        style={myStyles.nextBtnV2}
        onPress={() => onNextHandler(getInitialsEntered)}
      >
        <Text style={myStyles.buttonText}>{"NEXT"}</Text>
      </TouchableOpacity>
    );
  }

  /***********************************************************************************/
  // The returning component
  return (
    <View>
      {props.isSettingsPage && (
        <View style={localStyle.updateButtonContainer}>
          <Text style={localStyle.updateButtonHeader}>
            {"Change your initials"}
          </Text>
          <View style={localStyle.updateButtonStyle}>
            <TouchableOpacity style={{ alignSelf: "flex-end" }}>
              {getIconStatus}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View
        style={props.isSettingsPage ? localStyle.custom : localStyle.default}
      >
        <LinearGradient
          colors={Constants.LINEAR_GRADIENT_MAIN}
          style={myStyles.sectionStyle}
        >
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Leave blank to remain anonymous"
            // selectionColor={"#428AF8"}
            placeholderTextColor={Constants.COLOUR_WHITE}
            style={myStyles.input2}
            onChangeText={initialsInputHandler} //For every key strokes, this will invoke initialsInputHandler.
            value={getInitialsEntered}
          />
        </LinearGradient>
        {!props.hideNextButton && (
          <View>
            <TouchableOpacity
              style={myStyles.nextBtnV2}
              onPress={() => onNextHandler(getInitialsEntered)}
            >
              <Text style={myStyles.buttonText}>{"NEXT"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default InitialsInput;

const { width, height } = Dimensions.get("window");
const localStyle = StyleSheet.create({
  default: {
    alignSelf: "center",
    width: width / 1.2,
  },
  custom: {
    // alignSelf: "center",
  },
  updateButtonHeader: {
    color: Constants.COLOUR_WHITE,
    paddingTop: 8,
    fontWeight: "bold",
    justifyContent: "center",
    alignSelf: "flex-start",
    fontSize: 18,
  },
  updateButtonContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: "row",
  },
  updateButtonStyle: {
    alignSelf: "flex-end",
    marginRight: 16,
    flex: 1,
  },
});
