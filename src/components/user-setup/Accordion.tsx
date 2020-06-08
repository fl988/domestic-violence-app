import React, { Component, FunctionComponent } from "react";
import { View, TouchableOpacity, Text, Alert, Dimensions } from "react-native";
import CheckBox from "react-native-check-box";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Constants from "constants/Constants";
const { width, height } = Dimensions.get("window");

// Database
import db from "db/User";

// Styles
import styles from "styles/Styles";

interface IProps {
  checkBoxDisabled?: boolean;
  conditionNumber?: number;
  title?: string;
  data?: string;
  alreadySelected?: boolean;
  mandatory?: boolean;
  specialCondition?: boolean;
  onPressTest?: FunctionComponent;
}
interface IState {
  conditionNumber?: number;
  conditionDescComponent?: string;
  expanded?: boolean;
  isChecked?: boolean;
}
export default class Accordion extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      conditionNumber: props.conditionNumber,
      conditionDescComponent: props.data,
      expanded: false,
      isChecked: this.props.alreadySelected,
    };
  }

  conditionKeyHandler = (v: number) => {
    var conditionNum = v;

    if (v == 1) {
      Alert.alert("Condition 1 is mandatory and cannot be unselected.");
      return;
    }

    //Translation: if its condition 11 AND it's a special condition AND it's checked then do the following.
    if (v == 11 && this.props.specialCondition && !this.state.isChecked) {
      Alert.alert("Please contact your parent/guardian for this condition.");
      return;
    }

    db.updateUserConditions(conditionNum, this.state.isChecked);
  };

  checkBoxComponent = () => {
    if (this.props.checkBoxDisabled) {
      return;
    }
    return (
      <CheckBox
        title="Click Here"
        onClick={() => {
          this.setState({
            isChecked: !this.state.isChecked,
          });
          this.conditionKeyHandler(this.state.conditionNumber);
        }}
        isChecked={this.props.mandatory ? true : this.state.isChecked}
        checkBoxColor="#fff"
      />
    );
  };

  render() {
    return (
      <View style={{ paddingBottom: 8 }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            height: height / 15,
            paddingLeft: 25,
            paddingRight: 25,
            alignItems: "center",
            backgroundColor:
              this.state.isChecked || this.props.mandatory
                ? Constants.COLOUR_WINE_BERRY
                : Constants.COLOUR_DOVE_GRAY,
          }}
          onPress={() => {
            this.toggleExpand();
            // this.props.onPressTest(!this.state.expanded);
          }}
        >
          {this.checkBoxComponent()}
          {/* styles.font is still empty */}
          <Text
            style={[styles.accordionTitle, { color: Constants.COLOUR_WHITE }]}
          >
            {this.props.title}
          </Text>
          <Icon
            name={this.state.expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} // prettier-ignore
            size={30}
            color={"#A9A9A9"}
          />
        </TouchableOpacity>

        <View style={styles.accordionParentHr} />
        {this.state.expanded && (
          <View style={styles.accordionChild}>
            {this.state.conditionDescComponent}
          </View>
        )}
      </View>
    );
  }

  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };
}
