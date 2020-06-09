import React, { Component, ReactFragment } from "react";
import * as Constants from "constants/Constants";
import {
  Modal,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Text } from "react-native-elements";
import { Container, Content } from "native-base";
import { fetchSupportLinksAndSave } from "contentful-api/ContentfulData";
import { grabSupportLinks, formatSupportLinkRS } from "db/SelectScripts";
import { BLANK_IMG_PLACEHOLDER } from "images/Images";

import styles from "styles/Styles";
import SupportLinksModal from "components/SupportLinksModal";

interface supportLinkObjStructure {
  supportLinkURL: string;
  supportLinkNumber: number;
  supportLinkTitle: string;
  supportLinkDescription: string;
  supportLinkImageURL: string;
  supportLinkAdditionalURL: string;
  supportLinkAdditionalHeading: string;
}
interface IProps {}
interface IState {
  supportLinkItems: supportLinkObjStructure[]; //define the object structure of our state.
  modalVisible: boolean;
  idx: number;
  screenLoader: ReactFragment;
  valid: boolean;
}

export class SupportLinks extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      supportLinkItems: [],
      modalVisible: false,
      idx: 0,
      screenLoader: false,
      valid: true,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    this.screenLoader(true);
    // await debugPrintScript("drop table supportLink; ");
    // First we check if we have something on our table "supportLink".
    // If no such table, it'll throw an error and then handle it by creating a supportLink table.
    let rs: SQLResultSet = await grabSupportLinks();
    // Since we just created a table, our program will come here straight after.
    //   We then start to fetch support links data then save it on our table 'supportLink'.
    await fetchSupportLinksAndSave();
    rs = await grabSupportLinks();
    this.supportLinkHandler(rs);
    this.screenLoader(false);
  };

  screenLoader = (show: boolean) => {
    this.setState({
      screenLoader: show ? (
        <ActivityIndicator
          size="large"
          style={styles.activityIndicatorOverlayCentre}
        />
      ) : (
        <></>
      ),
    });
  };

  supportLinkHandler = async (rs: SQLResultSet) => {
    let objArr = await formatSupportLinkRS(rs);
    this.setState({
      supportLinkItems: objArr,
    });
  };

  Modal = () => {
    return (
      <Modal transparent={true} visible={this.state.modalVisible || false}>
        <TouchableOpacity
          onPress={() => {
            this.modalVisibleHandler(!this.state.modalVisible);
          }}
        ></TouchableOpacity>
      </Modal>
    );
  };

  modalVisibleHandler = (v) => {
    this.setState({
      modalVisible: v,
    });
  };

  renderModal = () => {
    if (typeof this.state.supportLinkItems[this.state.idx] !== "undefined") {
      const {
        supportLinkURL,
        supportLinkNumber,
        supportLinkTitle,
        supportLinkDescription,
        supportLinkAdditionalURL,
        supportLinkAdditionalHeading,
      } = this.state.supportLinkItems[this.state.idx];
      return (
        <SupportLinksModal
          modalVisible={this.state.modalVisible}
          modalVisibleHandler={this.modalVisibleHandler}
          supportLinkURL={supportLinkURL}
          supportLinkNumber={supportLinkNumber}
          supportLinkTitle={supportLinkTitle}
          supportLinkDescription={supportLinkDescription}
          supportLinkAdditionalURL={supportLinkAdditionalURL}
          supportLinkAdditionalHeading={supportLinkAdditionalHeading}
        />
      );
    }
  };

  render() {
    const { width, height } = Dimensions.get("window");
    return (
      <Container style={styles.bgPurple1}>
        <Content contentContainerStyle={styles.rneContentHomeDashboard}>
          <ScrollView>
            {this.renderModal()}
            {this.state.supportLinkItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.supportLinkTouch}
                activeOpacity={0.5}
                onPress={() => {
                  this.setState({ idx: idx });
                  this.modalVisibleHandler(true);
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    width: width / 1.3,
                    height: height / 3.5,
                  }}
                >
                  <Image
                    onError={() => this.setState({ valid: false })}
                    style={
                      this.state.valid
                        ? localStyle.imgValid
                        : localStyle.imgInvalid
                    }
                    source={
                      this.state.valid
                        ? { uri: "https:" + item.supportLinkImageURL }
                        : BLANK_IMG_PLACEHOLDER
                    }
                  />
                  <Text
                    h4
                    style={{
                      alignSelf: "center",
                      color: Constants.COLOUR_WHITE,
                    }}
                  >
                    {item.supportLinkTitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <View style={{ paddingBottom: 20 }}></View>
          </ScrollView>
        </Content>
        {this.state.screenLoader}
      </Container>
    );
  }
}

export default SupportLinks;

const localStyle = StyleSheet.create({
  imgValid: {
    flex: 1,
    borderRadius: 8,
  },
  imgInvalid: {
    alignSelf: "center",
    flex: 1,
    borderRadius: 8,
  },
});
