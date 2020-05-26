import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import * as Constants from "constants/Constants";
// Database
import db from "db/User";
// Styles
import styles from "styles/Styles";
import CustomModal from "components/user-setup/CustomModal";
import CustomTextInput from "components/user-setup/CustomTextInput";

const UserType = (props) => {
  /***********************************************************************************/
  // States
  const [modalVisible, setModalVisible] = useState(false); //State for our modal
  const [getUserDetails, setUserDetails] = useState(""); //State for our user detail display inside the modal body

  /***********************************************************************************/
  // Functional components
  const modalVisibleHandler = (v: boolean) => {
    setModalVisible(v);
  };

  const userTypeHandler = (v: number) => {
    db.updateUserType(v);
    props.onNext();
    readUserDetails();
  };

  async function readUserDetails() {
    let rs = await db.grabUserDetails();
    if (rs != null) {
      let item = rs.rows.item(0);
      setUserDetails(
        "Initials: " +
          item.initials +
          "\n\nDOB: " +
          item.dob +
          "\n\nType of User: " +
          Constants.userTypeDescArr[item.userTypeId - 1]
      );
    }
  }

  return (
    <View style={styles.frame}>
      {/***********************************************************************************************/}
      {/* JUST LEARNING BUTTON */}

      <CustomTextInput
        editable={false}
        onPress={() => userTypeHandler(Constants.USER_TYPE_LEARNING)}
        leftIcon={"graduation-cap"}
        leftIconType={"font-awesome"} //the type of the icon you're using.
        leftIconColor={"white"} //you can put simple color words or hex or rgb.
        textInputPlaceholder={"Just Learning"}
        textInputPlaceholderColor={"white"}
        disableRightComponent={true}
        value={null}
      />

      {/***********************************************************************************************/}
      {/* PARENT / GUARDIAN BUTTON */}
      <CustomTextInput
        editable={false}
        onPress={() => userTypeHandler(Constants.USER_TYPE_PARENT_GUARDIAN)}
        leftIcon={"users"}
        leftIconType={"font-awesome"} //the type of the icon you're using.
        leftIconColor={"white"} //you can put simple color words or hex or rgb.
        textInputPlaceholder={"A Parent / Guardian"}
        textInputPlaceholderColor={"white"}
        disableRightComponent={true}
        value={null}
      />

      {/***********************************************************************************************/}
      {/* AVO HOLDER BUTTON */}
      <CustomTextInput
        editable={false}
        onPress={() => userTypeHandler(Constants.USER_TYPE_AVO_HOLDER)}
        leftIcon={"balance-scale"}
        leftIconType={"font-awesome"} //the type of the icon you're using.
        leftIconColor={"white"} //you can put simple color words or hex or rgb.
        textInputPlaceholder={"An AVO Holder"}
        textInputPlaceholderColor={"white"}
        disableRightComponent={true}
        value={null}
      />
    </View>
  );
};

export default UserType;
