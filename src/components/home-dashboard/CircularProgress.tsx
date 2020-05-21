import React, { Component } from "react";
import { View, Text, Dimensions, TouchableWithoutFeedback } from "react-native";
import ProgressCircle from "react-native-progress-circle"; //https://www.npmjs.com/package/react-native-progress-circle
import styles from "styles/Styles";

const { width } = Dimensions.get("window");
const size = width / 2;
const strokeWidth = size / 1.3;
const radius = (size - strokeWidth) / 1.7;
//const circumference = radius * 2 * Math.PI;

interface IProps {
  percent?: number;
}
interface IState {
  percent?: number;
}

export default class CircularProgress extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      percent: props.percent,
    };
  }

  rand = () => {
    this.setState({
      percent: Math.floor(Math.random() * 100) + 1,
    });
  };

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.rand();
        }}
      >
        <View style={{ marginLeft: 10 }}>
          <ProgressCircle
            percent={this.state.percent}
            radius={radius}
            borderWidth={10}
            color="#2A1D59"
            shadowColor="#999"
            bgColor="#78738C"
          >
            <Text style={styles.gaugeText}>{this.state.percent + "%"}</Text>
          </ProgressCircle>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

// flex: 1,
// flexDirection: "row",
// alignItems: "center",
// justifyContent: "center",
