/* *************************************** */
// Import Modules
import React, { Component } from "react";
import { Container, Header, Content, Left, Right, Body } from "native-base";
import {
  AppRegistry,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Modal,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import { DrawerActions } from "@react-navigation/native";
import {
  NavigationState,
  NavigationParams,
  NavigationScreenProp,
} from "react-navigation"; //React Navigation with TypeScript => https://dev.to/andreasbergqvist/react-navigation-with-typescript-29kaimport { Container, Header, Content, Left, Right } from "native-base";
import { Icon } from "react-native-elements";

/* *************************************** */
// Import Custom Components
import styles2 from "styles/Styles";
import { BEYOND_BLUE, KIDS_HELP_LINE, LIFE_LINE } from "images/Images";

const { width, height } = Dimensions.get("window");
// const PAGE_HEIGHT = Dimensions.get("window").height;
// const PAGE_WIDTH = Dimensions.get("window").width;

/* *************************************** */
// Interface
interface IProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface IState {
  modalVisible?: boolean;
  modalVisible1?: boolean;
  modalVisible2?: boolean;
}

export default class Support extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { modalVisible: false };
  }

  // Beyond Blue
  modalVisibleHandler = (v) => {
    this.setState({
      modalVisible: v,
    });
  };

  modalHeader = (
    <View style={styles.modalHeader}>
      <TouchableOpacity
        style={{ ...styles.action1 }}
        onPress={() => {
          this.modalVisibleHandler(!this.state.modalVisible || false);
        }}
      >
        <Icon
          containerStyle={styles.closeIconStyle}
          name="times"
          type="font-awesome"
          color={"#fff"}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{"Beyond Blue"}</Text>
      <Text style={styles.number}>{"1300 22 4636"}</Text>
    </View>
  );

  modalBody = (
    <View style={styles.modalBody}>
      <Text style={styles.bodyText}>
        {
          "Beyond Blue is an Australian independent nonprofit organization working to address issues associated with depression, suicide, anxiety disorders and other related mental disorders."
        }
      </Text>
    </View>
  );

  modalFooter = (
    <View style={styles.modalFooter}>
      <View style={{ flexDirection: "row-reverse", margin: 10 }}>
        <TouchableOpacity style={{ ...styles.action2 }}>
          <Text
            style={styles.actionText2}
            onPress={() => Linking.openURL(`tel:${1300224636}`)}
          >
            Call now
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ ...styles.action2 }}>
          <Text
            style={styles.actionText2}
            onPress={() => Linking.openURL("https://www.beyondblue.org.au/")}
          >
            Go to Website
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
        transparent={true}
        visible={this.state.modalVisible || false}
        // onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
        // }}
      >
        <TouchableOpacity
          onPress={() => {
            this.modalVisibleHandler(!this.state.modalVisible);
          }}
          style={styles.modalBackdrop}
        ></TouchableOpacity>
        <View style={styles.modal}>
          <View>{this.modalContainer}</View>
        </View>
      </Modal>
    );
  };

  //Kindshelpline
  modalVisibleHandler1 = (v) => {
    this.setState({
      modalVisible1: v,
    });
  };

  modalHeader1 = (
    <View style={styles.modalHeader}>
      <TouchableOpacity
        style={{ ...styles.action1 }}
        onPress={() => {
          this.modalVisibleHandler1(!this.state.modalVisible1 || false);
        }}
      >
        <Icon
          containerStyle={styles.closeIconStyle}
          name="times"
          type="font-awesome"
          color={"#fff"}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{"Kids Helpline"}</Text>
      <Text style={styles.number}>{"1800 55 1800"}</Text>
    </View>
  );

  modalBody1 = (
    <View style={styles.modalBody}>
      <Text style={styles.bodyText}>
        {
          "Kids Helpline is an Australian free, private and confidential, telephone and online counselling service specifically for young people aged between 5 and 25."
        }
      </Text>
    </View>
  );

  modalFooter1 = (
    <View style={styles.modalFooter}>
      <View style={{ flexDirection: "row-reverse", margin: 10 }}>
        <TouchableOpacity style={{ ...styles.action2 }}>
          <Text
            style={styles.actionText2}
            onPress={() => Linking.openURL(`tel:${1800551800}`)}
          >
            Call now
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ ...styles.action2 }}>
          <Text
            style={styles.actionText2}
            onPress={() => Linking.openURL("https://kidshelpline.com.au/")}
          >
            Go to Website
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  modalContainer1 = (
    <View style={styles.modalContainer}>
      {this.modalHeader1}
      {this.modalBody1}
      {this.modalFooter1}
    </View>
  );

  Modal1 = () => {
    return (
      <Modal
        transparent={true}
        visible={this.state.modalVisible1 || false}
        // onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
        // }}
      >
        <View style={styles.modal}>
          <View>{this.modalContainer1}</View>
        </View>
      </Modal>
    );
  };

  //lifeline
  modalVisibleHandler2 = (v) => {
    this.setState({
      modalVisible2: v,
    });
  };

  modalHeader2 = (
    <View style={styles.modalHeader}>
      <TouchableOpacity
        style={{ ...styles.action1 }}
        onPress={() => {
          this.modalVisibleHandler2(!this.state.modalVisible2 || false);
        }}
      >
        <Icon
          containerStyle={styles.closeIconStyle}
          name="times"
          type="font-awesome"
          color={"#fff"}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{"Lifeline Australia"}</Text>
      <Text style={styles.number}>{"13 11 14"}</Text>
    </View>
  );

  modalBody2 = (
    <View style={styles.modalBody}>
      <Text style={styles.bodyText}>
        {
          "Lifeline is a non-profit organisation that provides free, 24-hour Telephone Crisis Support service in Australia. Volunteer Crisis Supporters provide suicide prevention services, mental health support and emotional assistance, not only via telephone but face-to-face and online."
        }
      </Text>
    </View>
  );

  modalFooter2 = (
    <View style={styles.modalFooter}>
      <View style={{ flexDirection: "row-reverse", margin: 10 }}>
        <TouchableOpacity style={{ ...styles.action2 }}>
          <Text
            style={styles.actionText2}
            onPress={() => Linking.openURL(`tel:${131114}`)}
          >
            Call now
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ ...styles.action2 }}>
          <Text
            style={styles.actionText2}
            onPress={() => Linking.openURL("https://www.lifeline.org.au/")}
          >
            Go to Website
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  modalContainer2 = (
    <View style={styles.modalContainer}>
      {this.modalHeader2}
      {this.modalBody2}
      {this.modalFooter2}
    </View>
  );

  Modal2 = () => {
    return (
      <Modal
        transparent={true}
        visible={this.state.modalVisible2 || false}
        // onRequestClose={() => {
        //   Alert.alert("Modal has been closed.");
        // }}
      >
        <View style={styles.modal}>
          <View>{this.modalContainer2}</View>
        </View>
      </Modal>
    );
  };

  render() {
    return (
      <Container style={styles2.bgPurple1}>
        <Content contentContainerStyle={styles2.rneContentHomeDashboard}>
          <ScrollView style={styles.background}>
            {/* <ScrollView style={{ backgroundColor: "blue" }}> */}
            {/* ********************************** */}
            {/* BEYOND BLUE */}
            {this.Modal()}
            <TouchableOpacity
              style={styles.Support}
              activeOpacity={0.5}
              onPress={() => {
                this.modalVisibleHandler(true);
              }}
            >
              <Image source={BEYOND_BLUE} style={styles.ImageClass} />
            </TouchableOpacity>

            {/* ********************************** */}
            {/* KIDS HELP LINE */}
            {this.Modal1()}
            <TouchableOpacity
              style={styles.Support}
              activeOpacity={0.5}
              onPress={() => {
                this.modalVisibleHandler1(true);
              }}
            >
              <Image source={KIDS_HELP_LINE} style={styles.ImageClass} />
            </TouchableOpacity>

            {/* ********************************** */}
            {/* LIFE LINE */}
            {this.Modal2()}
            <TouchableOpacity
              style={styles.Support}
              activeOpacity={0.5}
              onPress={() => {
                this.modalVisibleHandler2(true);
              }}
            >
              <Image source={LIFE_LINE} style={styles.ImageClass} />
            </TouchableOpacity>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "#000000",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#101726",
    width: "80%",
    borderRadius: 5,
  },
  modalHeader: {},
  title: {
    fontWeight: "bold",
    fontSize: 20,
    paddingTop: 40,
    color: "#fff",
    textAlign: "center",
  },
  number: {
    fontWeight: "400",
    fontSize: 15,
    padding: 5,
    color: "#fff",
    textAlign: "center",
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
  modalFooter: {},
  action1: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "flex-end",
  },
  action2: {
    borderRadius: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  actionText1: {
    color: "#fff",
    fontWeight: "bold",
  },
  actionText2: {
    color: "#fff",
    fontWeight: "bold",
  },
  Support: {
    alignItems: "center",
    justifyContent: "center",
    top: 20,
    paddingBottom: 20,
  },
  ImageClass: {
    width: width / 1.2,
    height: height / 3.8,
    borderRadius: 24,
    alignSelf: "center",
    resizeMode: "cover",
  },
  background: {
    backgroundColor: "#101726",
  },
  closeIconStyle: {
    paddingRight: 10,
    paddingTop: 5,
  },
});

AppRegistry.registerComponent("Support", () => Support);
