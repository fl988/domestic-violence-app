import * as Constants from "constants/Constants";
import { openDatabase } from "expo-sqlite";
const db = openDatabase(Constants.DB_NAME);

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
            "insertTimestamp TEXT DEFAULT (datetime('now')) " +
            ");",
          [],
          (tx, success) => {
            console.log("createArticles SUCCESS! = " + success);
            resolve(true);
          },
          (tx, error) => {
            console.log("createArticles ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};

export const createUserGoal = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS userGoal (" +
            "userGoalId INTEGER PRIMARY KEY NOT NULL, " +
            "userGoalDesc TEXT DEFAULT '', " +
            "userGoalActive BOOLEAN DEFAULT 0, " +
            "insertTimestamp TEXT DEFAULT (datetime('now')) " +
            ");",
          [],
          (tx, success) => {
            console.log("createUserGoal SUCCESS! = " + success);
            resolve(true);
          },
          (tx, error) => {
            console.log("createUserGoal ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};

export const createUserGoalSettings = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS userGoalSettings (" +
            "userGoalSettingsId INTEGER PRIMARY KEY NOT NULL, " +
            "userGoalId INTEGER PRIMARY KEY NOT NULL, " +
            "userGoalDuration INT DEFAULT 0, " +
            "userGoalFrequency INT DEFAULT 0, " +
            "FOREIGN KEY(userGoalId) REFERENCES userGoal(userGoalId) " +
            ");",
          [],
          (tx, success) => {
            console.log("createUserGoalSettings SUCCESS! = " + success);
            resolve(true);
          },
          (tx, error) => {
            console.log("createUserGoalSettings ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};

export const createUserGoalHistory = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS userGoalHistory (" +
            "userGoalHistoryId INTEGER PRIMARY KEY NOT NULL, " +
            "userGoalId INTEGER PRIMARY KEY NOT NULL, " +
            "insertTimestamp TEXT DEFAULT (datetime('now')) " +
            "FOREIGN KEY(userGoalId) REFERENCES userGoal(userGoalId) " +
            ");",

          [],
          (tx, success) => {
            console.log("createUserGoalHistory SUCCESS! = " + success);
            resolve(true);
          },
          (tx, error) => {
            console.log("createUserGoalHistory ERROR! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};
