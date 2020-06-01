import * as Constants from "constants/Constants";
import { openDatabase } from "expo-sqlite";
const db = openDatabase(Constants.DB_NAME);

export const updateUserGoalById = (
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
            console.log("updateUserGoalById ERROR! = " + error);
            resolve(false);
            return null;
          }
        );
      });
    } catch (error) {}
  });
};
