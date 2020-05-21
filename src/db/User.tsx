// import React, { Component } from "react";
import { Text, RecyclerViewBackedScrollView } from "react-native";
import * as Constants from "constants/Constants";
import { openDatabase } from "expo-sqlite";
import { ContentfulClient, ContentfulProvider } from "react-contentful";
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

  /****************************************************************************************************************************************************/
  // START LEARNING MODULES

  // INSERT STATEMENTS
  insertLearningModules(
    moduleTitle: string,
    moduleSummary: string,
    moduleContent: string,
    quizTopic: string
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          console.log("ACTUAL START");
          tx.executeSql(
            "INSERT INTO " +
              " learningModules(moduleTitle, moduleSummary, moduleContent, quizTopic) " +
              " VALUES(?,?,?,?)",
            [moduleTitle, moduleSummary, moduleContent, quizTopic],
            (tx, rs) => {
              console.log("SUCCESS insertLearningModules INSERT");
            },
            (tx, err) => {
              console.log("err insertLearningModules INSERT: " + err);
              return false;
            }
          );

          tx.executeSql(
            "SELECT * FROM learningModules ORDER BY learningModuleId DESC LIMIT 1;",
            [],
            (tx, rs) => {
              console.log(
                "DATA INSERT ARE = " + rs.rows.item(0).learningModuleId
              );
              resolve(rs.rows.item(0).learningModuleId);
            },
            (tx, err) => {
              console.log(
                "DATA INSERT insertLearningModuleRecord FAIL = " + err
              );
              return false;
            }
          );
        });
      } catch (err) {}
    });
  }

  insertQuestion(
    learningModuleId: number,
    qType: number,
    questionLabel: string,
    questionStatement: string,
    questionAnswer: string,
    question: string,
    answer: string
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        let thisQuestion = questionStatement, thisAnswer = questionAnswer; //prettier-ignore
        let questionField = "questionStatement", answerField = "questionAnswer"; //prettier-ignore
        if (questionStatement == "") {
          thisQuestion = question;
          thisAnswer = answer;
          questionField = "question";
          answerField = "answer";
        }

        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO " +
              " questions(learningModuleId, qType, questionLabel, " + questionField + ", " + answerField + ") " +
              " VALUES(?,?,?,?,?)",
            [learningModuleId, qType, questionLabel, thisQuestion, thisAnswer],
            function(tx, success) { console.log("insertQuestion SUCCESS!") /* success */}, // prettier-ignore
            function (tx, error) {
              console.log("error insertConditionRecord");
              return false;
            }
          ); //prettier-ignore

          tx.executeSql(
            "SELECT * FROM questions where learningModuleId = ? and qType = ? ORDER BY questionId DESC LIMIT 1;",
            [learningModuleId, qType],
            (tx, rs) => {
              resolve(rs.rows.item(0).questionId);
            },
            (tx, err) => {
              return false;
            }
          );
        });
      } catch (err) {}
    });
  }

  insertAnswers(
    questionId: number,
    qType: number,
    answer: string
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO " +
              " answers(questionId, qType, answer) " +
              " VALUES(?,?,?)",
            [questionId, qType, answer],
            (tx, rs) => { console.log("insertAnswers SUCCESS!")}, // prettier-ignore
            (tx, err) => {
              console.log("insertAnswers FAIL!: " + err);
              return false;
            }
          );

          tx.executeSql(
            "SELECT * FROM answers where questionId = ? and qType = ? ORDER BY answerId DESC LIMIT 1;",
            [questionId, qType],
            (tx, rs) => {
              resolve(rs.rows.item(0).answerId);
            },
            (tx, err) => {
              return false;
            }
          );
        });
      } catch (err) {}
    });
  }

  // SELECT STATEMENT
  checkForLearningModuleData() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM learningModules;",
            [],
            (trans, rs) => {console.log("learningModules exist "+ (rs.rows.length > 0 ? "" : "but EMPTY! ") +": " + rs.rows.length); resolve(rs.rows.length > 0); }, // prettier-ignore
            (tx, error) => {console.log("learningModules does NOT EXIST!."); resolve(false); return false;} // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  grabAllLearningModulesData(): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM learningModules;",
            [],
            (trans, rs) => { resolve(rs); }, // prettier-ignore
            (tx, error) => {console.log("learningModules does NOT EXIST!."); return false;} // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  grabLearningModuleQuestionsById(
    learningModuleId: number
  ): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM learningModules lm JOIN questions q ON lm.learningModuleId = q.learningModuleId " +
              "WHERE lm.learningModuleId = ? ;",
            [learningModuleId],
            (trans, rs) => { resolve(rs); }, // prettier-ignore
            (tx, error) => {console.log("either learningModules or questions does NOT EXIST!."); return false;} // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  async fetchLearningModulesData() {
    try {
      console.log("---- No learning modules data found. ----") //prettier-ignore
      console.log("---- fetching new learning modules from contentful");

      const contentful = require("contentful/dist/contentful.browser.min.js");
      const client = contentful.createClient({
        space: Constants.AUTH_PENTECH_SPACE_ID,
        accessToken: Constants.AUTH_PENTECH_ACCESS_TOKEN_DELIVERY,
      });

      let jsonArr = [];
      let jsonObj = {};
      await client
        .getEntries() //grab all of the entries
        .then((res) => {
          //we'll loop through each entry
          res.items.forEach((element) => {
            let item = element.fields;

            if (typeof item.moduleTitle !== "undefined") {
              // we found a module.
              // we can only use these => moduleTitle,moduleSummary

              // BUILD QUESTIONS
              let quizzesArr = [];
              item.moduleQuiz.fields.quizQuestions.forEach((qe) => {
                //question element
                let quizObj = {};
                if (typeof qe.fields.questionAnswer !== "undefined") {
                  //it's a T or F type of question.
                  quizObj = {
                    qType: 1,
                    questionLable: qe.fields.questionLabel,
                    questionStatement: qe.fields.questionStatement,
                    questionAnswer: qe.fields.questionAnswer,
                  };
                } else {
                  //it's a multiple choice type of question.
                  let answerArr = [];
                  qe.fields.answers.forEach((ae, i) => {
                    answerArr.push(ae);
                  });

                  quizObj = {
                    qType: 2,
                    questionLable: qe.fields.questionLabel,
                    question: qe.fields.question,
                    answer: qe.fields.answer,
                    answers: answerArr,
                  };
                }
                quizzesArr.push(quizObj);
              });

              jsonObj = {
                moduleTitle: item.moduleTitle,
                moduleSummary: item.moduleSummary,
                moduleContent: item.moduleContent.content[0].content[0].value,
                quizTopic: item.moduleQuiz.fields.quizTopic,
                quizzes: quizzesArr,
              };
              jsonArr.push(jsonObj);
            }
          });
        })
        .catch(console.error);

      return JSON.stringify(jsonArr);
    } catch (error) {}
  }

  saveLearningModulesData(jsonData: any) {
    return new Promise(async (resolve, reject) => {
      console.log( "---- saving new learning modules from contentful into mysql" ); //prettier-ignore
      // console.log(jsonData);
      try {
        //Loop through Modules
        let jd = jsonData;
        for (let x = 0; x < jd.length; x++) {
          let learningModuleId: number = await this.insertLearningModules(
            jd[x].moduleTitle,
            jd[x].moduleSummary,
            jd[x].moduleContent,
            jd[x].quizTopic
          );

          //Loop through Questions
          let qs = jd[x].quizzes;
          console.log(jd[x].moduleTitle + " has a total of " + qs.length + " quizzes.") //prettier-ignore
          for (let y = 0; y < qs.length; y++) {
            let questionId: number = 0;
            if (qs[y].qType == 1) {
              //T or F question type
              questionId = await this.insertQuestion(
                learningModuleId,
                qs[y].qType,
                qs[y].questionLable,
                jd[x].questionStatement,
                jd[x].questionAnswer,
                "",
                ""
              );

              //Save the answer
              let answerId: number = await this.insertAnswers(
                questionId,
                qs[y].qType,
                jd[x].questionAnswer
              );
            } else {
              //Multiple choice question type
              questionId = await this.insertQuestion(
                learningModuleId,
                qs[y].qType,
                qs[y].questionLable,
                "",
                "",
                jd[x].question,
                jd[x].answer
              );

              //Loop through Answers
              //Save all of the answers
              let qa = qs[y].answers;
              for (let z = 0; z < qa.length; z++) {
                let answerId: number = await this.insertAnswers(
                  questionId,
                  qs[y].qType,
                  qa[z]
                );
              }
            }
          } //end for loop questions
        } //end for loop modules
      } catch (err) {}
    });
  }
  // END LEARNING MODULES
  /****************************************************************************************************************************************************/

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

  /****************************************************************************************************************************************************/
  async setUpLearningModules() {
    console.log("\n\n");
    console.log("+++++++++++++ BEGIN SET UP +++++++++++++");
    await this.dropLearningModules();
    await this.dropQuestions();
    await this.dropQuestionType();
    await this.dropAnswers();

    await this.createLearningModules();
    await this.createQuestions();
    await this.createQuestionType();
    await this.createAnswers();

    await this.insertQuestionTypeRecord();
    console.log("+++++++++++++ END SET UP +++++++++++++");
    console.log("\n\n");
  }

  createLearningModules() {
    return new Promise((resolve, reject) => {
      try {
        // db.transaction((tx) => {
        //   tx.executeSql("DROP TABLE IF EXISTS learningModules");
        // });
        db.transaction((tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS learningModules (" +
              "learningModuleId INTEGER PRIMARY KEY NOT NULL, " +
              "moduleTitle TEXT DEFAULT '', " +
              "moduleSummary TEXT DEFAULT '', " +
              "moduleContent TEXT DEFAULT '', " +
              "quizTopic TEXT DEFAULT '', " +
              "finished BOOLEAN DEFAULT 0, " +
              "insertTimestamp TEXT DEFAULT (datetime('now')) " +
              ");",
            [],
            (tx, success) => {console.log("createLearningModules SUCCESS!"); resolve(true);/* success */}, // prettier-ignore
            (tx, error) => { console.log("error createLearningModules = " + error); return false; } // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  createQuestions() {
    return new Promise((resolve, reject) => {
      try {
        // db.transaction((tx) => {
        //   tx.executeSql("DROP TABLE IF EXISTS questions");
        // });
        db.transaction((tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS questions (" +
              "questionId INTEGER PRIMARY KEY NOT NULL, " +
              "learningModuleId INT DEFAULT 0, " +
              "qType INT DEFAULT 0, " +
              "questionLabel TEXT DEFAULT '', " +
              "questionStatement TEXT DEFAULT '', " +
              "questionAnswer TEXT DEFAULT '', " +
              "question TEXT DEFAULT '', " +
              "answer TEXT DEFAULT '', " +
              "FOREIGN KEY(learningModuleId) REFERENCES learningModules(learningModuleId)" +
              ");",
            [],
            (tx, success) => {console.log("createQuestions SUCCESS!"); resolve(true);/* success */}, // prettier-ignore
            (tx, error) => { console.log("error createQuestions = " + error); return false; } // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }
  createQuestionType() {
    return new Promise((resolve, reject) => {
      try {
        // db.transaction((tx) => {
        //   tx.executeSql("DROP TABLE IF EXISTS questionType");
        // });
        db.transaction((tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS questionType (" +
              "questionTypeId INTEGER PRIMARY KEY NOT NULL, " +
              "qType INT DEFAULT 0 " +
              ");",
            [],
            (tx, success) => {console.log("createQuestionType SUCCESS!"); resolve(true);/* success */}, // prettier-ignore
            (tx, error) => { console.log("error createQuestionType = " + error); return false; } // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }
  createAnswers() {
    return new Promise((resolve, reject) => {
      try {
        // db.transaction((tx) => {
        //   tx.executeSql("DROP TABLE IF EXISTS answers");
        // });
        db.transaction((tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS answers (" +
              "answerId INTEGER PRIMARY KEY NOT NULL, " +
              "questionId INT DEFAULT 0, " +
              "qType INT DEFAULT 0, " +
              "answer TEXT DEFAULT '', " +
              "FOREIGN KEY(questionId) REFERENCES questions(questionId)" +
              ");",
            [],
            (tx, success) => {console.log("createAnswers SUCCESS!"); resolve(true);/* success */}, // prettier-ignore
            (tx, error) => { console.log("error createAnswers = " + error); return false; } // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  insertQuestionTypeRecord() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO questionType(qType) VALUES(1)" , 
            [],
            (tx, success) => { console.log("questionType insert1 SUCCESS! = " + success.rows.length); resolve(true); },
            (tx, err) => { console.log("insert err"); return false; }
          ); // prettier-ignore
          tx.executeSql(
            "INSERT INTO questionType(qType) VALUES(2)", [],
            (tx, success) => { console.log("questionType insert2 SUCCESS!"); resolve(true);},
            (tx, err) => { console.log("insert err"); return false; }
          ); // prettier-ignore
          tx.executeSql(
            "SELECT * FROM questionType ORDER BY questionTypeId DESC LIMIT 1;",
            [],
            (tx, success) => {
              console.log(
                "DATA INSERT ARE = " + success.rows.item(0).questionTypeId
              );
            },
            (tx, err) => {
              console.log("DATA INSERT FAIL = " + err);
              return false;
            }
          );
        });
      } catch (err) {}
    });
  }

  /****************************************************************************************************************************************************/
  dropLearningModules() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "DROP TABLE IF EXISTS learningModules",
            [],
            (t, s) => {
              console.log("drop learningModules");
              resolve(true);
            },
            (t, e) => {
              console.log("fail drop learningModules: " + e);
              return false;
            }
          );
        });
      } catch (error) {}
    });
  }
  dropQuestions() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "DROP TABLE IF EXISTS questions",
            [],
            (t, s) => {
              console.log("drop questions");
              resolve(true);
            },
            (t, e) => {
              console.log("fail drop questions: " + e);
              return false;
            }
          );
        });
      } catch (error) {}
    });
  }
  dropQuestionType() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "DROP TABLE IF EXISTS questionType",
            [],
            (t, s) => {
              console.log("drop questionType");
              resolve(true);
            },
            (t, e) => {
              console.log("fail drop questionType: " + e);
              return false;
            }
          );
        });
      } catch (error) {}
    });
  }
  dropAnswers() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "DROP TABLE IF EXISTS answers",
            [],
            (t, s) => {
              console.log("drop answers");
              resolve(true);
            },
            (t, e) => {
              console.log("fail drop answers: " + e);
              return false;
            }
          );
        });
      } catch (error) {}
    });
  }

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
