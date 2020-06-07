/****************************************************************************************************************************/
//DB
export const DB_NAME = "dbUser38";

/****************************************************************************************************************************/
import { getStatusBarHeight } from "react-native-status-bar-height";
export const STATUS_BAR_HEIGHT = getStatusBarHeight();

/****************************************************************************************************************************/
// Can find the name of the colours here => https://abouts.co/color/2A1D59 <= just replace this with the colour hex code
export const COLOUR_SMALT = "#003c8f";
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

export const USER_TYPE_DESC_AVO_HOLDER = "AVO Holder";
export const USER_TYPE_DESC_PARENT_AND_GUARDIAN = "Parent / Guardian";
export const USER_TYPE_DESC_JUST_LEARNING = "Just Learning";

// AVO User Type Description Const
export const userTypeDescArr = [
  USER_TYPE_DESC_AVO_HOLDER,
  USER_TYPE_DESC_PARENT_AND_GUARDIAN,
  USER_TYPE_DESC_JUST_LEARNING,
];

/****************************************************************************************************************************/
// Goal Settings
export const GOAL_SETTINGS_DURATION = [1, 2, 3, 4, 5, 6, 7]; //in days
export const GOAL_SETTINGS_FREQUENCY = ["Daily", "Weekly"]; // 1:Daily, 2:Weekly

/****************************************************************************************************************************/
// ****************
// Authentications
// This is the space ID. A space is like a project folder in Contentful terms
export const AUTH_PENTECH_SPACE_ID = "37vuyawjmcwg";

// This is the access token for this space. Normally you get both ID and the token in the Contentful web app
export const AUTH_PENTECH_ACCESS_TOKEN_DELIVERY = "pSgENeKWlgTIQVTnqGjamNNcVJuf1fOJZ9V-crbfTvA"; // prettier-ignore
export const AUTH_PENTECH_ACCESS_TOKEN_PREVIEW = "Xj_LZA_aUd_fhyLHZc6ZmSJJjP3sYqZB-0zbAFIPTTA"; // prettier-ignore

//
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

/****************************************************************************************************************************/
// Learning Modules
export const QTYPE_TRUE_OR_FALSE             = 1; // prettier-ignore
export const QTYPE_MULTIPLE_CHOICE           = 2; // prettier-ignore

/****************************************************************************************************************************/
// Home Screen
export const HOME_SCREEN_MAIN                = "Home Dashboard"; // prettier-ignore
export const HOME_SCREEN_MY_AVO              = "My AVO"; // prettier-ignore
export const HOME_SCREEN_LEARNING_MODULES    = "Learning Modules"; // prettier-ignore
// export const HOME_SCREEN_INTERACTIVE_STORIES = "Interactive Stories"; // prettier-ignore
// export const HOME_SCREEN_STATISTICS          = "Statistics"; // prettier-ignore
export const HOME_SCREEN_SUPPORT             = "Support"; // prettier-ignore
export const HOME_SCREEN_GOALS               = "My Goals"; // prettier-ignore
export const LEFT_NAV_HOME                   = "Home"; // prettier-ignore
export const LEFT_NAV_SETTINGS               = "Settings"; // prettier-ignore
export const LEFT_NAV_FAQ                    = "FAQ"; // prettier-ignore
export const LEFT_NAV_PDF_VIEW_AVO           = "PDFViewAVO"; // prettier-ignore
export const LEFT_NAV_GOAL_SETTINGS          = "Goal Settings"; // prettier-ignore
export const GOAL_CREATE                     = "Set a Goal"; // prettier-ignore
export const GOAL_EDIT                       = "Edit Goal"; // prettier-ignore
export const GOAL_VIEW_HISTORY               = "View Goal History"; // prettier-ignore
export const MODULE                          = "Module"; // prettier-ignore
export const QUIZZES                         = "Quizzes"; // prettier-ignore
