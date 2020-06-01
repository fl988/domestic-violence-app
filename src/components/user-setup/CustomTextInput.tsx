import React from "react";
import { TouchableOpacity, TextInput } from "react-native";
import { Icon } from "react-native-elements";
import { View, Left, Right, Body } from "native-base";
import { LinearGradient } from "expo-linear-gradient";

// Styles
import styles from "styles/Styles";
import * as Constants from "constants/Constants";

const CustomTextInput = (props) => {
  const leftIconComponent = () => {
    let c = <Left />;
    if (props.leftIcon != null) {
      c = (
        <Left style={{ flex: 1, alignItems: "center" }}>
          <Icon
            name={props.leftIcon}
            type={props.leftIconType}
            color={props.leftIconColor}
          />
        </Left>
      );
    }
    return c;
  };
  const rightIconComponent = () => {
    let c = <Right />;
    if (props.rightIcon != null) {
      c = (
        <Right style={{ flex: 1, alignItems: "center" }}>
          <Icon
            name={props.rightIcon}
            type={props.rightIconType}
            color={props.rightIconColor}
          />
        </Right>
      );
    }
    return c;
  };
  const bodyComponent = () => {
    return (
      <Body
        style={{
          flex: 2,
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          style={{ textAlign: "center", color: "#fff" }}
          placeholder={props.textInputPlaceholder}
          placeholderTextColor={props.textInputPlaceholderColor}
          editable={props.editable}
          onChangeText={props.initialsInputHandler}
          value={props.value}
        />
      </Body>
    );
  };
  const finalComponent = () => {
    let final = (
      <View style={{ flex: 1, flexDirection: "row" }}>
        {leftIconComponent()}
        {bodyComponent()}
        {rightIconComponent()}
      </View>
    );
    if (props.disableRightComponent) {
      final = (
        <View style={{ flex: 1, flexDirection: "row" }}>
          {leftIconComponent()}
          {bodyComponent()}
        </View>
      );
    } else if (props.disableLeftComponent) {
      final = (
        <View style={{ flex: 1, flexDirection: "row" }}>
          {bodyComponent()}
          {rightIconComponent()}
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={props.onPress}>
        <LinearGradient
          colors={
            props.colors != null ? props.colors : Constants.LINEAR_GRADIENT_MAIN
          }
          style={{
            flexDirection: "row",
            margin: 15,
            height: 40,
            // borderColor: Constants.COLOUR_WHITE,
            borderRadius: 3,
            // backgroundColor: Constants.COLOUR_WHITE,
            // opacity: 0.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {final}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return finalComponent();
};

export default CustomTextInput;
