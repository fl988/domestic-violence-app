/****************************************************************************************************************************/
import { getStatusBarHeight } from "react-native-status-bar-height";
export const STATUS_BAR_HEIGHT = getStatusBarHeight();

/****************************************************************************************************************************/
// Can find the name of the colours here => https://abouts.co/color/2A1D59 <= just replace this with the colour hex code
export const COLOUR_PURPLE = "#2A1D59";
export const COLOUR_EBONY = "#101726";
export const COLOUR_WHITE = "#ffffff";
export const COLOUR_BLACK = "#000000";
export const COLOUR_TOPAZ = "#78738C";
export const COLOUR_EAST_BAY = "#3f4283";
export const COLOUR_WINE_BERRY = "#56203b";
export const COLOUR_DOVE_GRAY = "#707070";
export const COLOUR_DODGER_BLUE = "#2196f3";
export const COLOUR_FERN = "#5cb85c";
export const COLOUR_JELLY_BEAN = "#d9534f";
export const COLOUR_BOSSANOVA = "#522154";
export const COLOUR_TAWNY_PORT = "#5f1f4a";
export const COLOUR_CLARET = "#721937";

export const LINEAR_GRADIENT_MAIN = [
  COLOUR_BOSSANOVA,
  COLOUR_TAWNY_PORT,
  COLOUR_CLARET,
];

/****************************************************************************************************************************/
// AVO User Type Const
export const USER_TYPE_AVO_HOLDER = 1;
export const USER_TYPE_PARENT_GUARDIAN = 2;
export const USER_TYPE_LEARNING = 3;

// AVO User Type Description Const
export const userTypeDescArr = [
  "AVO Holder",
  "Parent / Guardian",
  "Just Learning",
];

/****************************************************************************************************************************/
// ****************
// Authentications
// This is the space ID. A space is like a project folder in Contentful terms
export const AUTH_SPACE_ID = "8a1dp1qg7h57";
// This is the access token for this space. Normally you get both ID and the token in the Contentful web app
export const AUTH_ACCESS_TOKEN_DELIVERY = "aqsalLuLaFvcM0PCg2qyxr94Phu_p_Y_yqLoqVgxV14"; // prettier-ignore
export const AUTH_ACCESS_TOKEN_PREVIEW = "yvMitd9RiQbd7wyIU3caPCkVRMvnGlWmid9GYkLtsgA"; // prettier-ignore

// Contents
export const CONT_CONDITIONS = "7frQjGWI7X3ZJ9969fXIiy";

/****************************************************************************************************************************/
// ****************
// Authentications
// This is the space ID. A space is like a project folder in Contentful terms
export const AUTH_PENTECH_SPACE_ID = "37vuyawjmcwg";

// This is the access token for this space. Normally you get both ID and the token in the Contentful web app
export const AUTH_PENTECH_ACCESS_TOKEN_DELIVERY = "pSgENeKWlgTIQVTnqGjamNNcVJuf1fOJZ9V-crbfTvA"; // prettier-ignore
export const AUTH_PENTECH_ACCESS_TOKEN_PREVIEW = "Xj_LZA_aUd_fhyLHZc6ZmSJJjP3sYqZB-0zbAFIPTTA"; // prettier-ignore

// AVO Condition Contents
export const CONT_PENTECH_CONDITIONS_ARR = [
  "5RAmZgEytS3Hzc3nuSoa45",
  "W4dC63lKeQS1tLjo2kRuq",
  "3zX1aeqP5ziKX8WUY29msi",
  "3tbeoJURsWRKrmlGPMIYpH",
  "4lpmBVCVEUF6OskTyJ6JJi",
  "5nDKjTDNVgtjZb8eF0cGfK",
  "5yX3P82zk8jBsS7J6bleQy",
  "g5eDYGsNPlYjeSdCem8eO",
  "772ta4XXnbvZjAWGdDS5m1",
  "Mpt8Pk4GwBBW8WZS0J9qN",
];

export const PENTECH_LEARNING_MODULES = {
  m1: [
    "7wE7hjJQD207nmNrNKSAZZ", //Module 1 (Parent node)
    "5OfLfUewAwuFp5uvyM42V3", //Module Quiz (1st child node)
    "3CUYkXJljrEwJ8rKWlWe4b", //Quiz question true or false (last child node)
    "6pW3OX8tiDQOyJ1TzAcmX0", //Quiz quesiont multi (last child node)
  ],
};

/****************************************************************************************************************************/
// Learning Modules
export const QTYPE_TRUE_OR_FALSE             = 1; // prettier-ignore
export const QTYPE_MULTIPLE_CHOICE           = 2; // prettier-ignore

/****************************************************************************************************************************/
// Home Screen
export const HOME_SCREEN_MAIN                = "Home Dashboard"; // prettier-ignore
export const HOME_SCREEN_MY_AVO              = "My AVO"; // prettier-ignore
export const HOME_SCREEN_LEARNING_MODULES    = "Learning Modules"; // prettier-ignore
export const HOME_SCREEN_INTERACTIVE_STORIES = "Interactive Stories"; // prettier-ignore
export const HOME_SCREEN_STATISTICS          = "Statistics"; // prettier-ignore
export const HOME_SCREEN_SUPPORT             = "Support"; // prettier-ignore
export const MODULE                          = "Module"; // prettier-ignore
export const QUIZZES                         = "Quizzes"; // prettier-ignore
