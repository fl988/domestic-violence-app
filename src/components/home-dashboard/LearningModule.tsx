/* *************************************** */
// Import Modules
import React, { Component, ReactComponentElement, ReactFragment } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Container, Header, Content, Left, Right, Body } from "native-base";
import { Icon } from "react-native-elements";
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
import CustomModal from "components/user-setup/CustomModal";
import { PROFILE_PIC } from "images/Images";

/* *************************************** */
// Interface
interface enumJsonObj {
  progressGauge: ReactFragment;
  learningModuleId: number;
  moduleTitle: string;
  moduleSummary: string;
  quizTopic: string;
  moduleContent: string;
  locked: boolean;
}
interface enumJsonArr extends Array<enumJsonObj> {}

interface IProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface IState {
  modalVisible: boolean;
  pages: enumJsonArr;
}

export default class LearningModule extends Component<IProps, IState> {
  lockIcon = (
    <Icon
      name="lock"
      type="font-awesome"
      color={Constants.COLOUR_EBONY}
      reverse
      style={{
        backgroundColor: "blue",
        alignSelf: "center",
        justifyContent: "center",
      }}
    />
  );

  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false,
      pages: [
        {
          progressGauge: <></>,
          learningModuleId: 0,
          moduleTitle: "Title",
          moduleSummary: "Summary Title",
          quizTopic: "Topic",
          moduleContent: "Contents",
          locked: true,
        },
      ],
    };
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    let rsLM = await db.grabAllLearningModulesData(); //prettier-ignore
    if (rsLM != null && rsLM.rows.length > 0) {
      let pagesObjArr = [];
      for (let x = 0; x < rsLM.rows.length; x++) {
        let item: any = rsLM.rows.item(x);

        pagesObjArr.push({
          progressGauge: <CircularProgress percent={5} />, //TODO: Make this guage dynamic.
          learningModuleId: item.learningModuleId,
          moduleTitle: item.moduleTitle,
          moduleSummary: item.moduleSummary,
          quizTopic: item.quizTopic,
          moduleContent: item.moduleContent,
          locked: false,
        });
      }

      this.setState({
        pages: pagesObjArr,
      });
    }
  }

  someAction = () => {};

  modalVisibleHandler = (showModal: boolean) => {
    this.setState({
      modalVisible: showModal,
    });
  };

  moduleHandler = (pageItem: enumJsonObj) => {
    if (!pageItem.locked) {
      this.props.navigation.navigate(Constants.MODULE, {
        learningModuleId: pageItem.learningModuleId,
        moduleTitle: pageItem.moduleTitle,
        moduleSummary: pageItem.moduleSummary,
        quizTopic: pageItem.quizTopic,
        moduleContent: pageItem.moduleContent,
        locked: pageItem.locked,
      });
    }
  };

  render() {
    return (
      <Container style={styles.bgPurple1}>
        <Content contentContainerStyle={styles.rneContent}>
          {/* *************************** */}
          {/* START */}
          <View style={{ paddingTop: 10 }}>{/* Empty Space */}</View>
          {this.state.pages.map((page, x) => (
            <View key={x} style={styles.learningModuleItem}>
              <Left style={styles.learningModuleItemLeft}>
                {page.progressGauge}
              </Left>
              <Body style={styles.learningModuleItemBody}>
                <TouchableOpacity
                  style={styles.learningModuleItemBodyContents}
                  onPress={() => {
                    this.modalVisibleHandler(page.locked);
                    this.moduleHandler(page);
                  }}
                >
                  <Body>
                    <Text style={styles.lmText}>{page.moduleTitle}</Text>
                    <Text style={styles.lmText}>{page.quizTopic}</Text>
                  </Body>
                </TouchableOpacity>
              </Body>
            </View>
          ))}
          <CustomModal
            action={this.someAction}
            modalVisible={this.state.modalVisible}
            modalVisibleHandler={this.modalVisibleHandler}
            modalHeader={"Confirmation"}
            modalBody={
              "\n\n\nYou have not completed the previous module yet.\n\n\n\n\n"
            }
            styleVersion={2}
          />
          {/* END */}
          {/* *************************** */}
        </Content>
      </Container>
    );
  }
}
