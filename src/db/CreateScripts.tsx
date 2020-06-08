import * as Constants from "constants/Constants";
import { openDatabase } from "expo-sqlite";
const db = openDatabase(Constants.DB_NAME);

/**
 *
 */
export const createArticles = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS articles (" +
            "articleId INTEGER PRIMARY KEY NOT NULL, " +
            "url TEXT DEFAULT '', " +
            "articleTitle TEXT DEFAULT '', " +
            "articleImage TEXT DEFAULT '', " +
            "insertTimestamp TEXT DEFAULT (datetime('now','localtime')) " +
            ");",
          [],
          (tx, success) => {
            // console.log("createArticles SUCCESS! = " + success);
            resolve(true);
          },
          (tx, error) => {
            // console.log("createArticles ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};

/**
 *
 */
export const setUpUserGoalTables = (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      await createUserGoal();
      // await createUserGoalSettings();
      await createUserGoalHistory();
      resolve(true);
    } catch (err) {}
  });
};

/**
 *
 */
export const createUserGoal = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS userGoal (" +
            "userGoalId INTEGER PRIMARY KEY NOT NULL, " +
            "userGoalDesc TEXT DEFAULT '', " +
            "userGoalActive BOOLEAN DEFAULT 0, " +
            "userGoalComplete BOOLEAN DEFAULT 0, " +
            "startTimestamp TEXT DEFAULT (datetime('now','localtime')), " +
            "endTimestamp TEXT DEFAULT '0000-00-00 00:00:00', " +
            "insertTimestamp TEXT DEFAULT (datetime('now','localtime')) " +
            ");",
          [],
          (tx, success) => {
            // console.log("createUserGoal SUCCESS! = " + success);
            resolve(true);
          },
          (tx, error) => {
            // console.log("createUserGoal ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};

/**
 *
 */
export const createCourtDateReminder = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS courtDateReminder (" +
            "courtDateReminderId INTEGER PRIMARY KEY NOT NULL, " +
            "courtDateReminderDesc TEXT DEFAULT '', " +
            "courtDateReminderActive BOOLEAN DEFAULT 0, " +
            "startTimestamp TEXT DEFAULT (datetime('now','localtime')), " +
            "endTimestamp TEXT DEFAULT '0000-00-00 00:00:00', " +
            "insertTimestamp TEXT DEFAULT (datetime('now','localtime')) " +
            ");",
          [],
          (tx, success) => {
            // console.log("createCourtDateReminder SUCCESS! = " + success);
            resolve(true);
          },
          (tx, error) => {
            // console.log("createCourtDateReminder ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};

/**
 *
 */
// export const createUserGoalSettings = (): Promise<boolean> => {
//   return new Promise((resolve, reject) => {
//     try {
//       db.transaction((tx) => {
//         tx.executeSql(
//           "CREATE TABLE IF NOT EXISTS userGoalSettings (" +
//             "userGoalSettingsId INTEGER PRIMARY KEY NOT NULL, " +
//             "userGoalId INT DEFAULT 0, " +
//             "userGoalDuration INT DEFAULT 0, " +
//             "userGoalFrequency INT DEFAULT 0, " +
//             "FOREIGN KEY(userGoalId) REFERENCES userGoal(userGoalId) " +
//             ");",
//           [],
//           (tx, success) => {
//             console.log("createUserGoalSettings SUCCESS! = " + success);
//             resolve(true);
//           },
//           (tx, error) => {
//             console.log("createUserGoalSettings ERROR! = " + error);
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
 */
export const createUserGoalHistory = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS userGoalHistory (" +
            "userGoalHistoryId INTEGER PRIMARY KEY NOT NULL, " +
            "userGoalId INT DEFAULT 0, " +
            "insertTimestamp TEXT DEFAULT (datetime('now','localtime')), " +
            "FOREIGN KEY(userGoalId) REFERENCES userGoal(userGoalId) " +
            ");",

          [],
          (tx, success) => {
            // console.log("createUserGoalHistory SUCCESS! = " + success);
            resolve(true);
          },
          (tx, error) => {
            // console.log("createUserGoalHistory ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};

/**
 *
 */
export const createSupportLink = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS supportLink (" +
            "supportLinkId INTEGER PRIMARY KEY NOT NULL, " +
            "supportLinkURL TEXT DEFAULT '', " +
            "supportLinkNumber INT DEFAULT 0, " +
            "supportLinkTitle TEXT DEFAULT '', " +
            "supportLinkDescription TEXT DEFAULT '', " +
            "supportLinkAdditionalURL TEXT DEFAULT '', " +
            "supportLinkAdditionalHeading TEXT DEFAULT '', " +
            "supportLinkImageURL TEXT DEFAULT '', " +
            "supportLinkImageFileName TEXT DEFAULT '', " +
            "insertTimestamp TEXT DEFAULT (datetime('now','localtime')) " +
            ");",
          [],
          (tx, success) => {
            // console.log("createSupportLink SUCCESS! = " + success);
            resolve(true);
          },
          (tx, error) => {
            // console.log("createSupportLink ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};

/**
 *
 */
export const createFrequentlyAskedQuestions = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS frequentlyAskedQuestions (" +
            "faqId INTEGER PRIMARY KEY NOT NULL, " +
            "faqQuestion TEXT DEFAULT '', " +
            "faqAnswer TEXT DEFAULT '', " +
            "insertTimestamp TEXT DEFAULT (datetime('now','localtime')) " +
            ");",
          [],
          (tx, success) => {
            // console.log("createFrequentlyAskedQuestions SUCCESS! = " + success);
            resolve(true);
          },
          (tx, error) => {
            // console.log("createFrequentlyAskedQuestions ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};

export const createCondition = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS condition (" +
            "conditionId INTEGER PRIMARY KEY NOT NULL, " +
            "userId INT NULL DEFAULT 1, " +
            "conditionNumber INT DEFAULT 0, " +
            "conditionSummary TEXT DEFAULT '', " +
            "conditionText TEXT DEFAULT '', " +
            "conditionSelected BOOLEAN DEFAULT 0, " +
            "conditionMandatory BOOLEAN DEFAULT 0, " +
            "FOREIGN KEY(userId) REFERENCES user(userId) " +
            ");",
          [],
          (tx, success) => {
            // console.log("createSupportLink SUCCESS! = " + success);
            resolve(true);
          },
          (tx, error) => {
            // console.log("createSupportLink ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};
