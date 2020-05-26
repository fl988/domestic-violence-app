/* *************************************** */
// Import Modules
import React, { Component, FunctionComponent, ReactFragment } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Container, Content, Left, Body } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";

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
import CustomTextInput from "components/user-setup/CustomTextInput";
import CustomModal from "components/user-setup/CustomModal";

/* *************************************** */
// Interface
interface questionJSONStructure {
  userAnswerCorrect: boolean;
  finished: boolean;
  questionNumber: number;
  learningModuleId: number;
  questionId: number;
  qType: number;
  question: string;
  formHorizontal: boolean;
  radio_props: any;
}
interface questionJSONArray extends Array<questionJSONStructure> {}

interface IProps {
  route: NavigationRoute;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface IState {
  modalVisible: boolean;
  learningModuleId: number;
  completeQuizComponent: ReactFragment;
  resetQuizComponent: ReactFragment;
  pages: questionJSONArray;
  mainComponent: ReactFragment;
}

export default class Quiz extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const { learningModuleId } = props.route.params;
    this.state = {
      modalVisible: false,
      learningModuleId: learningModuleId,
      completeQuizComponent: <></>,
      resetQuizComponent: <></>,
      pages: null,
      mainComponent: <ActivityIndicator></ActivityIndicator>,
    };
  }

  componentDidMount() {
    this.init();
  }

  //************************************************************************************************************************
  // Functions
  async init() {
    let rsLM = await db.grabLearningModuleById(this.state.learningModuleId);
    let finished = rsLM.rows.item(0).finished;
    this.setState({
      pages: await db.grabLearningModuleQuestionItemsAsArray(this.state.learningModuleId, finished) //prettier-ignore
    });

    await this.buttonEventHandlers(finished);
    this.reRenderComponent();
  }

  buttonEventHandlers = async (finished: boolean) => {
    let isAllQuestionsAnswered = await db.checkIfAllQuestionsAreAnswered(this.state.learningModuleId); //prettier-ignore
    if (isAllQuestionsAnswered) {
      let rsUP = await db.grabUserPerformance(this.state.learningModuleId); //prettier-ignore
      let moduleCompleteMessage = <></>;
      if (rsUP.rows.length > 0) {
        let i = rsUP.rows.item(0);
        moduleCompleteMessage = (
          <View style={styles.sectionStyle}>
            <Text style={styles.textFormatCentre}>
              {"Quiz is finished.\nYou got "}
              <Text style={{ fontWeight: "bold" }}>{i.userScoreNume}</Text>
              <Text>{" out of "}</Text>
              <Text style={{ fontWeight: "bold" }}>{i.userScoreDeno}</Text>
            </Text>
          </View>
        );
      }
      this.setState({
        completeQuizComponent: finished ? (
          moduleCompleteMessage
        ) : (
          <CustomTextInput
            onPress={() => {
              this.completeQuizHandler(this.state.learningModuleId);
            }}
            colors={[
              Constants.COLOUR_EBONY,
              Constants.COLOUR_EBONY,
              Constants.COLOUR_EBONY,
            ]}
            value={null}
            editable={false}
            rightIcon={"check"}
            rightIconColor={"white"} //you can put simple color words or hex or rgb.
            rightIconType={"font-awesome"} //the type of the icon you're using.
            textInputPlaceholder={"Complete Quiz"}
            textInputPlaceholderColor={"white"}
          />
        ),
        resetQuizComponent: (
          <CustomTextInput
            editable={false}
            onPress={() => {
              this.modalVisibleHandler(true);
            }}
            colors={[
              Constants.COLOUR_WHITE,
              Constants.COLOUR_WHITE,
              Constants.COLOUR_WHITE,
            ]}
            rightIcon={"refresh"}
            rightIconType={"font-awesome"} //the type of the icon you're using.
            rightIconColor={"#101726"} //you can put simple color words or hex or rgb.
            textInputPlaceholder={"Reset Quiz"}
            textInputPlaceholderColor={"#101726"}
            value={null}
          />
        ),
      });
    } else {
      let rsUA = await db.grabUserAnswerByLeaningModuleId(this.state.learningModuleId); //prettier-ignore
      if (rsUA.rows.length > 0) {
        this.setState({
          resetQuizComponent: (
            <CustomTextInput
              editable={false}
              onPress={() => {
                this.modalVisibleHandler(true);
              }}
              colors={[
                Constants.COLOUR_WHITE,
                Constants.COLOUR_WHITE,
                Constants.COLOUR_WHITE,
              ]}
              rightIcon={"refresh"}
              rightIconType={"font-awesome"} //the type of the icon you're using.
              rightIconColor={"#101726"} //you can put simple color words or hex or rgb.
              textInputPlaceholder={"Reset Quiz"}
              textInputPlaceholderColor={"#101726"}
              value={null}
            />
          ),
        });
      }
    }
  };

  reRenderComponent = () => {
    let component = this.state.pages.map((page, x) => (
      <LinearGradient
        key={x}
        colors={Constants.LINEAR_GRADIENT_MAIN}
        style={styles.quizzesPageContent}
      >
        <Left style={{ alignSelf: "stretch" }}>
          <Text style={styles.quizzesPageHeader}>
            {"Question " + (x + 1) + "\n\n" + page.question}
          </Text>
          <Body
            style={{
              alignSelf: "stretch",
              borderTopColor: "black",
              borderTopWidth: 1,
            }}
          >
            <ScrollView>
              <View style={[styles.quizzesPageBody]}>
                {/* <RadioForm
                      initial={-1}
                      radio_props={page.radio_props}
                      formHorizontal={page.formHorizontal}
                      onPress={(v, i) => {
                        this.answerHandler(
                          v,
                          i,
                          page.learningModuleId,
                          page.questionId,
                          page.qType
                        );
                      }}
                      buttonColor={"#fff"}
                      buttonSize={15}
                      labelStyle={{ fontSize: 18, color: "#fff" }}
                    /> */}

                <RadioForm
                  formHorizontal={page.formHorizontal}
                  animation={true}
                >
                  {/* To create radio buttons, loop through your array of options */}
                  {page.radio_props.map((obj, i) => (
                    <RadioButton labelHorizontal={true} key={i}>
                      {/*  You can set RadioButtonLabel before RadioButtonInput */}
                      <RadioButtonInput
                        obj={obj}
                        index={i}
                        isSelected={page.questionNumber === i}
                        onPress={
                          page.finished
                            ? () => {}
                            : (v, i) => {
                                this.answerHandler(
                                  v,
                                  i,
                                  page.learningModuleId,
                                  page.questionId,
                                  page.qType,
                                  page.finished,
                                  page.userAnswerCorrect
                                );
                              }
                        }
                        borderWidth={3}
                        buttonInnerColor={
                          page.questionNumber === i
                            ? page.finished
                              ? page.userAnswerCorrect
                                ? Constants.COLOUR_FERN
                                : Constants.COLOUR_JELLY_BEAN
                              : Constants.COLOUR_DODGER_BLUE
                            : Constants.COLOUR_WHITE
                        }
                        buttonOuterColor={
                          page.questionNumber === i
                            ? page.finished
                              ? page.userAnswerCorrect
                                ? Constants.COLOUR_FERN
                                : Constants.COLOUR_JELLY_BEAN
                              : Constants.COLOUR_DODGER_BLUE
                            : Constants.COLOUR_WHITE
                        }
                        buttonSize={15}
                        buttonOuterSize={25}
                        buttonWrapStyle={{ marginLeft: 10 }}
                      />
                      <RadioButtonLabel
                        obj={obj}
                        index={i}
                        labelHorizontal={true}
                        onPress={
                          page.finished
                            ? () => {}
                            : (v, i) => {
                                this.answerHandler(
                                  v,
                                  i,
                                  page.learningModuleId,
                                  page.questionId,
                                  page.qType,
                                  page.finished,
                                  page.userAnswerCorrect
                                );
                              }
                        }
                        labelStyle={{
                          fontSize: 20,
                          color: Constants.COLOUR_WHITE,
                        }}
                      />
                    </RadioButton>
                  ))}
                </RadioForm>
              </View>
            </ScrollView>
          </Body>
        </Left>
      </LinearGradient>
    ));

    this.setState({
      mainComponent: [
        component,
        <LinearGradient
          key={-1}
          colors={Constants.LINEAR_GRADIENT_MAIN}
          style={styles.quizzesPageContent}
        >
          {this.state.completeQuizComponent}
          {this.state.resetQuizComponent}
        </LinearGradient>,
      ],
    });
  };

  modalVisibleHandler = (v) => {
    this.setState({
      modalVisible: v,
    });
  };

  answerHandler = async (
    value: any,
    index: number,
    lmId: number,
    aId: number,
    qType: number,
    test1: any,
    test2: any
  ) => {
    //we save the user's answers for each question answered.
    let res = await db.updateUserAnswer( value, lmId, aId, qType, index ); //prettier-ignore
    if (!res) {
      return;
    }
    this.init();
  };

  completeQuizHandler = async (lmId: number) => {
    let rsUserAnswer = await db.markingQuizScoreProcess(lmId, true);
    if (true) {
      this.setState({
        completeQuizComponent: <></>,
        resetQuizComponent: <></>,
        mainComponent: <ActivityIndicator></ActivityIndicator>,
      });
      this.init();
    }
  };

  resetQuizHandler = async (lmId: number) => {
    let isResetQuiz = await db.deleteUserAnswerById(lmId);
    let resetModule = await db.updateLearningModuleCompletion(false, lmId);
    if (isResetQuiz) {
      this.setState({
        completeQuizComponent: <></>,
        resetQuizComponent: <></>,
        mainComponent: <ActivityIndicator></ActivityIndicator>,
      });
      this.init();
    }
  };

  //************************************************************************************************************************
  render() {
    return (
      <Container style={styles.bgPurple1}>
        <Content contentContainerStyle={styles.learningModulePageContainer}>
          <ScrollView contentContainerStyle={styles.quizzesPageContainer}>
            {this.state.mainComponent}
            <CustomModal
              modalVisible={this.state.modalVisible}
              modalVisibleHandler={this.modalVisibleHandler}
              action={() => {
                this.resetQuizHandler(this.state.learningModuleId);
              }}
              modalHeader={"Confirmation"}
              modalBody={"Are you sure you want to reset this quiz?"}
            />
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
