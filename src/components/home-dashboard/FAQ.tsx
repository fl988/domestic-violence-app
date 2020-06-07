/* *************************************** */
// Import Modules
import React, { Component, ReactFragment } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { Container, Header, Content, Left, Right, Body } from "native-base";
import { DrawerActions } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import Accordion from "@dooboo-ui/native-accordion";

/* *************************************** */
// Import Custom Components
import * as Constants from "constants/Constants";
import styles2 from "styles/Styles";
import { fetchFrequentlyAskedQuestionsAndSave } from "contentful-api/ContentfulData";
import { grabFrequentlyAskedQuestions } from "db/SelectScripts";

/* *************************************** */
// Interface
interface faqObjStructure {
  faqQuestion: string;
  faqAnswer: string;
}
interface IProps {
  navigation: any;
}
interface IState {
  faqItems: faqObjStructure[];
  isOpen: boolean;
  screenLoader: ReactFragment;
}

class FAQ extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      faqItems: [],
      isOpen: false,
      screenLoader: false,
    };
  }

  /* *************************************** */
  // Functions
  async componentDidMount() {
    this.screenLoader(true);
    // First we check if we have something on our table "frequentlyAskedQuestions".
    // If no such table, it'll throw an error and then handle it by creating a frequentlyAskedQuestions table.

    let rs: SQLResultSet = await grabFrequentlyAskedQuestions();
    if (rs == null) {
      // Since we just created a table, our program will come here straight after.
      //   We then start to fetch support links data then save it on our table 'supportLink'.
      await fetchFrequentlyAskedQuestionsAndSave();
      rs = await grabFrequentlyAskedQuestions();
      this.frequentlyAskedQuestionsHandler(rs);
    } else {
      // We have data on our table.
      this.frequentlyAskedQuestionsHandler(rs);
    }
    this.screenLoader(false);
  }

  frequentlyAskedQuestionsHandler = async (rs: SQLResultSet) => {
    let objArr: faqObjStructure[] = [];
    for (let x = 0; x < rs.rows.length; x++) {
      let i = rs.rows.item(x);
      objArr.push({
        faqQuestion: i.faqQuestion,
        faqAnswer: i.faqAnswer,
      });
    }
    this.setState({
      faqItems: objArr,
    });
  };

  screenLoader = (show: boolean) => {
    this.setState({
      screenLoader: show ? (
        <ActivityIndicator
          size="large"
          style={styles2.activityIndicatorOverlayCentre}
        />
      ) : (
        <></>
      ),
    });
  };

  /* *************************************** */
  // Render
  render() {
    return (
      <Container style={styles2.bgPurple1}>
        <Header style={styles2.bgPurple1}>
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
            alignItems: "stretch",
            alignContent: "center",
            paddingTop: 16,
          }}
        >
          <View>
            <ScrollView>
              {this.state.faqItems
                ? this.state.faqItems.map((item, i) => {
                    return (
                      <Accordion
                        key={i}
                        style={{
                          margin: 8,
                          borderRadius: 8,
                          backgroundColor: i % 2 == 0 ? "grey" : "darkgrey",
                        }}
                        contentVisible={false}
                        visibleElement={
                          <View style={styles.chevron}>
                            <Icon
                              name="chevron-up"
                              type="font-awesome"
                              color="white"
                            />
                          </View>
                        }
                        invisibleElement={
                          <View style={styles.chevron}>
                            <Icon
                              name="chevron-down"
                              type="font-awesome"
                              color="white"
                            />
                          </View>
                        }
                        header={
                          <Text style={styles.faqQuestion}>
                            {item.faqQuestion}
                          </Text>
                        }
                      >
                        <Text style={styles.faqAnswer}>{item.faqAnswer}</Text>
                      </Accordion>
                    );
                  })
                : null}
              <View />
            </ScrollView>
          </View>
        </Content>
      </Container>
    );
  }
}

/* *************************************** */
// block scope styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101726",
    position: "relative",
  },
  header: {
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  headerTxt: {
    fontSize: 12,
    color: "rgb(74,74,74)",
    marginRight: 60,
    flexWrap: "wrap",
  },
  chevron: {
    marginTop: 8,
    paddingRight: 16,
    position: "absolute",
    alignSelf: "flex-end",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  faqAnswer: {
    color: Constants.COLOUR_WHITE,
    fontSize: 18,
    lineHeight: 30,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqQuestion: {
    height: 50,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 10,
    color: Constants.COLOUR_WHITE,
    fontSize: 18,
    // backgroundColor: "red",
  },
});

export default FAQ;
