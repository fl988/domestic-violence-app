import React, {
  Component,
  FunctionComponent,
  ComponentType,
  ReactNode,
  ReactFragment,
} from "react";
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Accordion from "components/user-setup/Accordion";
import * as Constants from "constants/Constants";
import db from "db/User";
import { fetchAVOConditions } from "contentful-api/ContentfulData";

// Styles
import styles from "styles/Styles";

// type FC<P = {}> = FunctionComponent<P>;

interface IProps {}
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
    this.checkUser();
  }

  async checkUser() {
    await this.fetchAPI(); //fetch stuff from contentful then populate the 'condition' table.
    await this.grabDisplayData(); //grab the recently saved data then set the state for display.
  }

  async fetchAPI() {
    let isUserAlreadySet = await db.checkUserSetUp();

    if (!isUserAlreadySet) {
      let count = await db.getConditionRecordCount();
      count > 9 ? await db.deleteCondition() : "";
      for (let x = 0; x < Constants.CONT_PENTECH_CONDITIONS_ARR.length; x++) {
        const apiKey = Constants.CONT_PENTECH_CONDITIONS_ARR[x];

        //fetch data from api and wait until finish before continuing the loop
        let data = await fetchAVOConditions(apiKey);

        // if (!this.state.error) {
        //   //Error: Network Error
        //   this.setState({
        //     error: true,
        //     conditionComponents: (
        //       <>
        //         <Text style={{ color: "white", alignSelf: "center" }}>
        //           {"Network Error"}
        //         </Text>
        //       </>
        //     ),
        //   });
        // }

        await db.insertConditionRecord(
          data.conditionNumber,
          data.conditionSummary,
          data.conditionText,
          x == 0, // 1st condition is always true
          x == 0 // 1st condition is always mandatory
        );
      }
    }
  }

  async grabDisplayData() {
    // get all the condition as resultset
    let rsCond = await db.grabConditionDetails(); //prettier-ignore
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
          data: (
            <>
              <Text style={{ fontWeight: "bold" }}>
                {item.conditionSummary}
              </Text>
              <Text>{item.conditionText}</Text>
            </>
          ),
          alreadySelected: item.conditionSelected,
          mandatory: item.conditionMandatory,
        };
      }
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
        items.push(
          <Accordion
            key={x}
            checkBoxDisabled={false}
            conditionNumber={avoConditions[x].conditionNumber}
            title={avoConditions[x].title}
            data={avoConditions[x].data}
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

  find_dimesions(layout) {
    const { x, y, width, height } = layout;
    // this.setState({
    //   currentContainerHeight: height,
    // });
  }

  scrollOnChange = (v: boolean) => {
    if (v) {
      this.scrollView.scrollTo({ y: 100 });
    }
  };
  render() {
    const { width, height } = Dimensions.get("window");
    return (
      <View
        style={{
          position: "absolute",
          left: 0,
          bottom: 80,
          // borderRadius: (PAGE_WIDTH - 100) / 2,
          height: height / 2.1,
          width: width,
          marginBottom: 50,
        }}
        // onLayout={(e) => {
        //   find_dimesions(e.nativeEvent.layout);
        // }}
      >
        <ScrollView ref={(ref) => (this.scrollView = ref)}>
          {this.state.conditionComponents}
        </ScrollView>
      </View>
    );
  }
}
