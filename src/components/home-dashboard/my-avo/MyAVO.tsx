//Node modules
import * as React from "react";
import { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Container, Header, Content, Left, Right, Body } from "native-base";

//My components
import * as Constants from "constants/Constants";
import styles from "styles/Styles";
import db from "db/User";
import Accordion from "components/user-setup/Accordion";

interface IProps {}
interface IState {
  conditionComponents: any;
  size: any;
}

export default class MyAVO extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      conditionComponents: null,
      size: {},
    };
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    // grab all saved conditions on table user<>condition. (ResultSet)
    let rsUserCond = await db.grabUserCondition();
    if (rsUserCond != null && rsUserCond.rows.length > 0) {
      var conditionsArr = [];
      for (let x = 0; x < rsUserCond.rows.length; x++) {
        let item = rsUserCond.rows.item(x);
        let condSum = item.conditionSummary;
        if (condSum.length > 18) condSum = condSum.slice(0, 15) + "...";

        conditionsArr[x] = {
          conditionNumber: item.conditionNumber,
          title: "\tCondition " + item.conditionNumber + " ( " + condSum + " )", //prettier-ignore
          data: (
            <>
              <View>
                <Text style={{ fontWeight: "bold" }}>
                  {item.conditionSummary}
                </Text>
                <Text>{item.conditionText}</Text>
              </View>
            </>
          ),
          mandatory: item.conditionMandatory,
        };
      }
      this.setState({
        conditionComponents: this.renderAccordians(conditionsArr) // prettier-ignore
      });
    }
    // AVO conditions are all saved as boolean values. (ResultSet)

    // use the boolean values to find the condition details

    // display
  }

  /***********************************************************************************/
  // Functions
  renderAccordians = (avoConditions) => {
    const items = [];
    for (let x = 0; x < avoConditions.length; x++) {
      items.push(
        <Accordion
          key={x}
          checkBoxDisabled={true}
          conditionNumber={avoConditions[x].conditionNumber}
          title={avoConditions[x].title}
          data={avoConditions[x].data}
          mandatory={avoConditions[x].mandatory}
          specialCondition={avoConditions[x].specialCondition}
        />
      );
    }

    return items;
  };

  render() {
    return (
      <Container style={styles.bgPurple1}>
        <Content
          ref="contentRef"
          contentContainerStyle={{ alignItems: "stretch" }}
        >
          <LinearGradient
            colors={Constants.LINEAR_GRADIENT_MAIN}
            style={{
              marginTop: 12,
              marginRight: 24,
              marginLeft: 24,
              borderRadius: 8,
              backgroundColor: Constants.COLOUR_EAST_BAY, //"rgba(255,255,255, 0.3)",
              marginBottom: 24,
            }}
          >
            <ScrollView
              contentContainerStyle={{
                alignItems: "stretch",
                justifyContent: "flex-start",
              }}
            >
              <Right style={styles.homeDashboardGreeterRightContent}>
                <Text
                  style={{
                    color: Constants.COLOUR_WHITE,
                    fontSize: 18,
                    lineHeight: 25,
                    paddingTop: 8,
                    paddingRight: 16,
                    paddingLeft: 16,
                    paddingBottom: 16,
                    fontWeight: "bold",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                >
                  {
                    "You must follow the orders below. It is a criminal offence not to follow these orders. You could be arrested by police and charged. If you are found guilty, you could be detained for up to 2 years and be fined up to $5,500."
                  }
                  {"\n\n"}
                  {
                    "You could also be charged with other criminal offences. If you are found guitly of these offences, you could receive a higher penalty."
                  }
                </Text>
              </Right>
            </ScrollView>
          </LinearGradient>
          {this.state.conditionComponents}
        </Content>
      </Container>
    );
  }
}
