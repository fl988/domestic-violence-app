/*
Dependencies: 
    - native-base@2.13.8
    ------react-navigation@1.0.0-beta.23
    - @react-navigation/native
    - @react-navigation/drawer
    - react-native-reanimated
*/
/* *************************************** */
// Import Modules
import React from "react";
import SafeAreaView from "react-native-safe-area-view";
import { NavigationContainer } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import {
  View,
  StyleSheet,
  Text,
  Linking,
  useWindowDimensions,
} from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator,
} from "@react-navigation/drawer"; // https://reactnavigation.org/docs/drawer-navigator/
const Drawer = createDrawerNavigator();

/* *************************************** */
// Import Custom Components
import * as Constants from "constants/Constants";
import * as api from "contentful-api/ContentfulData";
import HomeScreen from "components/home-dashboard/HomeScreen";
import CourtDateReminders from "components/home-dashboard/CourtDateReminders";
import SettingsScreen from "components/home-dashboard/SettingsScreen";
import FAQ from "components/home-dashboard/FAQ";
import CustomModal from "components/user-setup/CustomModal";

/* *************************************** */
// Interface - a syntactical contract that an entity should conform to. In other words, an interface defines the syntax that any entity must adhere to.
interface IProps {
  deleteAccountHandler?: Function;
  redoTutorial?: Function;
}
interface IState {
  modalVisible: boolean;
  refreshHomeScreen: boolean;
}
export default class HomeDashboard extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false,
      refreshHomeScreen: false,
    };
  }

  componentDidMount() {}

  modalVisibleHandler = (v) => {
    this.setState({
      modalVisible: v,
    });
  };

  async downloadAVO() {
    let linkAVO = await api.fetchPDF();
    Linking.openURL("https://" + linkAVO);
  }

  refreshHomeScreenHandler = () => {
    this.setState({
      refreshHomeScreen: true,
    });
  };

  CustomDrawerContent = (
    props: DrawerContentComponentProps<DrawerContentOptions>
  ) => {
    return (
      // LEFT NAVIGATION COMPONENTS
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* ALWAYS ON TOP, ORDER BY STACK */}
        <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
          <DrawerItemList {...props} />
          {/* https://reactnavigation.org/docs/drawer-navigator/#providing-a-custom-drawercontent */}
          {/* Add your custom <DrawerItem> below here */}
          {/* DONWLOAD SAMPLE AVO BUTTON */}
          <DrawerItem
            label={() => (
              <View style={styles.drawerScreen}>
                <Icon name="book" type="font-awesome" color="white" />
                <Text style={{ color: Constants.COLOUR_WHITE, paddingLeft: 8 }}>
                  {"Download Sample AVO"}
                </Text>
              </View>
            )}
            onPress={() => {
              this.downloadAVO();
            }}
          />
        </SafeAreaView>

        {/* ALWAYS ON BOTTOM, ORDER BY STACK */}
        <SafeAreaView forceInset={{ bottom: "always", horizontal: "never" }}>
          {/* ONLY add components below here IF you want a particular component to be positioned on the bottom of the left navigation. To test it out, uncomment the <DrawerItem> below by highlighting it then press "CTRL + /forward-slash" */}
          {/* <DrawerItem
            label={() => <Text style={{ color: "#black" }}>{"Test"}</Text>}
          /> */}

          {/* DELETE ACCOUNT BUTTON */}
          <DrawerItem
            label={() => (
              <Text style={{ color: "#fff" }}>{"Delete Account"}</Text>
            )}
            style={{ backgroundColor: "#f44336" }} //red-orange
            onPress={() => {
              this.modalVisibleHandler(true);
            }}
          />
        </SafeAreaView>
      </DrawerContentScrollView>
    );
  };

  render() {
    const MyDrawer = () => {
      return (
        <Drawer.Navigator
          drawerStyle={{
            backgroundColor: Constants.COLOUR_EBONY,
          }}
          drawerContent={(props) => this.CustomDrawerContent(props)}
        >
          {/* Add non-custom drawers here */}
          <Drawer.Screen
            name={Constants.LEFT_NAV_HOME}
            component={HomeScreen}
            initialParams={{
              redoTutorial: this.props.redoTutorial,
            }}
            options={{
              drawerLabel: ({}) => (
                <View style={styles.drawerScreen}>
                  <Icon name="home" type="font-awesome" color="white" />
                  <Text
                    style={{ color: Constants.COLOUR_WHITE, paddingLeft: 8 }}
                  >
                    {Constants.LEFT_NAV_HOME}
                  </Text>
                </View>
              ),
            }}
          />
          <Drawer.Screen
            name={Constants.LEFT_NAV_COURT_DATE_REMINDERS}
            component={CourtDateReminders}
            options={{
              drawerLabel: ({}) => (
                <View style={styles.drawerScreen}>
                  <Icon
                    name="calendar-check-o"
                    type="font-awesome"
                    color="white"
                  />
                  <Text
                    style={{ color: Constants.COLOUR_WHITE, paddingLeft: 8 }}
                  >
                    {Constants.LEFT_NAV_COURT_DATE_REMINDERS}
                  </Text>
                </View>
              ),
            }}
            initialParams={{
              refreshHomeScreenHandler: this.refreshHomeScreenHandler,
            }}
          />
          <Drawer.Screen
            name={Constants.LEFT_NAV_SETTINGS}
            component={SettingsScreen}
            options={{
              drawerLabel: ({}) => (
                <View style={styles.drawerScreen}>
                  <Icon name="cog" type="font-awesome" color="white" />
                  <Text
                    style={{ color: Constants.COLOUR_WHITE, paddingLeft: 8 }}
                  >
                    {Constants.LEFT_NAV_SETTINGS}
                  </Text>
                </View>
              ),
            }}
            initialParams={{
              refreshHomeScreenHandler: this.refreshHomeScreenHandler,
            }}
          />
          <Drawer.Screen
            name={Constants.LEFT_NAV_FAQ}
            component={FAQ}
            options={{
              drawerLabel: ({}) => (
                <View style={styles.drawerScreen}>
                  <Icon
                    name="question-circle"
                    type="font-awesome"
                    color="white"
                  />
                  <Text
                    style={{ color: Constants.COLOUR_WHITE, paddingLeft: 8 }}
                  >
                    {"Frequently Asked Questions"}
                  </Text>
                </View>
              ),
            }}
          />
        </Drawer.Navigator>
      );
    };

    return (
      <NavigationContainer>
        <MyDrawer />
        <CustomModal
          modalVisible={this.state.modalVisible}
          modalVisibleHandler={this.modalVisibleHandler}
          action={this.props.deleteAccountHandler}
          modalHeader={"Confirmation"}
          modalBody={
            "Are you sure you want to delete your account? \nAll of your progress will be deleted permanently."
          }
        />
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  drawerImage: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  drawerItem: {
    marginLeft: 15,
    marginTop: 25,
    fontSize: 22,
    fontWeight: "500",
    color: "black",
    flexDirection: "row",
  },
  drawerScreen: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  drawerItemText: {
    fontSize: 18.7,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18.7,
    letterSpacing: 0.33,
    color: "#1d1d26",
    padding: 10,
    marginLeft: 25,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    margin: 16,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, .87)",
  },
  iconContainer: {
    marginHorizontal: 16,
    width: 24,
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
});
