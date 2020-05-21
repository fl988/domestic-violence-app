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

    // props.navigation.setParams({ name: "HELLO" });

    this.state = {
      learningModuleId: learningModuleId,
      moduleTitle: moduleTitle,
      moduleSummary: moduleSummary,
      quizTopic: quizTopic,
      moduleContent: moduleContent,
      locked: locked,
    };
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    let rs = await db.grabLearningModuleQuestionsById(this.state.learningModuleId); //prettier-ignore
    if (rs != null && rs.rows.length > 0) {
      let pagesObjArr = [];
      for (let x = 0; x < rs.rows.length; x++) {
        let item: any = rs.rows.item(x);

        // pagesObjArr.push({
        //   progressGauge: <CircularProgress percent={5} />, //TODO: Make this guage dynamic.
        //   moduleTitle: item.moduleTitle,
        //   learningModuleId: item.learningModuleId,
        //   quizTopic: item.quizTopic,
        //   locked: false,
        // });
      }

      // this.setState({
      //   pages: pagesObjArr,
      // });
    }
  }

  // moduleHandler = (pageItem: enumJsonObj) => {
  quizHandler = () => {
    // console.log("NAVIGATING");
    this.props.navigation.navigate(Constants.QUIZZES);
    // this.props.navigation.navigate(Constants.QUIZZES, {
    //   TODO1: 1,
    //   TODO2: "",
    //   TODO3: "",
    //   TODO4: "",
    //   TODO5: "",
    //   TODO6: false,
    // });
  };

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
              <Text style={styles.learningModulePageHeader}>
                {this.state.moduleSummary}
              </Text>
              <Body>
                <ScrollView>
                  <Text style={styles.learningModulePageBody}>
                    {/* {this.state.moduleContent} */}
                    {
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
                    }
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
