import * as Constants from "constants/Constants";
import * as Helper from "components/Helper";
import { openDatabase } from "expo-sqlite";
const db = openDatabase(Constants.DB_NAME); //setUpUserGoalTables.
import {
  setUpUserGoalTables,
  createCondition,
  createSupportLink,
  createUserGoal,
  createFrequentlyAskedQuestions,
} from "db/CreateScripts";

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

/**
 *
 * @param url
 */
export const grabSingleArticleByUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT count(*) as count FROM articles WHERE url LIKE ? ;",
          [url],
          (tx, rs) => {
            console.log("rs.rows.item(0).count = " + rs.rows.item(0).count);
            if (rs.rows.item(0).count > 0) {
              console.log("WE GO SOME1");
              resolve(rs.rows.item(0).url == url);
            } else {
              console.log("WE GO SOME2 = " + url);
              resolve(false);
            }
          },
          (tx, error) => {
            console.log("grabSingleArticleByUrl ERROR! = " + error);
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
      db.transaction(
        // Initial transaction
        (tx) => {
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
              return true;
            }
          );
        },
        // If a transaction error happens on our initial transaction we then handle it here.
        async (tx) => {
          // TRANSACTION ERROR CAUGHT, WE NOW HANDLE IT, initializing setUpUserGoalTables()
          await setUpUserGoalTables();
          // The tables are now all setup but are all empty so we return null.
          resolve(null);
        }
      );
    } catch (error) {}
  });
};

/**
 * This will return the number of completed/dropped goals of user.
 * - Send 0 to return the number of dropped goals.
 * - Send 1 to return the number of completed goals.
 */
export const grabNumberOfCompletedOrDroppedGoals = (
  userGoalComplete: number
): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(
        // Initial transaction
        (tx) => {
          tx.executeSql(
            "SELECT count(*) as count FROM userGoal WHERE userGoalComplete = ? AND userGoalActive = 0;",
            [userGoalComplete],
            (txSuccess, rs) => {
              resolve(rs.rows.item(0).count);
            },
            (txErr, error) => {
              resolve(0);
              return true;
            }
          );
        },
        // If a transaction error happens on our initial transaction we then handle it here.
        async (tx) => {
          // TRANSACTION ERROR CAUGHT, WE NOW HANDLE IT, initializing setUpUserGoalTables()
          await setUpUserGoalTables();
          // The tables are now all setup but are all empty so we return null.
          resolve(null);
        }
      );
    } catch (error) {}
  });
};

export const grabCompletedOrDroppedGoals = (
  userGoalComplete: number
): Promise<SQLResultSet> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(
        // Initial transaction
        (tx) => {
          tx.executeSql(
            "SELECT userGoalId, userGoalDesc, date(startTimestamp) as startTimestamp FROM userGoal WHERE userGoalComplete = ? AND userGoalActive = 0;",
            [Helper.ctb(userGoalComplete)],
            (txSuccess, rs) => {
              resolve(rs);
            },
            (txErr, error) => {
              resolve(null);
              return true;
            }
          );
        },
        // If a transaction error happens on our initial transaction we then handle it here.
        async (tx) => {
          // TRANSACTION ERROR CAUGHT, WE NOW HANDLE IT, initializing setUpUserGoalTables()
          await setUpUserGoalTables();
          // The tables are now all setup but are all empty so we return null.
          resolve(null);
        }
      );
    } catch (error) {}
  });
};

interface completedOrDroppedGoalsObjStructure {
  userGoalId: number;
  userGoalDesc: string;
  startTimestamp: string;
}
export const formatGoalHistoryAsJSONObj = (
  rs: SQLResultSet
): Promise<completedOrDroppedGoalsObjStructure[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      let objArr = [];
      for (let x = 0; x < rs.rows.length; x++) {
        let i = rs.rows.item(x);
        let formatterDate = await grabReadableTimestamp(i.startTimestamp);
        objArr.push({
          userGoalId: i.userGoalId,
          userGoalDesc: i.userGoalDesc,
          startTimestamp: formatterDate,
        });
      }
      resolve(objArr);
    } catch (error) {}
  });
};

/**
 *
 * @param userGoalId
 */
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

// /**
//  *
//  * @param userGoalId
//  */
// export const grabUserGoalSettingsById = (
//   userGoalId: number
// ): Promise<SQLResultSet> => {
//   return new Promise((resolve, reject) => {
//     try {
//       let questionItemsArr = [];
//       db.transaction((tx) => {
//         tx.executeSql(
//           "SELECT * FROM userGoalSettings WHERE userGoalId = ?;",
//           [userGoalId],
//           (txSuccess, rs) => {
//             if (rs.rows.length > 0) {
//               resolve(rs);
//             } else {
//               resolve(null);
//             }
//           },
//           (txErr, error) => {
//             console.log("grabUserGoalById ERROR! = " + error);
//             resolve(null);
//             return null;
//           }
//         );
//       });
//     } catch (error) {}
//   });
// };

export const grabReadableTimestamp = (timestamp: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      let questionItemsArr = [];
      db.transaction(
        (tx) => {
          tx.executeSql(
            "SELECT " +
              "strftime('%d', ?) as day, " +
              "CASE strftime('%m', ?) " +
              "when '01' then 'January' when '02' then 'Febuary' when '03' then 'March' " +
              "when '04' then 'April' when '05' then 'May' when '06' then 'June' " +
              "when '07' then 'July' when '08' then 'August' when '09' then 'September' " +
              "when '10' then 'October' when '11' then 'November' when '12' then 'December' " +
              "else '' end as month, " +
              "strftime('%Y', ?) as year; ",
            [timestamp, timestamp, timestamp],
            (txSuccess, rs) => {
              let item = rs.rows.item(0);
              let result = item.day + " " + item.month + " " + item.year;
              resolve(result);
            },
            (txSuccess, err) => {
              console.log(err);
              return true;
            }
          );
        },
        async (tx) => {
          // TRANSACTION ERROR CAUGHT.
          // This means that this table is not exist. We create then create it.
          // await createUserGoal();
          resolve("");
        }
      );
    } catch (error) {}
  });
};

export const grabAllUserGoal = (): Promise<SQLResultSet> => {
  return new Promise((resolve, reject) => {
    try {
      let questionItemsArr = [];
      db.transaction(
        (tx) => {
          tx.executeSql("SELECT * FROM userGoal;", [], (txSuccess, rs) => {
            resolve(rs);
          });
        },
        async (tx) => {
          // TRANSACTION ERROR CAUGHT.
          // This means that this table is not exist. We create then create it.
          await createUserGoal();
          resolve(null);
        }
      );
    } catch (error) {}
  });
};

/**
 * Grabs all of the support links.
 */
export const grabSupportLinks = (): Promise<SQLResultSet> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(
        (tx) => {
          tx.executeSql("SELECT * FROM supportLink; ", [], (txSuccess, rs) => {
            // Resultset will be returned even there are no records.
            // We handle this empty table where ever we using this.
            resolve(rs);
          });
        },
        async (tx) => {
          // TRANSACTION ERROR CAUGHT.
          // This means that this table is not exist. We create then create it.
          await createSupportLink();
          resolve(null);
        }
      );
    } catch (error) {}
  });
};

/**
 *
 */
export const grabFrequentlyAskedQuestions = (): Promise<SQLResultSet> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "SELECT * FROM frequentlyAskedQuestions; ",
            [],
            (txSuccess, rs) => {
              // Resultset will be returned even there are no records.
              // We handle this empty table where ever we using this.
              resolve(rs);
            }
          );
        },
        async (tx) => {
          // TRANSACTION ERROR CAUGHT.
          // This means that this table is not exist. We create then create it.
          await createFrequentlyAskedQuestions();
          resolve(null);
        }
      );
    } catch (error) {}
  });
};

// We define the structure of our returning object data.
interface supportLinkObjStructure {
  supportLinkURL: string;
  supportLinkNumber: number;
  supportLinkTitle: string;
  supportLinkDescription: string;
  supportLinkImageURL: string;
  supportLinkAdditionalURL: string;
  supportLinkAdditionalHeading: string;
}
/**
 *
 * @param rs
 */
export const formatSupportLinkRS = (
  rs: SQLResultSet
): Promise<supportLinkObjStructure[]> => {
  return new Promise((resolve, reject) => {
    try {
      let objArr = [];
      for (let x = 0; x < rs.rows.length; x++) {
        let i = rs.rows.item(x);
        objArr.push({
          supportLinkURL: i.supportLinkURL,
          supportLinkNumber: i.supportLinkNumber,
          supportLinkTitle: i.supportLinkTitle,
          supportLinkDescription: i.supportLinkDescription,
          supportLinkImageURL: i.supportLinkImageURL,
          supportLinkAdditionalURL: i.supportLinkAdditionalURL,
          supportLinkAdditionalHeading: i.supportLinkAdditionalHeading,
        });
      }
      resolve(objArr);
    } catch (error) {}
  });
};

/**
 *
 * @param supportLinkURL
 */
export const grabSingleSupportLinkByUrl = (
  supportLinkURL: string
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT count(*) as count FROM supportLink WHERE supportLinkURL LIKE ? ;",
          [supportLinkURL],
          (tx, rs) => {
            if (rs.rows.item(0).count > 0) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (tx, error) => {
            console.log("grabSingleSupportLinkByUrl ERROR! = " + error);
            resolve(false);
            return null;
          }
        );
      });
    } catch (error) {}
  });
};

export const grabConditions = (): Promise<SQLResultSet> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(
        (tx) => {
          tx.executeSql("SELECT * FROM condition; ", [], (txSuccess, rs) => {
            // Resultset will be returned even there are no records.
            // We handle this empty table where ever we using this.
            resolve(rs);
          });
        },
        async (tx) => {
          // TRANSACTION ERROR CAUGHT.
          // This means that this table is not exist. We create then create it.
          await createCondition();
          resolve(null);
        }
      );
    } catch (error) {}
  });
};

/**
 * FOR DEBUGGING ONLY!
 * VERY HELPFUL THING HERE!
 * Wish I found this out earlier whilst debugging stuffs.
 * @param script
 */
export const debugPrintScript = (script: string): Promise<SQLResultSet> => {
  return new Promise((resolve, reject) => {
    try {
      let questionItemsArr = [];
      db.transaction(
        (tx) => {
          tx.executeSql(script, [], (txSuccess, rs) => {
            console.log("\n\n*************************");
            console.log("debugPrintScript");
            console.log(rs);
            resolve(rs);
          });
        },
        (tx) => {
          console.log("\n\n!!!!!!!!!!!!!!!!!!!!!!!!!");
          console.log("TRANSACTION ERROR CAUGHT, WE NOW HANDLE IT");
          console.log(tx);
          resolve(null);
        }
      );
    } catch (error) {}
  });
};
