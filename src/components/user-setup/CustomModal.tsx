import React, { useState } from "react";
import { Text, View, TouchableOpacity, Modal, Alert } from "react-native";
import styles from "styles/Styles";

const CustomModal = (props) => {
  const modalHeader = (
    <View style={styles.modalHeader}>
      <Text style={styles.modalTitle}>{props.modalHeader}</Text>
      <View style={styles.divider}></View>
    </View>
  );
  const modalBody = (
    <View style={styles.modalBody}>
      <Text style={styles.bodyText}>{props.modalBody}</Text>
    </View>
  );
  const modalFooter = (
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

  const modalContainer = (
    <View style={styles.modalContainer}>
      {modalHeader}
      {modalBody}
      {modalFooter}
    </View>
  );

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
