import { StatusBar, View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import * as Constants from "constants/Constants";

import { Button, Icon } from "react-native-elements";
import Onboarding from "react-native-onboarding-swiper";
import { Dimensions } from "react-native";

//images for tutorials
import { Onbording_first } from "images/Images";
import { Onbording_second } from "images/Images";
import { Onbording_third } from "images/Images";
import { Onbording_fourth } from "images/Images";
import { Onbording_fifth } from "images/Images";
import { Onbording_quick } from "images/Images";
import { Onbording_menu_home } from "images/Images";
import { Onboarding_menu_setting } from "images/Images";
import { Onboarding_menu_FAQ } from "images/Images";
import { Onboarding_Sample } from "images/Images";

const PAGE_HEIGHT = Dimensions.get("window").height;
const PAGE_WIDTH = Dimensions.get("window").width;

const CustomOnboarding = (props) => {
  const Square = ({ isLight, selected }) => {
    let backgroundColor;
    if (isLight) {
      backgroundColor = selected ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.3)";
    } else {
      backgroundColor = selected ? "#fff" : "rgba(255, 255, 255, 0.5)";
    }

    return <View style={{ width: 6, height: 6, marginHorizontal: 3, backgroundColor }}/> // prettier-ignore
  };

  const PAGES = [
    {
      title: (
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          Welcome !
        </Text>
      ),
      subtitle: (
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 15,
            textAlign: "center",
          }}
        >
          This will give you tutorial for using the App briefly
        </Text>
      ),
      backgroundColor: "#631C47",
      image: <View style = {{alignContent: 'center'}}><Text style = {{fontWeight: '900', fontSize: 45, color: "white", fontStyle: 'normal'}}> 
      YAVOS
    </Text></View>, // prettier-ignore
    },
    {
      title: "HomeDashboard",
      titleStyles: styles.head,
      backgroundColor: "#631C47",
      image: <Image style={styles.image} source={Onbording_first} />,
      subTitleStyles: styles.subtitle,
      subtitle:
        "This is the Home dashboard where you can find AVO information, Learning Modules, Support page, Goals and Articles of the day.",
    },
    {
      title: "My AVO",
      titleStyles: styles.head,
      backgroundColor: "#631C47",
      image: <Image style={styles.image} source={Onbording_second} />,
      subTitleStyles: styles.subtitle,
      subtitle: "You can check your AVO's condition in the page.",
    },
    {
      title: "Learning Module",
      titleStyles: styles.head,
      backgroundColor: "#631C47",
      image: <Image style={styles.image} source={Onbording_third} />,
      subTitleStyles: styles.subtitle,
      subtitle:
        'Learning Modules is here to help you better understad your "AVO".',
    },
    {
      title: "Support",
      titleStyles: styles.head,
      backgroundColor: "#631C47",
      image: <Image style={styles.image} source={Onbording_fourth} />,
      subTitleStyles: styles.subtitle,
      subtitle:
        "In the Support section, you will be able to see a list of support services who will be able to provide you help and valuable information. You can also visit their websites or call them directly.",
    },
    {
      title: "My Goals",
      titleStyles: styles.head,
      backgroundColor: "#631C47",
      image: <Image style={styles.image} source={Onbording_fifth} />,
      subTitleStyles: styles.subtitle,
      subtitle:
        'In "My Goals" section, here you will be able to set a goal for yourself. It will also display your goal histories such as completed and dropped goals.',
    },
    {
      title: "Quick Help",
      titleStyles: styles.head,
      backgroundColor: "#631C47",
      image: <Image style={styles.image} source={Onbording_quick} />,
      subTitleStyles: styles.subtitleSpecial,
      subtitle:
        'In Quick Help page, you can go back to where you had tutorials to get to know more about the app thorough "I need help with the app", you can also call 000 by using "I have an emergency" and you can go to support page where you can ask for help if you are experiencing homelessness by using "I am experiencing homelessness".',
    },
    {
      title: "Home in Hamburger menu",
      titleStyles: styles.head,
      backgroundColor: "#631C47",
      image: <Image style={styles.image} source={Onbording_menu_home} />,
      subTitleStyles: styles.subtitle,
      subtitle:
        "You can always go back to homedashboard by using home button in the hamburger menu.",
    },
    {
      title: "Settings in Hamburger menu",
      titleStyles: styles.head,
      backgroundColor: "#631C47",
      image: <Image style={styles.image} source={Onboarding_menu_setting} />,
      subTitleStyles: styles.subtitle,
      subtitle:
        "You can change your conditions of your AVO and your initials on the app in this settings page.",
    },
    {
      title: "FAQ in Hamburger menu",
      titleStyles: styles.head,
      backgroundColor: "#631C47",
      image: <Image style={styles.image} source={Onboarding_menu_FAQ} />,
      subTitleStyles: styles.subtitle,
      subtitle: "There is FAQ (Frequently Asked Questions) menu you can check.",
    },
    {
      title: "Sample AVO / Delete Account",
      titleStyles: styles.head,
      backgroundColor: "#631C47",
      image: <Image style={styles.image} source={Onboarding_Sample} />,
      subTitleStyles: styles.subtitle,
      subtitle:
        "It also has a function to delete your account and download a 'sample' of an AVO document online.",
    },

    {
      title: (
        <View>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 15,
              bottom: 20,
            }}
          >
            YAVOS is ready for you now !
          </Text>
        </View>
      ),
      subtitle: (
        <Button
          title="Get Started"
          onPress={() => {
            props.completeUserOnboarding();
            StatusBar.setBarStyle("default");
          }}
        />
      ),
      backgroundColor: "#631C47",
      image: <View style = {{alignContent: 'center'}}><Text style = {{fontWeight: '900', fontSize: 45, color: "white", fontStyle: 'normal'}}> 
      YAVOS
    </Text></View>, //prettier-ignore

      // <Icon name="rocket" type="font-awesome" size={100} color="white" /> // Icon has been taken out as we need to use text for logo
    },
  ];

  return (
    <Onboarding
      DotComponent={Square}
      // NextButtonComponent={Next}
      // SkipButtonComponent={Skip}
      // DoneButtonComponent={Done}
      showDone={false}
      onSkip={() => {
        props.completeUserOnboarding();
        StatusBar.setBarStyle("default");
      }}
      pages={PAGES}
    />
  );
};

export default CustomOnboarding;

const styles = StyleSheet.create({
  head: {
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
    position: "absolute",
    bottom: PAGE_HEIGHT / 2.3,
    fontSize: 20,
  },
  image: {
    width: PAGE_WIDTH / 1.6,
    height: PAGE_HEIGHT / 1.6,
    resizeMode: "contain",
    position: "absolute",
    top: -PAGE_HEIGHT / 2.8,
  },
  subtitle: {
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    position: "absolute",
    top: PAGE_HEIGHT / 5,
  },
  subtitleSpecial: {
    color: "white",
    textAlign: "center",
    alignSelf: "center",
    position: "absolute",
    top: PAGE_HEIGHT / 8,
  },
});
