import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from "react-native";
// Database
import db from "db/User";
// Styles
import myStyles from "styles/Styles";

const InitialsInput = (props) => {
  /***********************************************************************************/
  // States
  const [getInitialsEntered, setInitialsEntered] = useState(""); // "" by default.
  const [getButtonHideStatus, setButtonHideStatus] = useState({}); //The button that will show "Continue" when initials are completely filled out. Otherwise hide it.

  /***********************************************************************************/
  // Functional components
  const initialsInputHandler = (userInput) => {
    setButtonHideStatus(userInput.length >= 2 ? true : false);
    if (userInput.length >= 3) {
      return;
    }
    setInitialsEntered(userInput.toUpperCase().replace(/[^a-zA-Z ]/g, "")); //Turn it to upper case then only accept A-z
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
    <View style={myStyles.frame}>
      <TextInput
        underlineColorAndroid="transparent"
        placeholder="Leave blank to remain anonymous"
        // selectionColor={"#428AF8"}
        placeholderTextColor="#464950"
        style={myStyles.input}
        onChangeText={initialsInputHandler} //For every key strokes, this will invoke initialsInputHandler.
        value={getInitialsEntered}
      />

      <View>
        <TouchableOpacity
          style={myStyles.nextBtnV2}
          onPress={() => onNextHandler(getInitialsEntered)}
        >
          <Text style={myStyles.buttonText}>{"NEXT"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InitialsInput;
