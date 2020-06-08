import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from "react-native";
import { Icon, Text, Button } from "react-native-elements";
import { DrawerActions } from "@react-navigation/native";
import { NavigationRoute } from "react-navigation";
import { Container, Header, Content, Left, Right, Body } from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Textarea from "react-native-textarea";
import { LinearGradient } from "expo-linear-gradient";
const { width, height } = Dimensions.get("window");

// Import custom components
import * as Constants from "constants/Constants";
import styles from "styles/Styles";
import {
  formatMonthFromDatePicker,
  grabCourtDateReminder,
  formatCourtDateReminderRSAsJSONObj,
} from "db/SelectScripts";
import { insertCourtDateReminder } from "db/InsertScripts";
import { deleteCourtDateReminder } from "db/DeleteScripts";
import CustomTextInput from "components/user-setup/CustomTextInput";

interface courtDateReminderObjStructure {
  courtDateReminderId: number;
  courtDateReminderDesc: number;
  endTimestampFormatted: string;
  remaining: string;
}
interface IProps {
  navigation: any;
  route: NavigationRoute;
}
interface IState {
  courtDateReminderItems: courtDateReminderObjStructure[];
  courtDateReminderId: number;
  courtDateReminderDesc: string;
  courtDateReminderActive: boolean;
  courtDate: string;
  courtDateFormatted: string;
  isCourtDateTableEmpty: boolean;
  isDatePickerVisible: boolean;
  isButtonAddVisible: boolean;
}

export class CourtDateReminders extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      courtDateReminderItems: [],
      courtDateReminderId: 0,
      courtDateReminderDesc: "",
      courtDateReminderActive: false,
      courtDate: "",
      courtDateFormatted: "",
      isCourtDateTableEmpty: true,
      isDatePickerVisible: false,
      isButtonAddVisible: true,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    // First we check if we have something on our table "courtDateReminder".
    // If no such table, it'll throw an error and then handle it by creating a supportLink table.
    let rs: SQLResultSet = await grabCourtDateReminder();
    if (rs !== null) {
      if (rs.rows.length > 0) {
        this.setState({ isCourtDateTableEmpty: false });
        let courtDateReminderItems: courtDateReminderObjStructure[] = await formatCourtDateReminderRSAsJSONObj(
          rs
        );
        this.setState({
          courtDateReminderItems: courtDateReminderItems,
        });
      }
    }
  };

  handleConfirm = async (date: Date) => {
    //console.warn("A date has been picked: ", date);
    // Hide the calendar
    this.setState({ isDatePickerVisible: false });

    // 2020-06-09 02:56:51
    // Tue Jun 09 2020 01:16:14 GMT+1000 (AEST)
    // 09 - Jun - 2020
    // This is for the date display
    const mdate = date.toString().split(" ");
    const formattedDate = mdate[2] + " - " + mdate[1] + " - " + mdate[3];

    // This is for the endTimestamp for table courtDateReminder

    // Tue,Jun,09,2020,01:16:14,GMT+1000,(AEST)
    let formattedMonthForTimestamp = await formatMonthFromDatePicker(mdate[1].toString()); // prettier-ignore
    const endTimestamp = mdate[3] + "-" + formattedMonthForTimestamp + "-" + mdate[2] + " " + mdate[4]; // prettier-ignore

    // Do insert now
    this.setState({ courtDate: endTimestamp.toString() });
    this.setState({ courtDateFormatted: formattedDate });
    Keyboard.dismiss();
  };

  formHandler = async () => {
    // insert these values to 'courtDateReminder' table
    let insertSuccess = await insertCourtDateReminder(
      this.state.courtDateReminderDesc,
      this.state.courtDate
    );

    // re-render the page to show them
    if (insertSuccess) {
      this.setState({
        courtDateReminderItems: [],
        courtDateReminderId: 0,
        courtDateReminderDesc: "",
        courtDateReminderActive: false,
        courtDate: "",
        courtDateFormatted: "",
        isCourtDateTableEmpty: true,
        isDatePickerVisible: false,
        isButtonAddVisible: true,
      });
      this.props.route.params.refreshHomeScreenHandler();
    }
  };

  deleteCourtDateReminderHandler = async (courtDateReminderId: number) => {
    let success = await deleteCourtDateReminder(courtDateReminderId);
    if (success && this.state.courtDateReminderItems.length <= 1) {
      this.setState({
        courtDateReminderItems: [],
      });
    }
    // this.loadData();
    this.props.route.params.refreshHomeScreenHandler();
  };

  courtDescriptionInputComponent = () => {
    return (
      <View style={localStyle.courtDateReminderDesc}>
        <Textarea
          style={localStyle.textArea}
          onChangeText={(courtDateReminderDesc) =>
            this.setState({ courtDateReminderDesc })
          }
          defaultValue={this.state.courtDateReminderDesc}
          maxLength={100}
          placeholder={"Tap here"}
          placeholderTextColor={"#c7c7c7"}
          underlineColorAndroid={"transparent"}
        />
      </View>
    );
  };

  datePickerComponent = () => {
    return (
      <View>
        <CustomTextInput
          editable={false}
          onPress={() => this.setState({ isDatePickerVisible: true })}
          leftIcon={"calendar"}
          leftIconType={"font-awesome"} //the type of the icon you're using.
          leftIconColor={"white"} //you can put simple color words or hex or rgb.
          textInputPlaceholder={"'Tap' to select a date."}
          textInputPlaceholderColor={"#fff"}
          value={
            this.state.courtDateFormatted.length > 0
              ? this.state.courtDateFormatted.toString()
              : null
          }
        />

        <DateTimePickerModal
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this.handleConfirm}
          onCancel={() => {
            this.setState({ isDatePickerVisible: false });
          }}
          mode="date"
        />
      </View>
    );
  };

  render() {
    return (
      <Container style={styles.bgPurple1}>
        {/* HEADER */}
        <Header style={styles.bgPurple1}>
          <Left style={{ flex: 1, paddingLeft: 10 }}>
            <Icon
              name="bars"
              type="font-awesome"
              color="white"
              onPress={() =>
                this.props.navigation.dispatch(DrawerActions.openDrawer())
              }
            />
          </Left>
          <Body style={{ flex: 5 }}>
            <Text
              h4
              style={{
                color: Constants.COLOUR_WHITE,
                alignSelf: "center",
              }}
            >
              {"Court Date Reminders"}
            </Text>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>

        {/* CONTENTS */}
        <Content contentContainerStyle={localStyle.container}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              paddingTop: 16,
            }}
          >
            {/****************************************************************/}
            {/* START */}
            <View style={{ marginHorizontal: 16 }}>
              {/* Display this when table is empty. */}
              {this.state.isCourtDateTableEmpty && (
                <Text
                  h4
                  style={{
                    color: Constants.COLOUR_WHITE,
                    textAlign: "center",
                    paddingBottom: 16,
                  }}
                >
                  {"No court dates currently set"}
                </Text>
              )}

              {/* ADD A COURT DATE BUTTON */}
              {/* Display this all the time to add court dates. */}
              {this.state.isButtonAddVisible && (
                <>
                  <Button
                    title="Add a court date"
                    onPress={() => {
                      this.setState({ isButtonAddVisible: false });
                    }}
                  />
                  {!this.state.isCourtDateTableEmpty && (
                    <View style={localStyle.hrLine} />
                  )}
                </>
              )}

              {/* TEXT AND DATE */}
              {/* Display this only after pressing "Add a court date" button */}
              {!this.state.isButtonAddVisible && (
                <>
                  {this.courtDescriptionInputComponent()}
                  {this.datePickerComponent()}
                  {this.state.isButtonAddVisible && (
                    <View style={localStyle.hrLine} />
                  )}
                </>
              )}

              {/* SAVE BUTTON */}
              {/* Display this when all required fields are filled. */}
              {this.state.courtDateReminderDesc.length > 0 &&
                this.state.courtDateFormatted.length > 0 &&
                !this.state.isButtonAddVisible && (
                  <>
                    <View style={{ marginHorizontal: 16 }}>
                      <Button
                        title="Save"
                        onPress={() => {
                          this.formHandler();
                        }}
                      />
                    </View>
                    <View style={localStyle.hrLine} />
                  </>
                )}

              {/* START MAPPING COURT DATE REMINDER ITEMS */}
              <ScrollView>
                {this.state.courtDateReminderItems.length > 0 && (
                  <View>
                    <Text h4 style={localStyle.upcomingCourtDatesText}>
                      {"Your upcoming court dates . . ."}
                    </Text>
                  </View>
                )}
                {this.state.courtDateReminderItems.map((item, idx) => (
                  <LinearGradient
                    key={idx}
                    colors={Constants.LINEAR_GRADIENT_MAIN}
                    style={localStyle.linearGradient}
                  >
                    <View>
                      <View style={{ margin: 8 }}>
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ flex: 1 }}>
                            {!!item.endTimestampFormatted && (
                              <Text
                                style={[styles.lmText, { fontWeight: "bold" }]}
                              >
                                {item.endTimestampFormatted +
                                  " (" +
                                  parseInt(item.remaining) +
                                  " day" +
                                  (parseInt(item.remaining) <= 1 ? "" : "s") +
                                  " from now)"}
                              </Text>
                            )}
                          </View>

                          <View>
                            <TouchableOpacity>
                              <Icon
                                name="times-circle"
                                type="font-awesome"
                                color="white"
                                onPress={() => {
                                  this.deleteCourtDateReminderHandler(
                                    item.courtDateReminderId
                                  );
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={localStyle.courtDateDescContainer}>
                          {!!item.courtDateReminderDesc && (
                            <Body>
                              <Text style={localStyle.courtDateDescBody}>
                                {item.courtDateReminderDesc}
                              </Text>
                            </Body>
                          )}
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                ))}
              </ScrollView>
            </View>
            {/* END */}
            {/****************************************************************/}
          </View>
        </Content>
      </Container>
    );
  }
}

const localStyle = StyleSheet.create({
  courtDateDescContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  courtDateDescBody: {
    color: Constants.COLOUR_WHITE,
    fontSize: 15,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  hrLine: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  courtDateReminderDesc: {
    backgroundColor: "white",
    flexDirection: "row",
    borderRadius: 3,
  },
  textArea: {
    margin: 15,
    padding: 5,
  },
  upcomingCourtDatesText: {
    color: "#fff",
    paddingTop: 20,
    paddingBottom: 8,
  },
  linearGradient: {
    marginTop: 12,
    marginBottom: 24,
    borderRadius: 8,
    height: "auto",
    backgroundColor: Constants.COLOUR_EAST_BAY,
  },
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// TODO:
// CREATE COURT DATES REMINDERS
// CLEAN THE CODE
// CREATE A DEPLOYMENT INSTRUCTIONS FOR SUBMISSION
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

export default CourtDateReminders;
