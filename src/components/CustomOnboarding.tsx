import { StatusBar, View, Text, Image, StyleSheet} from "react-native";
import React from "react";
import * as Constants from "constants/Constants";

import { Button, Icon } from "react-native-elements";
import Onboarding from "react-native-onboarding-swiper";
import {Dimensions} from "react-native"


//images for tutorials 
import { Onbording_first } from "images/Images";
import { Onbording_second } from "images/Images";
import { Onbording_third } from "images/Images";
import { Onbording_fourth } from "images/Images";
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
      title: <Text style ={{color :'white', fontWeight: 'bold', fontSize: 25, marginBottom: 10, marginTop: -35,}}>Hey!</Text>,
      subtitle: <Text style ={{color :'white', fontWeight: 'bold', fontSize: 15}}>WELCOME to Juvenile AVO APP</Text>,
      backgroundColor: '#101726',
      image: <View style = {{alignContent: 'center'}}><Icon name="hand-peace-o" type="font-awesome" size={100} color="white" /></View> // prettier-ignore
    },
    {
        // <View style={{ height : PAGE_HEIGHT / 2 }}>


      title: <View style={{ height : PAGE_HEIGHT / 15 }}><Text style ={styles.head}>HomeDashboard</Text></View>,
      backgroundColor: '#101726',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onbording_first}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>Homedashboard is where you can find AVO information, Learning Moduels, Support page and articles of the day.</Text>,

      //image: <Icon name="paper-plane-o" type="font-awesome" size={100} color="white" /> //prettier-ignore
    },
    {
      title: <View><Text style ={styles.head}>My AVO</Text></View>,
      backgroundColor: '#101726',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onbording_second}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>You can chekc your AVO's condition in the page</Text>,
    },
    {
      title: <View><Text style ={styles.head}>Learning Module</Text></View>,
      backgroundColor: '#101726',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onbording_third}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>Learning Module is made for that you have quizes to have better understading of AVO.</Text>,
    },
    {
      title: <View><Text style ={styles.head}>Support</Text></View>,
      backgroundColor: '#101726',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onbording_fourth}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>In Support page, you can see three different support pages you can ask help for and you can also visit thier site to have information and it has a function to call them directly on your own device.</Text>,
    },
    {
      title: <View><Text style ={[styles.head, {bottom: 520}]}>Quick Help</Text></View>,
      backgroundColor: '#101726',
      image: <View>
                <Image 
                  style = {[styles.body, {}]}
                  source = {Onbording_quick}
                />
            </View>,
      subtitle: <Text style ={[styles.bottom, {marginBottom: -60}]}>In Quick Help page, you can go back to where you had tutorials to get to know more about the app thorough "I need help with the app", you can also call 000 by using "I have an emergency" button and you can go to support page where you can ask for help if you are experiencing homeplesso or anything like that by using "I am experiencing homelessness" button. </Text>,
    },
    {
      title: <View><Text style ={styles.head}>Home in Hamburger menu</Text></View>,
      backgroundColor: '#101726',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onbording_menu_home}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>You can always go back to homedashboard by using home button in the hamburger menu.</Text>,
    },
    {
      title: <View><Text style ={styles.head}>Settings in Hamburger menu</Text></View>,
      backgroundColor: '#101726',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onboarding_menu_setting}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>You can change your conditions of your AVO and your initials on the app in this settings page. </Text>,
    },
    {
      title: <View><Text style ={styles.head}>FAQ in Hamburger menu</Text></View>,
      backgroundColor: '#101726',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onboarding_menu_FAQ}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>There is FAQ(Frequently Asked Questions) menu you can check. </Text>,
    },
    {
      title: <View><Text style ={styles.head}>Sample AVO and Delete Account</Text></View>,
      backgroundColor: '#101726',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onboarding_Sample}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>It also has a function to delete your account and download sample AVO from online </Text>,
    },



    {
      title: "That's Enough",
      subtitle: (
        <Button
          title="Get Started"
          onPress={() => {
            props.completeUserOnboarding();
            StatusBar.setBarStyle("default");
          }}
        />
      ),
      backgroundColor: '#101726',
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


const styles = StyleSheet.create({
  head: {
    color :'white', 
    fontWeight: 'bold',
    fontSize: 25, 
    textAlign: 'center',
    bottom: 500,
  }, 
  body: {
    width: 300, 
    height: 400,
    bottom: 10, 
    resizeMode: 'contain',  
  },
  bottom: {
    color :'white', 
    fontWeight: 'bold', 
    fontSize: 15,
    bottom: 80,
    padding: 10,
  },

})

