/* *************************************** */
// Import Modules
import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import { Container, Header, Content, Left, Body } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "react-native-elements";
import CustomTextInput from "components/user-setup/CustomTextInput";

import {
  NavigationBackAction,
  NavigationState,
  NavigationParams,
  NavigationScreenProp,
  NavigationRoute,
} from "react-navigation"; //React Navigation with TypeScript => https://dev.to/andreasbergqvist/react-navigation-with-typescript-29ka

/* *************************************** */
// Import Custom Components
import * as Constants from "constants/Constants";
import styles from "styles/Styles";

/* *************************************** */
// Interface
interface IProps {
  route: NavigationRoute;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface IState {
  learningModuleId: number;
  moduleTitle: string;
  moduleSummary: string;
  quizTopic: string;
  moduleContent: string;
  locked: boolean;
}

export default class Module extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const {
      learningModuleId,
      moduleTitle,
      moduleSummary,
      quizTopic,
      moduleContent,
      locked,
    } = props.route.params;

    this.state = {
      learningModuleId: learningModuleId,
      moduleTitle: moduleTitle,
      moduleSummary: moduleSummary,
      quizTopic: quizTopic,
      moduleContent: moduleContent,
      locked: locked,
    };
  }

  quizHandler = async () => {
    this.props.navigation.navigate(Constants.QUIZZES, {
      learningModuleId: this.state.learningModuleId,
    });
  };

  render() {
    return (
      <Container style={styles.bgPurple1}>
        <Content contentContainerStyle={styles.learningModulePageContainer}>
          {/* *************************** */}
          {/* START */}
          <View style={{ paddingTop: 10 }}>{/* Empty Space */}</View>

          <LinearGradient
            colors={Constants.LINEAR_GRADIENT_MAIN}
            style={[styles.learningModulePageContent]}
          >
            <Left>
              <Text style={styles.learningModulePageHeader}>
                {this.state.moduleSummary}
              </Text>
              <Body>
                <ScrollView>
                  <Text style={styles.learningModulePageBody}>
                    {this.state.moduleContent}
                  </Text>
                  <CustomTextInput
                    editable={false}
                    onPress={() => this.quizHandler()}
                    colors={["#101726", "#101726", "#101726"]}
                    rightIcon={"arrow-right"}
                    rightIconType={"font-awesome"} //the type of the icon you're using.
                    rightIconColor={"white"} //you can put simple color words or hex or rgb.
                    textInputPlaceholder={"Proceed to Quizzes"}
                    textInputPlaceholderColor={"white"}
                    value={null}
                  />
                </ScrollView>
              </Body>
            </Left>
          </LinearGradient>
        </Content>
      </Container>
    );
  }
}
