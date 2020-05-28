import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import db from "db/User";
import styles from "styles/Styles";

import CustomTextInput from "components/user-setup/CustomTextInput";

const DateOfBirth = (props) => {
  /***********************************************************************************/
  // States
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [getDateDisplay, setDateDisplay] = useState("");
  const [getButtonHideStatus, setButtonHideStatus] = useState(false);

  /***********************************************************************************/
  // Functional components
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    //console.warn("A date has been picked: ", date);
    hideDatePicker();

    //Wed, Mar, 04, 2020, 02:45:57, GMT-0500, (EST)
    const mdate = date.toString().split(" ");
    setDateDisplay(mdate[2] + " - " + mdate[1] + " - " + mdate[3]);
    setButtonHideStatus(true);
  };

  const onNextHandler = (dateDisplay) => {
    props.onNext(); //Swipe to next page.
    db.updateUserDOB(getDateDisplay);
  };

  /***********************************************************************************/
  // The "Next" button shows once the user successfully entered their DOB.
  var nextBtn = (
    <TouchableOpacity style={styles.nextBtn}>
      <Text style={styles.buttonText}></Text>
    </TouchableOpacity>
  );
  if (getButtonHideStatus) {
    nextBtn = (
      <TouchableOpacity
        style={styles.nextBtnV2}
        onPress={() => onNextHandler(getDateDisplay)}
      >
        <Text style={styles.buttonText}>{"NEXT"}</Text>
      </TouchableOpacity>
    );
  }

  /***********************************************************************************/
  // The returning component
  return (
    <View>
      <View style={styles.innerFrame}>
        <CustomTextInput
          editable={false}
          onPress={showDatePicker}
          leftIcon={"calendar"}
          leftIconType={"font-awesome"} //the type of the icon you're using.
          leftIconColor={"white"} //you can put simple color words or hex or rgb.
          textInputPlaceholder={"'Tap' to select DOB"}
          textInputPlaceholderColor={"#fff"}
          value={getDateDisplay.length > 0 ? getDateDisplay.toString() : null}
        />
        <View>{nextBtn}</View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          mode="date"
        />
      </View>
    </View>
  );
};

export default DateOfBirth;
