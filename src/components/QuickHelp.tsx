import React, { Component } from "react";
import { Icon } from "react-native-elements";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import * as Constants from "constants/Constants";

const PAGE_HEIGHT = Dimensions.get("window").height;
const PAGE_WIDTH = Dimensions.get("window").width;

import {
  NavigationState,
  NavigationParams,
  NavigationScreenProp,
} from "react-navigation"; //React Navigation with TypeScript => https://dev.to/andreasbergqvist/react-navigation-with-typescript-29ka

interface IProps {
  redoTutorial?: Function;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface IState {
  modalVisible: boolean;
}
export default class QuickHelp extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  modalVisibleHandler = (v) => {
    this.setState({
      modalVisible: v,
    });
  };

  modalHeader = (
    <>
      <View style={styles.modalHeader1}>
        <TouchableOpacity
          style={styles.modalCancel}
          onPress={() => {
            this.modalVisibleHandler(!this.state.modalVisible);
          }}
        >
          <Icon name="times" type="font-awesome" color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.modalHeader2}>
        <Text style={styles.modalHeaderTitle}>{"Quick Help"}</Text>
      </View>
    </>
  );

  modalBody = (
    <View style={styles.modalBody}>
      <Text style={styles.bodyText}>
        {
          "Quick Help is where the users can ask help for tutorials for the app, call 000 for emergency and go to help services for any support. \n\nUsers can also find a link to the online dictionary website so they can search about words that they don't know about."
        }
      </Text>
    </View>
  );

  modalFooter = (
    <View>
      <View style={{ flexDirection: "column" }}>
        <TouchableOpacity style={[styles.action1, {}]}>
          <Text
            style={styles.element1}
            onPress={() => this.props.redoTutorial()}
          >
            I need help with the app
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action2}>
          <Text
            style={styles.element2}
            onPress={() => Linking.openURL("tel://000")}
          >
            I have an emergency
          </Text>
          <Icon
            reverse
            size={10}
            color="red"
            name="exclamation"
            type="font-awesome"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.action3}>
          <Text
            style={styles.element1}
            onPress={() => Linking.openURL("https://www.beyondblue.org.au/")}
          >
            I am experiencing homelessness
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action3}>
          <Text
            style={styles.element1}
            onPress={() => Linking.openURL("https://www.wordreference.com/")}
          >
            Online Dictionary
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action3}>
          <Text
            style={styles.element1}
            onPress={() =>
              this.props.navigation.navigate(Constants.HOME_SCREEN_SUPPORT) ||
              this.modalVisibleHandler(!this.state.modalVisible)
            }
          >
            Go to Support Page
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  modalContainer = (
    <View style={styles.modalContainer}>
      {this.modalHeader}
      {this.modalBody}
      {this.modalFooter}
    </View>
  );

  Modal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.modalVisibleHandler(!this.state.modalVisible);
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.modalVisibleHandler(!this.state.modalVisible);
          }}
          style={styles.modalBackdrop}
        >
          <View style={styles.modal}>
            <View>{this.modalContainer}</View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  render() {
    return (
      <View style={styles.navBackButton}>
        <View>{this.Modal()}</View>
        <Icon
          reverse
          size={15}
          color="darkgray"
          name="question"
          type="font-awesome"
          onPress={() => {
            this.modalVisibleHandler(true);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //modal from support
  navBackButton: {
    paddingRight: 10,
    paddingBottom: 10,
    width: PAGE_WIDTH,
    position: "absolute",
    flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "space-between",
  },
  modalBackdrop: {
    height: PAGE_HEIGHT,
    width: PAGE_WIDTH,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeader1: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalHeader2: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalCancel: {
    paddingRight: 12,
    paddingTop: 10,
  },
  modalHeaderTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "red",
    textAlign: "center",
    alignSelf: "center",
  },
  modal: {
    backgroundColor: "#00000099",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#101726",
    width: "80%",
    borderRadius: 10,
  },
  modalBody: {
    backgroundColor: "#101726",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  bodyText: {
    color: "#fff",
    marginVertical: 10,
  },
  action1: {
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 10,
    marginBottom: 15,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    borderColor: "white",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    alignItems: "center",
  },
  action2: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 20,
    marginTop: -15,
    flexDirection: "row",
    justifyContent: "center",
    borderColor: "white",
    borderBottomWidth: 1,
    alignItems: "center",
  },
  action3: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    marginTop: -10,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    borderColor: "white",
    borderBottomWidth: 1,
    alignItems: "center",
  },
  element1: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  element2: {
    fontSize: 15,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
});

AppRegistry.registerComponent("Myproject", () => QuickHelp);
