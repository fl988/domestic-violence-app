import React from "react";
import { TouchableOpacity, TextInput } from "react-native";
import { Icon } from "react-native-elements";
import { Left, Right, Body } from "native-base";
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
      <Body style={{ flex: 2, alignItems: "flex-start" }}>
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
      <>
        {leftIconComponent()}
        {bodyComponent()}
        {rightIconComponent()}
      </>
    );
    if (props.disableRightComponent) {
      final = (
        <>
          {leftIconComponent()}
          {bodyComponent()}
        </>
      );
    } else if (props.disableLeftComponent) {
      final = (
        <>
          {bodyComponent()}
          {rightIconComponent()}
        </>
      );
    }

    return (
      <LinearGradient
        colors={
          props.colors != null ? props.colors : Constants.LINEAR_GRADIENT_MAIN
        }
        style={styles.sectionStyle}
      >
        {final}
      </LinearGradient>
    );
  };

  return (
    <TouchableOpacity onPress={props.onPress}>
      {finalComponent()}
    </TouchableOpacity>
  );
};

export default CustomTextInput;
