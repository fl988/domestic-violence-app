/* *************************************** */
// Import Modules
import React, { Component, ReactFragment } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Container, Content, Left, Body } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "react-native-elements";
// import { DrawerActions } from "@react-navigation/native";
/* *************************************** */
// Import Custom Components
import * as Constants from "constants/Constants";
import styles from "styles/Styles";
import db from "db/User";
import CircularProgress from "components/home-dashboard/learning-modules/CircularProgress";
import CustomModal from "components/user-setup/CustomModal";

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
  navigation: any;
}

interface IState {
  modalVisible: boolean;
  pages: enumJsonArr;
  refreshing: boolean;
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
      refreshing: false,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.reRenderComponentWhenBack();
    });
    this.init();
  }

  componentWillUnmount() {
    this.props.navigation.removeListener("focus");
  }

  async init() {
    let rsLM = await db.grabAllLearningModulesData(); //prettier-ignore
    if (rsLM != null && rsLM.rows.length > 0) {
      let pagesObjArr = [];
      for (let x = 0; x < rsLM.rows.length; x++) {
        let item: any = rsLM.rows.item(x);

        let progress = await db.grabLearningModuleProgress(item.learningModuleId); //prettier-ignore
        if (!item.finished && progress == 100) {
          progress = parseFloat((progress - progress / (rsLM.rows.length + 1)).toFixed(0)); //prettier-ignore
        }

        pagesObjArr.push({
          progressGauge: <CircularProgress percent={progress} />,
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

  async fetchLeaningModules() {
    //fetch learning modules data
    let jsonData = await db.fetchLearningModulesData(); //fetch then save the data

    //save learning modules data
    await db.saveLearningModulesData(JSON.parse(jsonData));
    this.init();
  }

  reRenderComponentWhenBack = () => {
    this.setState({
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
    });
    this.init();
  };

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

  mainComponent = () => {
    let component: any = <ActivityIndicator></ActivityIndicator>;
    if (this.state.pages[0].learningModuleId != 0) {
      component = this.state.pages.map((page, x) => (
        <LinearGradient
          key={x}
          colors={Constants.LINEAR_GRADIENT_MAIN}
          style={styles.learningModulePageContainer2}
        >
          <View style={styles.learningModulePageContent2}>
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
                  <Text style={[styles.lmText, { fontWeight: "bold" }]}>
                    {page.moduleTitle}
                  </Text>
                  <Text style={styles.lmText}>{page.quizTopic}</Text>
                </Body>
              </TouchableOpacity>
            </Body>
          </View>
        </LinearGradient>
      ));
    }

    return component;
  };

  render() {
    return (
      <Container style={styles.bgPurple1}>
        <Content contentContainerStyle={styles.rneContent}>
          {/* *************************** */}
          {/* START */}

          {/* END */}
          {/* *************************** */}
          <SafeAreaView style={styles.container}>
            <ScrollView
              contentContainerStyle={styles.learningModulePageContainer}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => {
                    this.fetchLeaningModules();
                  }}
                />
              }
            >
              <View style={{ paddingTop: 10 }}>{/*SPACING*/}</View>
              {this.mainComponent()}
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
            </ScrollView>
          </SafeAreaView>
        </Content>
      </Container>
    );
  }
}
