/* *************************************** */
// Import Modules
import React, { Component } from "react";
import { Text, Image } from "react-native";
import { Container, Header, Content, Left, Right, Body } from "native-base";
import { Icon } from "react-native-elements";
import { DrawerActions } from "@react-navigation/native";
import {
  NavigationState,
  NavigationParams,
  NavigationScreenProp,
} from "react-navigation"; //React Navigation with TypeScript => https://dev.to/andreasbergqvist/react-navigation-with-typescript-29kaimport styles from "styles/Styles";

/* *************************************** */
// Import Custom Components
import styles from "styles/Styles";
import { PROFILE_PIC } from "images/Images";

/* *************************************** */
// Interface
interface IProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface IState {}

class SettingsScreen extends Component<IProps, IState> {
  static navigationOptions = {
    drawerIcon: (
      <Image source={PROFILE_PIC} style={{ height: 50, width: 50 }} />
    ),
  };
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
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff" }}> Settings Screen </Text>
        </Content>
      </Container>
    );
  }
}

export default SettingsScreen;
