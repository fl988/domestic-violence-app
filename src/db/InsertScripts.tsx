import * as Constants from "constants/Constants";
import { openDatabase } from "expo-sqlite";
const db = openDatabase(Constants.DB_NAME);

import {
  grabSingleArticleByUrl,
  grabSingleSupportLinkByUrl,
} from "db/SelectScripts";

/**
 *
 * @param url
 * @param articleTitle
 * @param articleImage
 */
export const insertArticles = (
  url: string,
  articleTitle: string,
  articleImage: string
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      let isAlreadyExist = await grabSingleArticleByUrl(url);
      await db.transaction(async (tx) => {
        if (!isAlreadyExist) {
          tx.executeSql(
            "INSERT INTO articles(url, articleTitle, articleImage) VALUES(?,?,?); ",
            [url, articleTitle, articleImage],
            (tx, success) => {
              resolve(true);
            },
            (tx, error) => {
              resolve(false);
              return false;
            }
          );
        }
      });
    } catch (error) {}
  });
};

/**
 *
 * @param userGoalDesc
 */
export const insertUserGoal = (userGoalDesc: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(async (tx) => {
        tx.executeSql(
          "INSERT INTO userGoal(userGoalDesc, userGoalActive) VALUES(?,?); ",
          [userGoalDesc, 1],
          async (tx, success) => {
            //success.insertId
            // await insertUserGoalSettings(success.insertId, 1, 1);
            resolve(true);
          },
          (tx, error) => {
            console.log("insertUserGoal ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};

// /**
//  *
//  * @param userGoalId
//  * @param userGoalDuration
//  * @param userGoalFrequency
//  */
// export const insertUserGoalSettings = (
//   userGoalId: number,
//   userGoalDuration: number,
//   userGoalFrequency: number
// ): Promise<boolean> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       db.transaction(async (tx) => {
//         tx.executeSql(
//           "INSERT INTO userGoalSettings(userGoalId, userGoalDuration, userGoalFrequency) VALUES(?,?,?); ",
//           [userGoalId, userGoalDuration, userGoalFrequency],
//           (tx, success) => {
//             resolve(true);
//           },
//           (tx, error) => {
//             console.log("insertUserGoal ERROR! = " + error);
//             resolve(false);
//             return false;
//           }
//         );
//       });
//     } catch (error) {}
//   });
// };

/**
 *
 * @param supportLinkURL the URL for the support service
 * @param supportLinkNumber the contact number for the support service
 * @param supportLinkTitle the main title of the support service
 * @param supportLinkDescription a brief description about the suport service
 * @param supportLinkAdditionalURL an additional link that relates to the support service if needed
 * @param supportLinkAdditionalHeading a heading title of the additional link
 * @param supportLinkImageURL the image URL of the support service
 * @param supportLinkImageFileName the file name of the image
 */
export const insertSupportLink = (
  supportLinkURL: string,
  supportLinkNumber: number,
  supportLinkTitle: string,
  supportLinkDescription: string,
  supportLinkAdditionalURL: string,
  supportLinkAdditionalHeading: string,
  supportLinkImageURL: string,
  supportLinkImageFileName: string
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      // We don't want duplicates.
      // So we first check if this supportLinkURL that is being saved is already existing in our table supportLink.
      
      db.transaction((tx) => {
        // if (!isAlreadyExist) {
          tx.executeSql(
            "INSERT INTO supportLink(" +
              "supportLinkURL, " +
              "supportLinkNumber, " +
              "supportLinkTitle, " +
              "supportLinkDescription, " +
              "supportLinkAdditionalURL, " +
              "supportLinkAdditionalHeading, " +
              "supportLinkImageURL, " +
              "supportLinkImageFileName) " +
              "VALUES(?,?,?,?,?,?,?,?); ",
            [
              supportLinkURL,
              supportLinkNumber,
              supportLinkTitle,
              supportLinkDescription,
              supportLinkAdditionalURL,
              supportLinkAdditionalHeading,
              supportLinkImageURL,
              supportLinkImageFileName,
            ],
            (tx, success) => {
              console.log("insertSupportLink SUCCESS!");
              resolve(true);
            },
            (tx, error) => {
              resolve(false);
              return false;
            }
          );
        // }
      });
    } catch (error) {}
  });
};

export const insertFrequentlyAskedQuestion = (
  faqQuestion: string,
  faqAnswer: string
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      // We don't want duplicates. So we check
      let isAlreadyExist = await grabSingleSupportLinkByUrl(faqQuestion);
      db.transaction(async (tx) => {
        if (!isAlreadyExist) {
          tx.executeSql(
            "INSERT INTO frequentlyAskedQuestions(" +
              "faqQuestion, " +
              "faqAnswer) " +
              "VALUES(?,?); ",
            [faqQuestion, faqAnswer],
            (tx, success) => {
              console.log("insertFrequentlyAskedQuestion SUCCESS!");
              resolve(true);
            },
            (tx, error) => {
              console.log(error);
              resolve(false);
              return false;
            }
          );
        }
      });
    } catch (error) {}
  });
};
