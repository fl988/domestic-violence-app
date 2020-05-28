import { StyleSheet, Dimensions } from "react-native";
import * as Constants from "constants/Constants";
const { width, height } = Dimensions.get("window");
const PAGE_HEIGHT = Dimensions.get("window").height;
const PAGE_WIDTH = Dimensions.get("window").width;

export default StyleSheet.create({
  /*************************************/
  // Colors
  bgPurple1: {
    backgroundColor: Constants.COLOUR_EBONY, //dark
  },
  bgPurple2: {
    backgroundColor: Constants.COLOUR_PURPLE, //purple header
  },
  /*************************************/

  /*************************************/
  navBackButton: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    flex: 1,
    marginTop: PAGE_HEIGHT / 1.2,
    width: PAGE_WIDTH / 1.2,
    position: "absolute",
  },
  screenDimension: {
    width,
    height,
    backgroundColor: Constants.COLOUR_EBONY,
  },
  screen: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "space-around",
    alignItems: "stretch",
  },
  container: {
    flex: 1,
  },
  splashScreenContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  buttonText: {
    textAlign: "center",
    margin: 10,
    color: Constants.COLOUR_WHITE,
    backgroundColor: "transparent",
  },
  whiteText: {
    textAlign: "center",
    margin: 10,
    color: Constants.COLOUR_WHITE,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: PAGE_WIDTH / 15,
    fontWeight: "bold",
    color: Constants.COLOUR_WHITE,
    backgroundColor: "transparent",
    textAlign: "center",
  },
  desc: {
    fontSize: PAGE_WIDTH / 24,
    color: Constants.COLOUR_WHITE,
    backgroundColor: "transparent",
    marginTop: 20,
    lineHeight: 25,
    textAlign: "center",
  },
  page: {
    width: PAGE_WIDTH,
    marginTop: 40,
  },
  card: {
    lineHeight: 30,
    paddingTop: 100,
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
    height: PAGE_HEIGHT / 3,
  },
  frame: {
    // position: "absolute",
    // left: 0,
    // bottom: 160,
    // borderRadius: (PAGE_WIDTH - 100) / 2,
    // margin: 50,
    // backgroundColor: Constants.COLOUR_WHITE,
    // paddingTop: 70,
  },
  innerFrame: {
    alignSelf: "center",
    width: PAGE_WIDTH / 1.2,
  },
  frameV2: {
    position: "absolute",
    left: 0,
    bottom: 110,
    // borderRadius: (PAGE_WIDTH - 100) / 2,
    height: PAGE_WIDTH - 20,
    width: PAGE_WIDTH,
    marginBottom: 50,
    // width: PAGE_WIDTH - 100,
    // margin: 50,
  },
  sectionStyle: {
    flexDirection: "row",
    margin: 15,
    height: 40,
    // borderColor: Constants.COLOUR_WHITE,
    borderRadius: 3,
    // backgroundColor: Constants.COLOUR_WHITE,
    // opacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: Constants.COLOUR_WHITE,
    borderRadius: 3,
    backgroundColor: Constants.COLOUR_WHITE,
    opacity: 0.5,
    justifyContent: "center",
    textAlign: "center",
  },
  input2: {
    color: Constants.COLOUR_WHITE,
    justifyContent: "center",
    textAlign: "center",
  },
  button: {
    backgroundColor: "rgba(0,0,0, 0.3)",
    position: "absolute",
    margin: 12,
    marginTop: 40,
    left: PAGE_WIDTH / 2 - 100,
    borderRadius: 50,
    alignItems: "center",
    bottom: 30,
  },
  nextBtnV2: {
    backgroundColor: "rgba(0,0,0, 0.3)",
    margin: 12,
    marginTop: 40,
    borderRadius: 50,
    alignItems: "center",
    bottom: 30,
  },
  nextBtn: {
    backgroundColor: "rgba(0,0,0, 0)",
    margin: 12,
    marginTop: 40,
    borderRadius: 50,
    alignItems: "center",
    bottom: 30,
  },
  userTypeBtn: {
    margin: 15,
    height: 45,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  // buttonText: {
  //   margin: 15,
  //   marginLeft: 50,
  //   marginRight: 40,
  //   color: Constants.COLOUR_WHITE,
  //   fontSize: 14,
  // },
  photo: {
    flex: 1,
    borderRadius: (PAGE_WIDTH - 100) / 2,
  },

  /*************************************/
  // MODAL STYLE
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
  bodyText: {},
  modalTitle: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    color: "#000",
  },
  modal: {
    backgroundColor: "#00000099",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#f9fafb",
    width: "80%",
    borderRadius: 5,
  },
  modalHeader: {},
  modalBody: {
    backgroundColor: Constants.COLOUR_WHITE,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalFooter: {},
  actions: {
    borderRadius: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  actionText: {
    color: Constants.COLOUR_WHITE,
  },
  /*************************************/

  /*************************************/
  //Accordion Styles
  accordionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  accordionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 46,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems: "center",
    backgroundColor: "rgb(255,255,255)", //Charcoal
  },
  accordionParentHr: {
    height: 1,
    color: Constants.COLOUR_WHITE,
    width: "100%",
  },
  accordionChild: {
    backgroundColor: Constants.COLOUR_WHITE, //Light grey
    opacity: 0.9,
    padding: 16,
  },
  font: {},

  /*************************************/

  /*************************************/
  // Learning Modules Page Stylings
  learningModuleItem: {
    // flex: 1, //this will fill out the remaining spaces, don't need it for now.
    display: "flex",
    flexDirection: "row",
    margin: 8,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: Constants.COLOUR_TOPAZ, //"rgba(255,255,255, 0.3)",
    borderRadius: 8,
    height: PAGE_HEIGHT / 11,
    width: PAGE_WIDTH / 1.15,
  },
  learningModuleItemLeft: {
    flex: 1,
  },
  learningModuleItemBody: {
    flexGrow: 4,
  },
  learningModuleItemBodyContents: {
    flex: 1,
    flexDirection: "row",
  },
  homeDashboardEngageItems: {
    // flex: 1, //this will fill out the remaining spaces, don't need it for now.
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 24,
    marginBottom: 24,
    backgroundColor: Constants.COLOUR_EAST_BAY, //"rgba(255,255,255, 0.3)",
    borderRadius: 24,
    justifyContent: "center",
    height: PAGE_WIDTH / 2 - 36,
    width: PAGE_WIDTH / 2 - 36, // Page width / 2 then we take the margin into consideration which in this case is on the left. We want 3 of them which is 12 * 3 = 36.
    // height: PAGE_HEIGHT / 8,
    // width: PAGE_HEIGHT / 4.8,
  },
  homeDashboardArticleItem: {
    // flex: 1, //this will fill out the remaining spaces, don't need it for now.
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 24,
    marginBottom: 24,
    backgroundColor: Constants.COLOUR_EAST_BAY, //"rgba(255,255,255, 0.3)",
    borderRadius: 8,
    justifyContent: "center",
    height: PAGE_WIDTH / 2 - 36,
    width: PAGE_WIDTH - 48, // Page width / 2 then we take the margin into consideration which in this case is on the left. We want 3 of them which is 12 * 3 = 36.
    // height: PAGE_HEIGHT / 8,
    // width: PAGE_HEIGHT / 4.8,
  },
  homeDashboardGreeterContainer: {
    // flex: 1, //this will fill out the remaining spaces, don't need it for now.
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: Constants.COLOUR_EAST_BAY, //"rgba(255,255,255, 0.3)",
    justifyContent: "center",
    height: PAGE_WIDTH / 2 - 36,
    width: PAGE_WIDTH, // Page width / 2 then we take the margin into consideration which in this case is on the left. We want 3 of them which is 12 * 3 = 36.
    // height: PAGE_HEIGHT / 8,
    // width: PAGE_HEIGHT / 4.8,
  },
  homeDashboardHeading: {
    paddingBottom: 10,
    width: "100%",
  },
  homeDashboardGreeterLeftContent: {
    borderRightColor: "white",
    borderRightWidth: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  homeDashboardGreeterRightContent: {
    flex: 2,
  },
  lmText: {
    color: Constants.COLOUR_WHITE,
    fontSize: 15,
  },
  homeDashboardHeader: {
    color: Constants.COLOUR_WHITE,
    marginLeft: 12,
    marginBottom: 12,
    fontWeight: "bold",
  },
  homeDashboardContent: {
    color: Constants.COLOUR_WHITE,
    paddingTop: 8,
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center",
  },

  //learning module page 2
  learningModulePageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  learningModulePageContent: {
    // flex: 1, //this will fill out the remaining spaces, don't need it for now.
    marginTop: 12,
    marginRight: 24,
    marginLeft: 24,
    borderRadius: 8,
    height: PAGE_HEIGHT / 1.2,
    width: PAGE_WIDTH - 36, // Page width / 2 then we take the margin into consideration which in this case is on the left. We want 3 of them which is 12 * 3 = 36.
    backgroundColor: Constants.COLOUR_EAST_BAY, //"rgba(255,255,255, 0.3)",
  },
  learningModulePageHeader: {
    color: Constants.COLOUR_WHITE,
    paddingTop: 16,
    paddingLeft: 16,
    paddingBottom: 16,
    fontSize: 21,
    fontWeight: "bold",
    // alignSelf: "flex-start",
    // justifyContent: "flex-start",
  },
  learningModulePageBody: {
    color: Constants.COLOUR_WHITE,
    fontSize: 18,
    // textAlign: "justify",
    lineHeight: 30,
    paddingTop: 8,
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
    // alignSelf: "flex-start",
    // justifyContent: "space-between",
    borderTopColor: "black",
    borderTopWidth: 1,
    // textAlign: "justify",
  },
  learningModulePageButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: Constants.COLOUR_TOPAZ, //"rgba(255,255,255, 0.3)",
    borderRadius: 8,
    height: PAGE_HEIGHT / 11,
    width: PAGE_WIDTH / 1.15,
  },

  // Question
  quizzesPageContainer: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  quizzesPageContent: {
    // flex: 1, //this will fill out the remaining spaces, don't need it for now.
    flex: 1,
    marginTop: 12,
    borderRadius: 8,
    height: "auto",
    width: PAGE_WIDTH - 36, // Page width / 2 then we take the margin into consideration which in this case is on the left. We want 3 of them which is 12 * 3 = 36.
    backgroundColor: Constants.COLOUR_EAST_BAY, //"rgba(255,255,255, 0.3)",
  },
  learningModulePageContainer2: {
    marginTop: 12,
    borderRadius: 8,
    height: "auto",
    width: PAGE_WIDTH - 36,
    backgroundColor: Constants.COLOUR_EAST_BAY,
  },
  learningModulePageContent2: {
    display: "flex",
    flexDirection: "row",
    margin: 8,
  },
  quizzesPageHeader: {
    color: Constants.COLOUR_WHITE,
    paddingTop: 16,
    paddingLeft: 16,
    paddingBottom: 16,
    fontSize: PAGE_WIDTH / 18,
    fontWeight: "bold",
    // alignSelf: "flex-start",
    // justifyContent: "flex-start",
  },
  quizzesPageBody: {
    color: Constants.COLOUR_WHITE,
    fontSize: PAGE_WIDTH / 21,
    // textAlign: "justify",
    lineHeight: 30,
    paddingTop: 8,
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
    // alignSelf: "flex-start",
    // justifyContent: "space-between",
    // borderTopColor: "black",
    // borderTopWidth: 1,
    // textAlign: "justify",
  },
  textFormatCentre: {
    color: Constants.COLOUR_WHITE,
    fontSize: PAGE_WIDTH / 21,
    lineHeight: 30,
    textAlign: "center",
  },
  /*************************************/

  /*************************************/
  // Left, Header, Right components (react-native-elements)
  rneHeaderBody: {
    color: Constants.COLOUR_TOPAZ,
    fontWeight: "bold",
  },
  rneContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  rneContentHomeDashboard: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  /*************************************/

  /*************************************/
  // Drawer |
  gaugeText: {
    fontSize: 10,
    textAlign: "center",
    color: Constants.COLOUR_WHITE,
    fontWeight: "bold",
  },
  /*************************************/

  /*************************************/
  /*************************************/
});
