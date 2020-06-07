import * as Constants from "constants/Constants";
import { openDatabase } from "expo-sqlite";
const db = openDatabase(Constants.DB_NAME);

export const deleteUserGoal = (userGoalId: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE from userGoal WHERE userGoalId = ? ;",
          [userGoalId],
          async (tx, rs) => {
            // await deleteUserGoalSettings(userGoalId);
            resolve(true);
          },
          (tx, error) => {
            resolve(false);
            return false;
          }
        );
      });
    } catch (err) {}
  });
};

// export const deleteUserGoalSettings = (
//   userGoalId: number
// ): Promise<boolean> => {
//   return new Promise((resolve, reject) => {
//     try {
//       db.transaction((tx) => {
//         tx.executeSql(
//           "DELETE from userGoalSettings WHERE userGoalId = ? ;",
//           [userGoalId],
//           (trans, rs) => {
//             resolve(true);
//           },
//           (tx, error) => {
//             resolve(false);
//             return false;
//           }
//         );
//       });
//     } catch (err) {}
//   });
// };
