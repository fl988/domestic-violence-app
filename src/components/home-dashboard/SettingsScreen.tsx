/* *************************************** */
// Import Modules
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Container, Header, Content, Left, Right, Body } from "native-base";
import { Icon } from "react-native-elements";
import { DrawerActions } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import { LinearGradient } from "expo-linear-gradient";
import InitialsInput from "components/user-setup/InitialsInput";
/* *************************************** */
// Import Custom Components
import styles from "styles/Styles";
import * as Constants from "constants/Constants";

/* *************************************** */
// Interface
interface IProps {
  navigation: any;
}
interface IState {}

class SettingsScreen extends Component<IProps, IState> {
  render() {
    return (
      <Container style={styles.bgPurple1}>
        <Header style={styles.bgPurple1}>
          <Left style={{ flex: 1, paddingLeft: 10 }}>
            <Icon
              name="bars"
              type="font-awesome"
              color="white"
              onPress={() =>
                this.props.navigation.dispatch(DrawerActions.openDrawer())
              }
            />
          </Left>
          <Body style={{ flex: 1 }} />
          <Right style={{ flex: 1 }} />
        </Header>
        <Content
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 1, flexDirection: "column", paddingTop: 16 }}>
            <View style={{ marginHorizontal: 16 }}>
              <Text style={{ paddingBottom: 8, color: "#fff" }}>{"TEST"}</Text>
              <InitialsInput hideNextButton={true} />
            </View>
            <View style={{ marginHorizontal: 16 }}>
              <Text style={{ marginBottom: 8, color: "#fff" }}>{"TEST"}</Text>
              <LinearGradient
                colors={Constants.LINEAR_GRADIENT_MAIN}
                style={localStyle.linearGStyle}
              >
                <RNPickerSelect
                  onValueChange={(value) => console.log(value)}
                  items={[
                    { label: "Football", value: "football" },
                    { label: "Baseball", value: "baseball" },
                    { label: "Hockey", value: "hockey" },
                  ]}
                />
              </LinearGradient>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

export default SettingsScreen;

const localStyle = StyleSheet.create({
  linearGStyle: {
    flex: 1,
    borderRadius: 8,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Constants.COLOUR_EAST_BAY, //"rgba(255,255,255, 0.3)",
    marginHorizontal: 16,
  },
});
