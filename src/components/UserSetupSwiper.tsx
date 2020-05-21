import React, { Component } from "react";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import Swiper from "react-native-swiper";
import * as Constants from "constants/Constants";
// Database
import db from "db/User";
// Styles
import styles from "styles/Styles";
// Components
import InitialsInput from "components/user-setup/InitialsInput";
import DateOfBirth from "components/user-setup/DateOfBirth";
import UserType from "components/user-setup/UserType";
import Conditions from "components/user-setup/Conditions";
import CustomModal from "components/user-setup/CustomModal";

interface IProps {
  action?: Function;
}
interface IState {}

export default class UserSetupSwiper extends Component<IProps, IState> {
  swiper: Swiper;

  state = {
    /*Can add some stuff here later*/
    modalVisible: false,
    userDetails: "",
  };

  // Array of pages with defined keys and values
  PAGES = [
    {
      title: "What are your Intitials?",
      description: "Since this is your first time, we'll need to know a little bit about you.", // prettier-ignore
      bgColor: Constants.COLOUR_EBONY,
      component: <InitialsInput onNext={() => this.swiper.scrollBy(1)} />,
    },
    {
      title: "What is your date of birth?",
      description: "Please select.",
      bgColor: Constants.COLOUR_EBONY,
      component: <DateOfBirth onNext={() => this.swiper.scrollBy(1)} /> // prettier-ignore
    },
    {
      title: "What type of user are you?",
      description: "Please choose one.",
      bgColor: Constants.COLOUR_EBONY,
      component: <UserType onNext={() => this.swiper.scrollBy(1)} />,
    },
    {
      title: "Please check which conditions apply to you.",
      //   description: "Please choose one.",
      bgColor: Constants.COLOUR_EBONY,
      component: <Conditions />,
    },
  ];

  modalVisibleHandler = (showModal: boolean) => {
    this.setState({
      modalVisible: showModal,
      userDetails: React.Component,
    });
    if (showModal) {
      this.readUserDetails();
    }
  };

  async readUserDetails() {
    let rsUser = await db.grabUserDetails();
    if (rsUser != null) {
      let component = "";
      let rsCond = await db.grabConditionDetails();
      if (rsCond != null) {
        for (let x = 0; x < rsCond.rows.length; x++) {
          let condItem = rsCond.rows.item(x);
          if (condItem.conditionSelected) {
            component +=
              "\n\t- Condition " +
              condItem.conditionNumber +
              " (" +
              condItem.conditionSummary +
              ")";
          }
        }
      }

      let userItem = rsUser.rows.item(0);
      this.setState({
        userDetails:
          "Initials: "                + (userItem.initials == "" ? "Anonymous" : userItem.initials) + // prettier-ignore
          "\n\nDOB: "                 + userItem.dob +                                                // prettier-ignore
          "\n\nType of User: "        + Constants.userTypeDescArr[userItem.userTypeId - 1] +          // prettier-ignore
          "\n\nConditions selected:"  + component // prettier-ignore
      });
    }
  }

  confirmModal = (i, l) => {
    if (i == l) {
      return (
        <CustomModal
          action={this.props.action}
          modalVisible={this.state.modalVisible}
          modalVisibleHandler={this.modalVisibleHandler}
          modalHeader={"Confirmation"}
          modalBody={
            "Could you please confirm if your details below are all correct. \n\n" +
            this.state.userDetails
          }
        />
      );
    }
  };

  screenNavButtonsHandler = (i) => {
    let component = (
      <View style={styles.navBackButton}>
        <Icon
          reverse
          name="chevron-left"
          type="font-awesome"
          onPress={() => this.swiper.scrollBy(-1)}
        />
        {i == this.PAGES.length - 1 ? (
          <Icon
            reverse
            name="check"
            type="font-awesome"
            onPress={() => {
              this.modalVisibleHandler(true);
            }}
          />
        ) : (
          <></>
        )}
      </View>
    );

    return i != 0 ? component : <></>;
  };

  render() {
    return (
      <Swiper
        ref={(swiper: Swiper) => {
          this.swiper = swiper;
        }}
        loop={false}
        index={0}
        scrollEnabled={false}
      >
        {/* We map the pages, which works like loops. */}
        {this.PAGES.map((page, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: page.bgColor }}>
            <View style={[styles.card]}>
              <Text style={styles.title}>{page.title}</Text>
              <Text style={styles.desc}>{page.description}</Text>
            </View>
            {page.component}
            {this.screenNavButtonsHandler(i)}
            {this.confirmModal(i, this.PAGES.length - 1)}
          </View>
        ))}
      </Swiper>
    );
  }
}
