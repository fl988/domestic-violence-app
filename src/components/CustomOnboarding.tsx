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
      title: <Text style ={{color :'white', fontWeight: 'bold', fontSize: 25, marginBottom: 10, marginTop: -35,}}>Welcome !</Text>,
      subtitle: <Text style ={{color :'white', fontWeight: 'bold', fontSize: 15, margin: 10, textAlign: 'center'}}>This will give you tutorial for using the App briefly</Text>,
      backgroundColor: '#631C47',
      image: <View style = {{alignContent: 'center'}}><Text style = {{fontWeight: '900', fontSize: 45, color: "white", fontStyle: 'normal'}}> 
      YAVOS
    </Text></View> // prettier-ignore
      //<Icon name="hand-peace-o" type="font-awesome" size={100} color="white" /> taken out as we need text as logo
    },
    {
        // <View style={{ height : PAGE_HEIGHT / 2 }}>


      title: <View style={{ height : PAGE_HEIGHT / 15 }}><Text style ={styles.head}>HomeDashboard</Text></View>,
      backgroundColor: '#631C47',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onbording_first}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}> This is the Home dashboard where you can find AVO information, Learning Modules, Support page, Goals and Articles of the day.</Text>,

      //image: <Icon name="paper-plane-o" type="font-awesome" size={100} color="white" /> //prettier-ignore
    },
    {
      title: <View><Text style ={styles.head}>My AVO</Text></View>,
      backgroundColor: '#631C47',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onbording_second}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>You can check your AVO's condition in the page.</Text>,
    },
    {
      title: <View><Text style ={styles.head}>Learning Module</Text></View>,
      backgroundColor: '#631C47',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onbording_third}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>Learning Modules is here to help you better understad your "AVO".</Text>,
    },
    {
      title: <View><Text style ={styles.head}>Support</Text></View>,
      backgroundColor: '#631C47',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onbording_fourth}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>In the Support section, you will be able to see a list of support services who will be able to provide you help and valuable information. You can also visit their websites or call them directly.</Text>,
    },
    {
      title: <View><Text style ={styles.head}>My Goals</Text></View>,
      backgroundColor: '#631C47',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onbording_fifth}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>In "My Goals" section, here you will be able to set a goal for yourself. It will also display your goal histories such as completed and dropped goals.</Text>,
    },
    {
      title: <View><Text style ={[styles.head, {bottom: 500}]}>Quick Help</Text></View>,
      backgroundColor: '#631C47',
      image: <View>
                <Image 
                  style = {[styles.body, {}]}
                  source = {Onbording_quick}
                />
            </View>,
      subtitle: <Text style ={[styles.bottom, {marginBottom: -50}]}>In Quick Help page, you can go back to where you had tutorials to get to know more about the app thorough "I need help with the app", you can also call 000 by using "I have an emergency" and you can go to support page where you can ask for help if you are experiencing homelessness by using "I am experiencing homelessness". </Text>,
    },
    {
      title: <View><Text style ={styles.head}>Home in Hamburger menu</Text></View>,
      backgroundColor: '#631C47',
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
      backgroundColor: '#631C47',
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
      backgroundColor: '#631C47',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onboarding_menu_FAQ}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>There is FAQ (Frequently Asked Questions) menu you can check. </Text>,
    },
    {
      title: <View><Text style ={styles.head}>Sample AVO / Delete Account</Text></View>,
      backgroundColor: '#631C47',
      image: <View>
                <Image 
                  style = {styles.body}
                  source = {Onboarding_Sample}
                />
            </View>,
      subtitle: <Text style ={styles.bottom}>It also has a function to delete your account and download a 'sample' of an AVO document online. </Text>,
    },



    {
      title: <View><Text style = {{ color: 'white', fontWeight: 'bold', fontSize: 15, bottom: 20}}>YAVOS is ready for you now !</Text></View>,
      subtitle: (
        <Button
          title="Get Started"
          onPress={() => {
            props.completeUserOnboarding();
            StatusBar.setBarStyle("default");
          }}
        />
      ),
      backgroundColor: '#631C47',
      image: <View style = {{alignContent: 'center'}}><Text style = {{fontWeight: '900', fontSize: 45, color: "white", fontStyle: 'normal'}}> 
      YAVOS
    </Text></View> //prettier-ignore

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
    color :'white', 
    fontWeight: 'bold',
    fontSize: 30, 
    textAlign: 'center',
    bottom: 500,
  }, 
  body: {
    width: 300, 
    height: 400,
    bottom: -25, 
    resizeMode: 'contain',  
  },
  bottom: {
    color :'white', 
    fontWeight: 'bold', 
    fontSize: 17,
    bottom: 60,
    padding: 10,
    textAlign:"center"
  },

})

