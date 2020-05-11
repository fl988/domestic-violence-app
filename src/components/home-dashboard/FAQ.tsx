/* *************************************** */
// Import Modules
import React, { Component } from "react";
import { Container, Header, Content, Left, Right, Body } from "native-base";
import { DrawerActions } from "@react-navigation/native";
import {
  NavigationState,
  NavigationParams,
  NavigationScreenProp,
} from "react-navigation"; //React Navigation with TypeScript => https://dev.to/andreasbergqvist/react-navigation-with-typescript-29ka
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from "react-native";
import Accordion from "@dooboo-ui/native-accordion";
import { Icon } from "react-native-elements";

/* *************************************** */
// Import Custom Components
import styles2 from "styles/Styles";
import { IC_ARR_DOWN, IC_ARR_UP } from "images/Images";

/* *************************************** */
// Interface
interface IProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface IState {
  isOpen: boolean;
}

class FAQ extends Component<IProps> {
  state = {
    isOpen: false,
    contents: [
      {
        title: "Question 1",
        body:
          "What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text?",
      },
      {
        title: "Question 2",
        body:
          "What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text?",
      },
      {
        title: "Question 3",
        body:
          "What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text?",
      },
      {
        title: "Question 4",
        body:
          "What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text?",
      },
      {
        title: "Question 5",
        body:
          "What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text?",
      },
      {
        title: "Question 6",
        body:
          "What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text?",
      },
      {
        title: "Question 7",
        body:
          "What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text? What about very long text?",
      },
    ],
  };

  accordionHandler = (v: boolean) => {
    console.log(v);
    // this.setState({
    //   isOpen: v,
    // });
  };

  render() {
    return (
      <Container style={styles2.bgPurple1}>
        <Header style={styles2.bgPurple1}>
          <Left style={{ flex: 1 }}>
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
          }}
        >
          <View style={styles.container}>
            <ScrollView>
              {this.state.contents
                ? this.state.contents.map((param, i) => {
                    return (
                      <Accordion
                        key={i}
                        // style={{
                        //   backgroundColor: i % 2 == 0 ? "pink" : "purple",
                        // }}
                        contentVisible={false}
                        visibleElement={<Image source={IC_ARR_UP} />}
                        invisibleElement={
                          <Image source={IC_ARR_DOWN} />
                          //   <Icon
                          //     name="chevron-down"
                          //     type="font-awesome"
                          //     color="white"
                          //     style={{
                          //       backgroundColor: "blue",
                          //       alignSelf: "center",
                          //     }}
                          //   />
                        }
                        header={
                          <Text
                            style={{
                              fontSize: 20,
                              color: "white",
                              height: 40,
                              fontWeight: "bold",
                              //   backgroundColor: "red",
                            }}
                          >
                            {param.title}
                          </Text>
                        }
                      >
                        <Text style={{ fontSize: 16, color: "white" }}>
                          {param.body}
                        </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101726",
  },
  header: {
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
    alignContent: "center",
  },
  headerTxt: {
    fontSize: 12,
    color: "rgb(74,74,74)",
    marginRight: 60,
    flexWrap: "wrap",
  },
});

export default FAQ;
