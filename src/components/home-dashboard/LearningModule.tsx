/* *************************************** */
// Import Modules
import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Container, Header, Content, Left, Right, Body } from "native-base";
// import { Icon } from "react-native-elements";
// import { DrawerActions } from "@react-navigation/native";
import {
  NavigationState,
  NavigationParams,
  NavigationScreenProp,
} from "react-navigation"; //React Navigation with TypeScript => https://dev.to/andreasbergqvist/react-navigation-with-typescript-29ka

/* *************************************** */
// Import Custom Components
import * as Constants from "constants/Constants";
import styles from "styles/Styles";
import db from "db/User";
import CircularProgress from "components/home-dashboard/CircularProgress";
import { PROFILE_PIC } from "images/Images";

/* *************************************** */
// Interface
interface IProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface IState {}

export default class LearningModule extends Component<IProps, IState> {
  static navigationOptions = {
    drawerIcon: (
      <Image source={PROFILE_PIC} style={{ height: 50, width: 50 }} />
    ),
  };

  componentDidMount() {
    this.init();
  }

  async init() {
    //let learningModulesAsList = await db.checkForLearningModules(Constants.PENTECH_LEARNING_MODULES.m1); //prettier-ignore
  }

  rand = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  PAGES = [
    {
      progressGauge: <CircularProgress percent={100} />,
      title: "Module",
    },
    {
      progressGauge: <CircularProgress percent={90} />,
      title: "Module",
    },
    {
      progressGauge: <CircularProgress percent={80} />,
      title: "Module",
    },
    {
      progressGauge: <CircularProgress percent={70} />,
      title: "Module",
    },
  ];

  render() {
    return (
      <Container style={styles.bgPurple1}>
        <Content contentContainerStyle={styles.rneContent}>
          {/* *************************** */}
          {/* START */}
          <View style={{ paddingTop: 10 }}>{/* Empty Space */}</View>
          {this.PAGES.map((page, x) => (
            <View key={x} style={styles.learningModuleItem}>
              <Left style={styles.learningModuleItemLeft}>
                {page.progressGauge}
              </Left>
              <Body style={styles.learningModuleItemBody}>
                <TouchableOpacity style={styles.learningModuleItemBodyContents}>
                  <Body>
                    <Text style={styles.lmText}>
                      {page.title + " " + (x + 1)}
                    </Text>
                  </Body>
                </TouchableOpacity>
              </Body>
            </View>
          ))}
          {/* END */}
          {/* *************************** */}
        </Content>
      </Container>
    );
  }
}
