/* *************************************** */
// Import Modules
import React, { Component } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { Container, Header, Content, Left, Right, Body } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, Button } from "react-native-elements";
import CustomTextInput from "components/user-setup/CustomTextInput";

// import { DrawerActions } from "@react-navigation/native";
import {
  NavigationState,
  NavigationParams,
  NavigationScreenProp,
  NavigationRoute,
} from "react-navigation"; //React Navigation with TypeScript => https://dev.to/andreasbergqvist/react-navigation-with-typescript-29ka

/* *************************************** */
// Import Custom Components
import * as Constants from "constants/Constants";
import styles from "styles/Styles";
import db from "db/User";

/* *************************************** */
// Interface
interface IProps {
  route: NavigationRoute;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface IState {}

export default class Quiz extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    //this.init();
  }

  async init() {}

  render() {
    return (
      <Container style={styles.bgPurple1}>
        <Content contentContainerStyle={styles.learningModulePageContainer}>
          {/* *************************** */}
          {/* START */}
          <View style={{ paddingTop: 10 }}>{/* Empty Space */}</View>
          <LinearGradient
            colors={["#522154", "#5f1f4a", "#721937"]}
            style={[styles.learningModulePageContent]}
          >
            <Left>
              {/* <Text style={styles.learningModulePageHeader}>
                {this.state.moduleSummary}
              </Text> */}
              <Body>
                <ScrollView>
                  {/* <Text style={styles.learningModulePageBody}> */}
                  {/* {this.state.moduleContent} */}
                  {/* {
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
                    } */}
                  {/* </Text> */}
                  {/* <CustomTextInput
                    editable={false}
                    // onPress={() => userTypeHandler(Constants.USER_TYPE_LEARNING)}
                    colors={["#101726", "#101726", "#101726"]}
                    rightIcon={"arrow-right"}
                    rightIconType={"font-awesome"} //the type of the icon you're using.
                    rightIconColor={"white"} //you can put simple color words or hex or rgb.
                    textInputPlaceholder={"Proceed to Quizzes"}
                    textInputPlaceholderColor={"white"}
                    value={null}
                  /> */}
                </ScrollView>
              </Body>
            </Left>
          </LinearGradient>
        </Content>
      </Container>
    );
  }
}
