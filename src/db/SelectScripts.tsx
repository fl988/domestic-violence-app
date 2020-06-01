import * as Constants from "constants/Constants";
import { openDatabase } from "expo-sqlite";
const db = openDatabase(Constants.DB_NAME);

export const grabAllArticles = (): Promise<SQLResultSet> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM articles;",
          [],
          (tx, rs) => {
            resolve(rs);
          },
          (tx, error) => {
            console.log("grabAllArticles ERROR! = " + error);
            resolve(null);
            return null;
          }
        );
      });
    } catch (error) {}
  });
};

export const grabSingleArticleByUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM articles WHERE url = ? ;",
          [url],
          (tx, rs) => {
            resolve(rs.rows.item(0).url == url);
          },
          (tx, error) => {
            console.log("grabAllArticles ERROR! = " + error);
            resolve(false);
            return null;
          }
        );
      });
    } catch (error) {}
  });
};

export const grabActiveUserGoal = (): Promise<SQLResultSet> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM userGoal WHERE userGoalActive = 1;",
          [],
          (txSuccess, rs) => {
            if (rs.rows.length > 0) {
              resolve(rs);
            } else {
              resolve(null);
            }
          },
          (txErr, error) => {
            console.log("grabUserGoal ERROR! = " + error);
            resolve(null);
            return null;
          }
        );
      });
    } catch (error) {}
  });
};

export const grabUserGoalById = (userGoalId: number): Promise<SQLResultSet> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM userGoal WHERE userGoalId = ?;",
          [userGoalId],
          (txSuccess, rs) => {
            if (rs.rows.length > 0) {
              resolve(rs);
            } else {
              resolve(null);
            }
          },
          (txErr, error) => {
            console.log("grabUserGoalById ERROR! = " + error);
            resolve(null);
            return null;
          }
        );
      });
    } catch (error) {}
  });
};
