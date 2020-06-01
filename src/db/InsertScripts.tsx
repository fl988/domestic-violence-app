import * as Constants from "constants/Constants";
import { openDatabase } from "expo-sqlite";
const db = openDatabase(Constants.DB_NAME);

import { grabSingleArticleByUrl } from "db/SelectScripts";

export const insertArticles = (
  url: string,
  articleTitle: string,
  articleImage: string
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(async (tx) => {
        let isAlreadyExist = await grabSingleArticleByUrl(url);
        if (!isAlreadyExist) {
          tx.executeSql(
            "INSERT INTO articles(url, articleTitle, articleImage)" +
              "VALUES(?,?,?); ",
            [url, articleTitle, articleImage],
            (tx, success) => {
              console.log("insertArticles SUCCESS! = " + success);
              resolve(true);
            },
            (tx, error) => {
              console.log("insertArticles ERROR! = " + error);
              resolve(false);
              return false;
            }
          );
        }
      });
    } catch (error) {}
  });
};

export const insertUserGoal = (userGoalDesc: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction(async (tx) => {
        tx.executeSql(
          "INSERT INTO userGoal(userGoalDesc, userGoalActive) VALUES(?,?); ",
          [userGoalDesc, 1],
          (tx, success) => {
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
