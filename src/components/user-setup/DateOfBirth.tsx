import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";
import * as Constants from "constants/Constants";

import db from "db/User";
import styles from "styles/Styles";

import CustomTextInput from "components/user-setup/CustomTextInput";

const DateOfBirth = (props) => {
  /***********************************************************************************/
  // States
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [getDateDisplay, setDateDisplay] = useState("");
  const [getButtonHideStatus, setButtonHideStatus] = useState(false);
  const [getIconStatus, setIconStatus] = useState(<></>);

  React.useEffect(() => {
    dobHandler();
  }, []);

  const dobHandler = async () => {
    let rs = await db.grabUserDetails();
    if (rs != null && rs.rows.length > 0) {
      setDateDisplay(rs.rows.item(0).dob);
    }
  };

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
    const formattedDate = mdate[2] + " - " + mdate[1] + " - " + mdate[3];
    setDateDisplay(formattedDate);
    setButtonHideStatus(true);

    if (props.isSettingsPage) {
      setIconStatus(<ActivityIndicator />);
      autoUpdateInitials(formattedDate);
      setTimeout(() => {
        setIconStatus(
          <Icon
            style={{ alignSelf: "flex-end" }}
            name="check-circle"
            type="font-awesome"
            color="green"
          />
        );
      }, 1000); //We set it to 1.50 seconds
    }
  };

  const autoUpdateInitials = (formattedDate: string) => {
    db.updateUserDOB(formattedDate);
  };

  const onNextHandler = (formattedDate: string) => {
    props.onNext(); //Swipe to next page.
    db.updateUserDOB(formattedDate);
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
    <>
      {props.isSettingsPage && (
        <View style={localStyle.updateButtonContainer}>
          <Text style={localStyle.updateButtonHeader}>
            {"Change your date of birth"}
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

        {!props.isSettingsPage && <View>{nextBtn}</View>}

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          mode="date"
        />
      </View>
    </>
  );
};

export default DateOfBirth;
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
