import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
  Linking,
} from "react-native";
import { Icon } from "react-native-elements";
const CustomModal = (props) => {
  let modalHeader = (
    <View>
      <TouchableOpacity
        style={{ ...styles.action1 }}
        onPress={() => {
          props.modalVisibleHandler(!props.modalVisible || false);
        }}
      >
        <Icon
          containerStyle={styles.closeIconStyle}
          name="times"
          type="font-awesome"
          color={"#fff"}
        />
      </TouchableOpacity>

      {props.supportLinkTitle !== "" && (
        <Text style={styles.title}>
          {props.supportLinkTitle !== "" ? props.supportLinkTitle : "Support"}
        </Text>
      )}

      {(props.supportLinkNumber !== "" ||
        props.supportLinkAdditionalHeading !== "") && (
        <Text style={styles.number}>
          {props.supportLinkAdditionalHeading == ""
            ? props.supportLinkNumber
            : ""}
        </Text>
      )}
    </View>
  );

  let modalBody = (
    <View style={styles.modalBody}>
      <Text style={styles.bodyText}>{props.supportLinkDescription}</Text>
    </View>
  );

  let modalFooter = (
    <View>
      <View style={{ flexDirection: "row-reverse", margin: 10 }}>
        {props.supportLinkNumber && (
          <TouchableOpacity style={{ ...styles.action2 }}>
            <Text
              style={styles.actionText2}
              onPress={() => Linking.openURL(`tel:${props.supportLinkNumber}`)}
            >
              Call now
            </Text>
          </TouchableOpacity>
        )}

        {props.supportLinkURL && (
          <TouchableOpacity style={{ ...styles.action2 }}>
            <Text
              style={styles.actionText2}
              onPress={() => Linking.openURL(props.supportLinkURL)}
            >
              Go to Website
            </Text>
          </TouchableOpacity>
        )}

        {props.supportLinkAdditionalURL !== "" &&
          props.supportLinkAdditionalHeading !== "" && (
            <TouchableOpacity style={{ ...styles.action2 }}>
              <Text
                style={styles.actionText2}
                onPress={() => Linking.openURL(props.supportLinkAdditionalURL)}
              >
                {props.supportLinkAdditionalHeading !== ""
                  ? props.supportLinkAdditionalHeading
                  : "View Other Website"}
              </Text>
            </TouchableOpacity>
          )}
      </View>
    </View>
  );

  let modalContainer = (
    <View style={styles.modalContainer}>
      {modalHeader}
      {modalBody}
      {modalFooter}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.modalVisibleHandler(!props.modalVisible);
      }}
    >
      <TouchableOpacity
        onPress={() => {
          props.modalVisibleHandler(!props.modalVisible);
          //   props.action();
        }}
      >
        <View style={styles.modalBackdrop}></View>
      </TouchableOpacity>
      <View style={styles.modal}>
        <View>{modalContainer}</View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  modalBackdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#101726",
    width: "80%",
    borderRadius: 5,
  },
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
    fontSize: width / 24,
    backgroundColor: "transparent",
    marginTop: 20,
    lineHeight: 25,
    textAlign: "center",
  },
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
  actionText2: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeIconStyle: {
    paddingRight: 10,
    paddingTop: 5,
  },
});
