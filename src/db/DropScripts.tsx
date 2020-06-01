import * as Constants from "constants/Constants";
import { openDatabase } from "expo-sqlite";
const db = openDatabase(Constants.DB_NAME);

//Only for testings. Delete later.
export const dropUserGoal = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "DROP TABLE IF EXISTS userGoal",
          [],
          (tx, success) => {
            console.log("dropUserGoal SUCCES!");
            resolve(true);
          },
          (tx, error) => {
            console.log("dropUserGoal ERRO! = " + error);
            resolve(false);
            return false;
          }
        );
      });
    } catch (error) {}
  });
};
