import * as Constants from "constants/Constants";
import * as Helper from "components/Helper";
import { openDatabase } from "expo-sqlite";
const db = openDatabase(Constants.DB_NAME);

export const updateUserGoalDescById = (
  userGoalDesc: string,
  userGoalId: number
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE userGoal SET userGoalDesc = ? WHERE userGoalId = ?;",
          [userGoalDesc, userGoalId],
          (tx, rs) => {
            resolve(true);
          },
          (tx, error) => {
            // console.log("updateUserGoalDescById ERROR! = " + error);
            resolve(false);
            return null;
          }
        );
      });
    } catch (error) {}
  });
};

export const updateUserGoalActiveById = (
  userGoalActive: boolean,
  userGoalComplete: boolean,
  userGoalId: number
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE userGoal SET userGoalActive = ?, userGoalComplete = ?, endTimestamp = (datetime('now')) WHERE userGoalId = ?;",
          [
            Helper.ctb(userGoalActive),
            Helper.ctb(userGoalComplete),
            userGoalId,
          ],
          (tx, rs) => {
            // console.log("SUCCESS!");
            resolve(true);
          },
          (tx, error) => {
            // console.log("updateUserGoalActiveById ERROR! = " + error);
            resolve(false);
            return null;
          }
        );
      });
    } catch (error) {}
  });
};
