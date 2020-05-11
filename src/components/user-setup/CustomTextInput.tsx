import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { Icon } from "react-native-elements";
import { Left, Right, Body } from "native-base";
import { LinearGradient } from "expo-linear-gradient";

// Styles
import styles from "styles/Styles";

const CustomTextInput = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <LinearGradient
        colors={["#522154", "#5f1f4a", "#721937"]}
        style={styles.sectionStyle}
      >
        <Left style={{ flex: 1, alignItems: "center" }}>
          <Icon
            name={props.leftIcon}
            type={props.leftIconType}
            color={props.leftIconColor}
          />
        </Left>
        <Body style={{ flex: 2, alignItems: "flex-start" }}>
          <TextInput
            style={{ paddingLeft: 5, textAlign: "center", color: "#fff" }}
            placeholder={props.textInputPlaceholder}
            placeholderTextColor={props.textInputPlaceholderColor}
            editable={props.editable}
            value={props.value}
          />
        </Body>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomTextInput;
