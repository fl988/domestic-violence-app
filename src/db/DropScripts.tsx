import * as Constants from "constants/Constants";
import { openDatabase } from "expo-sqlite";
const db = openDatabase(Constants.DB_NAME);

//Only for testings. Delete later.
export const dropUserGoal = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "DROP TABLE IF EXISTS userGoal; ",
          [],
          (tx, success) => {
            // console.log("dropUserGoal SUCCES!");
            resolve(true);
          },
          (tx, error) => {
            // console.log("dropUserGoal ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};

/**
 * return Promise:boolean
 */
export const dropSupportLink = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "DROP TABLE IF EXISTS supportLink; ",
          [],
          (tx, success) => {
            // console.log("dropSupportLink SUCCES!");
            resolve(true);
          },
          (tx, error) => {
            // console.log("dropSupportLink ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};

/**
 * return Promise:boolean
 */
export const dropFrequentlyAskedQuestions = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "DROP TABLE IF EXISTS frequentlyAskedQuestions; ",
          [],
          (tx, success) => {
            // console.log("dropFrequentlyAskedQuestions SUCCES!");
            resolve(true);
          },
          (tx, error) => {
            // console.log("dropFrequentlyAskedQuestions ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};

/**
 * return Promise:boolean
 */
export const dropCourtDateReminder = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "DROP TABLE IF EXISTS courtDateReminder; ",
          [],
          (tx, success) => {
            // console.log("dropCourtDateReminder SUCCES!");
            resolve(true);
          },
          (tx, error) => {
            // console.log("dropCourtDateReminder ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};
