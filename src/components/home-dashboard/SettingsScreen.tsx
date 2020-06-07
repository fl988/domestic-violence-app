/* *************************************** */
// Import Modules
import React, { Component } from "react";
import { Text, Image } from "react-native";
import { Container, Header, Content, Left, Right, Body } from "native-base";
import { Icon } from "react-native-elements";
import { DrawerActions } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";

/* *************************************** */
// Import Custom Components
import styles from "styles/Styles";

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
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RNPickerSelect
            onValueChange={(value) => console.log(value)}
            items={[
              { label: "Football", value: "football" },
              { label: "Baseball", value: "baseball" },
              { label: "Hockey", value: "hockey" },
            ]}
          />
        </Content>
      </Container>
    );
  }
}

export default SettingsScreen;
