import { Alert, StatusBar, Image, View } from "react-native";
import React from "react";

import { Button, Icon } from "react-native-elements";
import Onboarding from "react-native-onboarding-swiper";

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
      title: "Hey!",
      subtitle: "Welcome to the App!",
      backgroundColor: "#003c8f",
      image: <Icon name="hand-peace-o" type="font-awesome" size={100} color="white" /> // prettier-ignore
    },
    {
      title: "Send Messages",
      subtitle: "You can reach everybody with us",
      backgroundColor: "#003c8f",
      image: <Icon name="paper-plane-o" type="font-awesome" size={100} color="white" /> //prettier-ignore
    },
    {
      title: "Get Notified",
      subtitle: "We will send you notification as soon as something happened",
      backgroundColor: "#003c8f",
      image: <Icon name="bell-o" type="font-awesome" size={100} color="white" /> //prettier-ignore
    },
    {
      title: "That's Enough",
      subtitle: (
        <Button
          title="Get Started."
          onPress={() => {
            props.completeUserOnboarding();
            StatusBar.setBarStyle("default");
          }}
        />
      ),
      backgroundColor: "#003c8f",
      image: <Icon name="rocket" type="font-awesome" size={100} color="white" /> //prettier-ignore
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
