// import React, { Component } from "react";
import { Text } from "react-native";
import * as Constants from "constants/Constants";
import { openDatabase } from "expo-sqlite";
const db = openDatabase("dbUser1");

class User {
  /****************************************************************************************************************************************************/
  // START API CALLS
  // grabUserConditionsAPI() {
  //   // This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token. ie. the Conditions.
  //   // We then start building our own custom json object array.

  async fetchData(apiKey: String) {
    const contentful = require("contentful/dist/contentful.browser.min.js");
    const client = contentful.createClient({
      space: Constants.AUTH_PENTECH_SPACE_ID,
      accessToken: Constants.AUTH_PENTECH_ACCESS_TOKEN_DELIVERY,
    });

    return new Promise((resolve, reject) => {
      var conditionsArr = {};
      client
        .getEntry(apiKey)
        .then((entry) => {
          conditionsArr = {
            conditionNumber: entry.fields.conditionNumber,
            conditionSummary: entry.fields.conditionSummary,
            conditionText: entry.fields.conditionText,
            keyTerms: entry.fields.keyTerms,
          };

          resolve(conditionsArr);
        })
        .catch((err) => {
          console.log("fetchData ERROR = " + err);
          resolve(err);
        });
    });
  }

  async checkForLearningModules(apiKey: String[]) {
    console.log(apiKey);

    let [m1, m2] = await Promise.all([
      this.fetchModulePart1(apiKey[0]),
      this.fetchModulePart2(apiKey[1]),
    ]);

    return new Promise((resolve, reject) => {
      resolve(m2);
    });
  }

  async fetchModulePart1(apiKey: String) {
    const contentful = require("contentful/dist/contentful.browser.min.js");
    const client = contentful.createClient({
      space: Constants.AUTH_PENTECH_SPACE_ID,
      accessToken: Constants.AUTH_PENTECH_ACCESS_TOKEN_DELIVERY,
    });

    return new Promise((resolve, reject) => {
      var conditionsArr = {};
      client
        .getEntry(apiKey)
        .then((entry: Object) => {
          // conditionsArr = {} // TODO
          // console.log(entry.fields.moduleTitle);
          // console.log(entry.fields.moduleSummary);
          // console.log(entry.fields.moduleContent.content[0].content[0].value);
          // resolve(conditionsArr);
        })
        .catch((err) => {
          console.log("ERROR = " + err);
        });
    });
  }

  async fetchModulePart2(apiKey: String) {
    const contentful = require("contentful/dist/contentful.browser.min.js");
    const client = contentful.createClient({
      space: Constants.AUTH_PENTECH_SPACE_ID,
      accessToken: Constants.AUTH_PENTECH_ACCESS_TOKEN_DELIVERY,
    });

    return new Promise((resolve, reject) => {
      var conditionsArr = {};
      client
        .getEntry(apiKey)
        .then((entry) => {
          entry.fields.quizQuestions.map((v, i) => {
            if (typeof v.fields.questionStatement !== "undefined") {
              //True or False questions
              console.log("T OR F QUESTION");
              // console.log(v.fields.questionLabel);
              // console.log(v.fields.questionStatement);
              // console.log(v.fields.questionAnswer);
            } else {
              //Multiple Choie question
              console.log("MULTI C QUESTION");
              // console.log(v.fields.questionLabel);
              // console.log(v.fields.question);
              // console.log(v.fields.answer);
              // console.log(v.fields.answers); //array
              // console.log(v.fields.wrongAnswerSuggestion);
            }

            // console.log(JSON.stringify(v.fields));
          });
          // resolve(conditionsArr);
        })
        .catch((err) => {
          console.log("ERROR = " + err);
        });
    });
  }

  // END API CALLS

  /****************************************************************************************************************************************************/
  //Checks if a user has already done their personal set up. Returns a boolean;
  checkUserSetUp() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT userSetUp FROM user;",
            [],
            (trans, rs) => { resolve(rs.rows.item(0).userSetUp == true); }, // prettier-ignore
            (tx, error) => { resolve(false); return false;} // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Checks if a user has already gone through onboarding. Returns a boolean;
  checkUserOnboarding() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT completeOnboarding FROM user;",
            [],
            (trans, rs) => { resolve(rs.rows.item(0).completeOnboarding == true); }, // prettier-ignore
            (tx, error) => { resolve(false); return false; } // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Reads user's condition from 'user' table. Returns an array of conditions;
  grabUserConditionsAsArray(): Promise<boolean[]> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM user;",
            [],
            (trans, rs) => {
              let item = rs.rows.item(0);
              let conditionArr = [
                item.condition1,
                item.condition2,
                item.condition3,
                item.condition4,
                item.condition5,
                item.condition6,
                item.condition7,
                item.condition8,
                item.condition9,
                item.condition10,
                item.condition11,
              ];
              resolve(conditionArr);
            },
            (tx, error) => {
              console.log("error grabUserConditionsAsArray = " + error);
              return false;
            }
          );
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Reads data from 'user' table. Returns a resultset;
  grabUserDetails(): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM user;",
            [],
            (trans, rs) => { resolve(rs); }, // prettier-ignore
            (tx, error) => {
              console.log("error grabUserDetails = " + error);
              return false;
            }
          );
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Reads data from 'condition' table. Returns a resultset;
  grabConditionDetails(): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM condition;",
            [],
            (trans, rs) => { resolve(rs); }, // prettier-ignore
            (tx, error) => {
              console.log("error grabConditionDetails = " + error);
              return false;
            }
          );
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Reads data from 'condition' table. Returns a resultset;
  grabSingleConditionDetails(condNumber: number): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM condition where conditionNumber = ? ;",
            [condNumber],
            (trans, rs) => { resolve(rs); }, // prettier-ignore
            (tx, error) => {
              console.log("error grabConditionDetails = " + error);
              return false;
            }
          );
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Create Table 'user'. No return;
  createUser() {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS user (" +
            "id INTEGER PRIMARY KEY NOT NULL, " +
            "initials TEXT DEFAULT 'XX', " +
            "dob TEXT DEFAULT (datetime('now')), " +
            "userTypeId INT DEFAULT 0, " +
            "userSetUp BOOLEAN DEFAULT 0, " +
            "completeOnboarding BOOLEAN DEFAULT 0 " +
            ");",
          [],
          (tx, success) => {console.log("SUCCESS! = " + success)/* success */}, // prettier-ignore
          (tx, error) => { console.log("error createUser = " + error); return false; } // prettier-ignore
        );
      });
    } catch (error) {}
  }

  /****************************************************************************************************************************************************/
  //Create Table 'condition'. No return;
  createCondition() {
    console.log("CREATING CONDITION");
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS condition (" +
            "id INTEGER PRIMARY KEY NOT NULL, " +
            "conditionNumber INT DEFAULT 0, " +
            "conditionSummary TEXT DEFAULT '', " +
            "conditionText TEXT DEFAULT '', " +
            "conditionSelected BOOLEAN DEFAULT 0, " +
            "conditionMandatory BOOLEAN DEFAULT 0 " +
            ");",
          [],
          (tx, success) => {console.log("SUCCESS createCondition! = " + success)/* success */}, // prettier-ignore
          (tx, error) => { console.log("error createCondition = " + error); return false; } // prettier-ignore
        );
      });
    } catch (error) {}
  }

  /****************************************************************************************************************************************************/
  //Drops table 'user'. No return;
  dropUser() {
    try {
      db.transaction((tx) => {
        tx.executeSql("DROP TABLE IF EXISTS user");
      });
    } catch (error) {}
  }

  /****************************************************************************************************************************************************/
  //Drops table 'condition'. No return;
  dropCondtion() {
    try {
      db.transaction((tx) => {
        tx.executeSql("DROP TABLE IF EXISTS condition");
      });
    } catch (error) {}
  }

  /****************************************************************************************************************************************************/
  //Inserts a new record into 'user' table. No return;
  insertUserDefaultRecord() {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO " +
            " user(initials, dob, userTypeId) " +
            " VALUES('','','')",
          [],
          function(tx, success) {/* success */}, // prettier-ignore
          function (tx, error) {
            console.log("error insertUserDefaultRecord = " + error);
            return false;
          }
        );
      });
    } catch (err) {}
  }

  /****************************************************************************************************************************************************/
  //Inserts a new record into 'condition' table. No return;
  async insertConditionRecord(
    condNumber: number,
    condSummary: string,
    condText: string,
    conditionSelected: boolean,
    condMandatory: boolean
  ) {
    try {
      await db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO " +
            " condition(conditionNumber, conditionSummary, conditionText, conditionSelected, conditionMandatory) " +
            " VALUES(?,?,?,?,?)",
          [condNumber, condSummary, condText, conditionSelected, condMandatory],
          function(tx, success) {/* success */}, // prettier-ignore
          function (tx, error) {
            console.log("error insertConditionRecord");
            return false;
          }
        );
      });
    } catch (err) {}
  }

  async getConditionRecordCount() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql("SELECT * FROM condition;", [], (trans, rs) => {
            resolve(rs.rows.length);
          });
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Sets up the 'user' table for first timers.
  setUpUserTable() {
    try {
      db.transaction((txn) => {
        console.log("txn = " + txn);
        txn.executeSql(
          "SELECT * FROM user",
          [],
          (tx, rs) => {
            //console.log("item:", rs.rows.length);
            if (rs.rows.length == 0) {
              // No rows found on the 'user' table. We then drop if user table exist, create user table then insert a default record.
              this.dropUser();
              this.createUser();
              this.insertUserDefaultRecord();
            } else {
              //I think there is an sql bug where it duplicates records hence having more than 1 row. We delete them here.
              txn.executeSql("DELETE FROM user WHERE id > 1;", []);
            }
          },
          (tx, err) => {
            console.log(err);
            //This is 100% the error: => "no such table: user (code 1 SQLITE_ERROR[1]): , while compiling: SELECT * FROM user"
            //So to overcome this problem we'll have to create a "user" table then insert a default record.
            this.createUser();
            this.insertUserDefaultRecord();
            return false;
          }
        );
      });
    } catch (error) {}
  }

  /****************************************************************************************************************************************************/
  //Sets up the 'condition' table after doing an api call.
  setUpConditionTable() {
    try {
      db.transaction((txn) => {
        txn.executeSql(
          "SELECT * FROM condition",
          [],
          (tx, rs) => {
            if (rs.rows.length == 0) {
              this.dropCondtion();
              this.createCondition();
            }
          },
          (tx, err) => {
            console.log(err);
            //This is 100% the error: => "no such table: user (code 1 SQLITE_ERROR[1]): , while compiling: SELECT * FROM user"
            //So to overcome this problem we'll have to create a "user" table then insert a default record.
            this.createCondition();
            return false;
          }
        );
      });
    } catch (error) {}
  }

  /****************************************************************************************************************************************************/
  // Selects user's initials
  getUserInitials(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT initials FROM user;",
            [],
            (trans, rs) => { resolve(rs.rows.item(0).initials.toString()); }, // prettier-ignore
            (tx, error) => { resolve(""); return false; } // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  // grabUserDetails(): Promise<SQLResultSet> {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       db.transaction((tx) => {
  //         tx.executeSql(
  //           "SELECT * FROM user;",
  //           [],
  //           (trans, rs) => { resolve(rs); }, // prettier-ignore
  //           (tx, error) => {
  //             console.log("error grabUserDetails = " + error);
  //             return false;
  //           }
  //         );
  //       });
  //     } catch (error) {}
  //   });
  // }

  /****************************************************************************************************************************************************/
  // Update Statements

  // update 'user' initials, no return;
  updateUserInitials(v: String) {
    try {
      db.transaction((tx) => {
        tx.executeSql("UPDATE USER SET initials = ? WHERE id = 1;", [v]);
      });
    } catch (error) {}
  }
  // update 'user' dob, no return;
  updateUserDOB(v: String) {
    try {
      db.transaction((tx) => {
        tx.executeSql("UPDATE USER SET dob = ? WHERE id = 1;", [v]);
      });
    } catch (error) {}
  }
  // update 'user' userTypeId, no return;
  updateUserType(v: number) {
    try {
      db.transaction((tx) => {
        tx.executeSql("UPDATE USER SET userTypeId = ? WHERE id = 1;", [v]);
      });
    } catch (error) {}
  }

  // updates 'user' condition(s), no return;
  updateUserConditions(conditionNum: number, conditionValue: boolean) {
    // console.log(
    //   "conditionNum: " +
    //     conditionNum.toString() +
    //     " conditionValue: " +
    //     conditionValue
    // );
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE condition SET conditionSelected = ? WHERE conditionNumber = ?;",
          [!conditionValue, conditionNum]
          // function(tx, success) {console.log("updateUserConditions success: " + success);}, // prettier-ignore
          // function (tx, error) {console.log("updateUserConditions error: " + error);/* fail */ return false;} // prettier-ignore
        );
      });
    } catch (error) {}
  }

  // update 'user' userSetUp, no return;
  updateUserSetUp() {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE USER SET userSetUp = 1 WHERE id = 1;",
          [],
          function(tx, success) {/* success */}, // prettier-ignore
          function (tx, error) {/* fail */ return false;} // prettier-ignore
        );
      });
    } catch (error) {}
  }

  // update 'user' completeOnboarding, no return;
  updateUserOnboarding() {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE USER SET completeOnboarding = 1 WHERE id = 1;",
          [],
          function (tx, success) {
            /* success */
            console.log(success);
            return true;
          },
          function (tx, error) {
            /* fail */
            console.log(error);
            return false;
          }
        );
      });
    } catch (error) {}
  }

  /****************************************************************************************************************************************************/
  /****************************************************************************************************************************************************/
  /****************************************************************************************************************************************************/
  /****************************************************************** FOR DEBUGGINGS ******************************************************************/
  /****************************************************************************************************************************************************/
  /****************************************************************************************************************************************************/
  /****************************************************************************************************************************************************/
  //Create Table 'user'Type. No return;
  createUserType() {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS userType (id INTEGER PRIMARY KEY NOT NULL, userTypeId INT, description TEXT);"
        );
      });
    } catch (error) {}
  }

  grabUserDetailsOnConsole() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql("SELECT * FROM user;", [], (trans, rs) => {
            if (rs != null) {
              for (let x = 0; x < rs.rows.length; x++) {
                let item = rs.rows.item(x);
                console.log(item);
              }
            }
          });
        });
      } catch (error) {}
    });
  }

  grabConditionDetailsOnConsole() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql("SELECT * FROM condition;", [], (trans, rs) => {
            if (rs != null) {
              console.log("**************************************************");
              console.log(rs.rows.length);
              // for (let x = 0; x < rs.rows.length; x++) {
              //   let item = rs.rows.item(x);
              //   console.log(item);
              // }
            }
          });
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Reads data from 'user' table. Returns a number of rows/records.
  getUserTableRowCount(): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT count(*) as cnt FROM user;",
            [],
            (trans, rs) => {
              if (rs != null) {
                console.log("number of rows: " + rs.rows.item(0).cnt);
                resolve(rs);
              }
            }
          );
        });
      } catch (error) {}
    });
  }
}

const user = new User();
export default user;
