import React, { useState } from "react";
import { Text, View, TouchableOpacity, Modal, Alert } from "react-native";
import { Icon } from "react-native-elements";
import styles from "styles/Styles";

const CustomModal = (props) => {
  let modalHeader = (
    <View style={styles.modalHeader}>
      <Text style={styles.modalTitle}>{props.modalHeader}</Text>
      <View style={styles.divider}></View>
    </View>
  );
  let modalBody = (
    <View style={styles.modalBody}>
      <Text style={styles.bodyText}>{props.modalBody}</Text>
    </View>
  );
  let modalFooter = (
    <View style={styles.modalFooter}>
      <View style={styles.divider}></View>
      <View style={{ flexDirection: "row-reverse", margin: 10 }}>
        <TouchableOpacity
          style={{ ...styles.actions, backgroundColor: "#db2828" }}
          onPress={() => {
            props.modalVisibleHandler(!props.modalVisible);
          }}
        >
          <Text style={styles.actionText}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.actions, backgroundColor: "#21ba45" }}
          onPress={() => {
            props.modalVisibleHandler(!props.modalVisible);
            props.action();
          }}
        >
          <Text style={styles.actionText}>Yes</Text>
        </TouchableOpacity>
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
  if (props.styleVersion == 2) {
    modalHeader = (
      <View style={styles.modalHeader}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "flex-end",
          }}
          onPress={() => {
            props.modalVisibleHandler(!props.modalVisible);
          }}
        >
          <Icon
            containerStyle={{ paddingRight: 10, paddingTop: 5 }}
            name="times"
            type="font-awesome"
            color={"#fff"}
          />
        </TouchableOpacity>
      </View>
    );

    modalBody = (
      <View
        style={{
          backgroundColor: "#101726",
          paddingVertical: 20,
          paddingHorizontal: 30,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {props.modalBody}
        </Text>
      </View>
    );

    modalFooter = <></>;

    modalContainer = (
      <View
        style={{
          backgroundColor: "#101726",
          width: "80%",
          borderRadius: 5,
        }}
      >
        {modalHeader}
        {modalBody}
        {modalFooter}
      </View>
    );
  }

  return (
    <Modal
      transparent={true}
      visible={props.modalVisible}
      //   onRequestClose={() => {
      //     Alert.alert("Modal has been closed.");
      //   }}
    >
      <View style={styles.modal}>
        <View>{modalContainer}</View>
      </View>
    </Modal>
  );
};

export default CustomModal;
