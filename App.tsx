import React, { Component } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import db from "db/User";
import styles from "styles/Styles";
import SplashScreen from "components/SplashScreen";
import UserSetupSwiper from "components/UserSetupSwiper";
import HomeDashboard from "components/HomeDashboard";
import CustomOnboarding from "components/CustomOnboarding";

// font-awesome icons = https://fontawesome.com/v4.7.0/icons/

export default class App extends Component {
  /****************************************************************************************************************************************************/
  // State Hooks: https://reactjs.org/docs/hooks-state.html
  state = {
    userLanding: <></>, // by default, we send the user to the home dashboard.
  };
  //"componentDidMount" will execute automatically before render()
  componentDidMount() {
    db.setUpUserTable();
    db.setUpConditionTable();
    this.checkUser();
  }

  //This function is only invoked when a user has successfully confirmed their details are all correct by pressing the "Yes" button upon confirmation.
  completeUserSetUp = () => {
    db.updateUserSetUp(); // We set the 'userSetUp' boolean in our table 'user' to true;
    this.checkUser(); // We now then check the 'userSetUp' value if it's true or false then render the proper components.
  };

  completeUserOnboarding = () => {
    db.updateUserOnboarding();
    this.checkUser();
  };

  //This will delete the whole "user" table. That means you will be able to mock up the registration process again and again
  deleteAccountHandler = () => {
    db.dropUser(); //delete user table.
    db.dropCondtion();
    db.setUpUserTable(); //set-up user table.
    db.setUpConditionTable();
    this.checkUser(); //check which component should the user see.
  };

  async checkUser() {
    let isUserAlreadySet = await db.checkUserSetUp();
    let isUserCompleteOnboarding = await db.checkUserOnboarding();

    if (isUserAlreadySet && isUserCompleteOnboarding) {
      this.setState({
        userLanding: [<SplashScreen key={0}/>,<HomeDashboard key={1} deleteAccountHandler={this.deleteAccountHandler} />] //prettier-ignore
      });
    } else if (isUserAlreadySet && !isUserCompleteOnboarding) {
      this.setState({
        userLanding: [<SplashScreen key={0}/>,<CustomOnboarding key={1} completeUserOnboarding={this.completeUserOnboarding} />] //prettier-ignore
      });
    } else {
      this.setState({
        userLanding: [<SplashScreen key={0}/>,<UserSetupSwiper key={1} action={this.completeUserSetUp} />] // prettier-ignore
      });
    }
  }

  /****************************************************************************************************************************************************/
  // The rendered component
  render() {
    return (
      <View style={styles.container}>
        {/* HELLO IM A NEW CHANGE  hellow*/}
        <SplashScreen />
        <StatusBar hidden />
        {this.state.userLanding}
      </View>
    );
  }
}
