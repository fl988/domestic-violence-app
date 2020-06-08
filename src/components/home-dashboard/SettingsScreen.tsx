/* *************************************** */
// Import Modules
import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Container, Header, Content, Left, Right, Body } from "native-base";
import { Icon, Text } from "react-native-elements";
import { DrawerActions } from "@react-navigation/native";
import { NavigationRoute } from "react-navigation";
const { width, height } = Dimensions.get("window");
/* *************************************** */
// Import Custom Components
import * as Constants from "constants/Constants";
import styles from "styles/Styles";
import db from "db/User";
import InitialsInput from "components/user-setup/InitialsInput";
import DateOfBirth from "components/user-setup/DateOfBirth";
import Conditions from "components/user-setup/Conditions";

import { debugPrintScript } from "db/SelectScripts";

/* *************************************** */
// Interface
interface IProps {
  navigation: any;
  route: NavigationRoute;
}
interface IState {}

class SettingsScreen extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

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
          <Body style={{ flex: 1 }}>
            <Text
              h4
              style={{ color: Constants.COLOUR_WHITE, alignSelf: "center" }}
            >
              {"Settings"}
            </Text>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        <Content contentContainerStyle={localStyle.container}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              paddingTop: 16,
              // height: height * 1.5,
            }}
          >
            {/* Initials */}
            <InitialsInput
              isSettingsPage={true}
              hideNextButton={true}
              refreshHomeScreen={
                this.props.route.params.refreshHomeScreenHandler
              }
            />
            <View style={localStyle.hrLine} />

            {/* DOB */}
            <DateOfBirth isSettingsPage={true} />
            <View style={localStyle.hrLine} />

            <Text style={localStyle.settingHeader}>
              {"Change your AVO conditions"}
            </Text>

            {/* AVO */}
            <View style={{ marginHorizontal: 16, paddingBottom: 16 }}>
              <Conditions useCustomStyle={true} />
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// TODO:
// FIX REFRESH FOR SETTINGS PAGE
// CREATE COURT DATES REMINDERS
// CLEAN THE CODE
// CREATE A DEPLOYMENT INSTRUCTIONS FOR SUBMISSION
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

export default SettingsScreen;

const localStyle = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  settingHeader: {
    paddingBottom: 16,
    marginHorizontal: 16,
    color: Constants.COLOUR_WHITE,
    paddingTop: 8,
    fontWeight: "bold",
    justifyContent: "center",
    fontSize: 18,
  },
  hrLine: {
    margin: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
});
