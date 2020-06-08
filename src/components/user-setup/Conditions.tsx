import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Accordion from "components/user-setup/Accordion";
import { fetchAVOConditionsV2 } from "contentful-api/ContentfulData";
import { grabConditions, debugPrintScript } from "db/SelectScripts";

// type FC<P = {}> = FunctionComponent<P>;

interface IProps {
  useCustomStyle: boolean;
}
interface IState {}

export default class Conditions extends Component<IProps, IState> {
  state = {
    error: false,
    conditionComponents: (
      <>
        <Text style={{ color: "white", alignSelf: "center" }}>
          {"Loading Data Please Wait. . ."}
        </Text>
        <ActivityIndicator size="large" color="#fff" />
      </>
    ),
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    // First we check if we have something on our table "condition".
    // If no such table, it'll throw an error and then handle it by creating a condition table.
    let rs: SQLResultSet = await grabConditions();
    if (rs == null || rs.rows.length == 0) {
      // Since we just created a table, our program will come here straight after.
      //   We then start to fetch data then save it on our table 'condition'.
      let objArr = await fetchAVOConditionsV2();
      this.setState({
        conditionComponents: this.renderAccordians(objArr) // prettier-ignore
      });
    } else {
      // We have data on our table.
      await this.grabDisplayData();
    }
  };

  async grabDisplayData() {
    // get all the condition as resultset
    let rsCond = await grabConditions(); //prettier-ignore
    if (rsCond != null) {
      var conditionsArr = [];
      // loop through each of the condition.
      for (let x = 0; x < rsCond.rows.length; x++) {
        let item = rsCond.rows.item(x);
        let condSum = item.conditionSummary;
        if (condSum.length > 18) condSum = condSum.slice(0, 15) + "...";
        conditionsArr[x] = {
          conditionNumber: item.conditionNumber,
          title: "\tCondition " + item.conditionNumber + " ( " + condSum + " )", //prettier-ignore
          conditionSummary: item.conditionSummary,
          conditionText: item.conditionText,
          alreadySelected: item.conditionSelected === 1,
          mandatory: item.conditionMandatory,
        };
      }

      conditionsArr[10] = {
        conditionNumber: 11,
        title: "\tCondition 11",
        conditionSummary: "A special condition.",
        conditionText: " ",
        specialCondition: true,
      };

      this.setState({
        conditionComponents: this.renderAccordians(conditionsArr) // prettier-ignore
      });
    }
  }

  //   /***********************************************************************************/
  //   // For now we are hard-coding this special condition.
  //   conditionsArr: string | any[10] = {
  //     title: "Condition 11",
  //     data: <Text>"A special condition."</Text>,
  //     specialCondition: true,
  //   };

  /***********************************************************************************/
  // functional functions
  renderAccordians(avoConditions) {
    const items = [];
    if (avoConditions.length > 0 && typeof avoConditions[0] !== "undefined") {
      for (let x = 0; x < avoConditions.length; x++) {
        let data: any = (
          <>
            <Text style={{ fontWeight: "bold" }}>
              {avoConditions[x].conditionSummary}
            </Text>
            <Text>{avoConditions[x].conditionText}</Text>
          </>
        );
        items.push(
          <Accordion
            key={x}
            checkBoxDisabled={false}
            conditionNumber={avoConditions[x].conditionNumber}
            title={avoConditions[x].title}
            data={data}
            alreadySelected={avoConditions[x].alreadySelected}
            mandatory={avoConditions[x].mandatory}
            specialCondition={avoConditions[x].specialCondition}
            // onPressTest={this.scrollOnChange}
          />
        );
      }
    } else {
      items.push(
        <Text
          key={0}
          style={{
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "transparent",
            textAlign: "center",
          }}
        >
          This device's Internet connection appears to be offline. Please check
          your Internet connection and try to come back to this page again.
        </Text>
      );
    }

    return items;
  }

  // find_dimesions(layout) {
  //   const { x, y, width, height } = layout;
  //   // this.setState({
  //   //   currentContainerHeight: height,
  //   // });
  // }

  scrollOnChange = (v: boolean) => {
    if (v) {
      this.scrollView.scrollTo({ y: 100 });
    }
  };
  render() {
    return (
      <View
        style={
          this.props.useCustomStyle ? localStyle.custom : localStyle.default
        }
        // onLayout={(e) => {
        //   find_dimesions(e.nativeEvent.layout);
        // }}
      >
        <ScrollView style={{ flex: 1 }} ref={(ref) => (this.scrollView = ref)}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            {this.state.conditionComponents}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const { width, height } = Dimensions.get("window");
const localStyle = StyleSheet.create({
  default: {
    position: "absolute",
    left: 0,
    bottom: 80,
    height: height / 2.1,
    width: width,
    marginBottom: 50,
  },
  custom: {
    flex: 1,
  },
});
