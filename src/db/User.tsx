import * as Constants from "constants/Constants";
import * as Helper from "components/Helper";
import { openDatabase } from "expo-sqlite";
const db = openDatabase(Constants.DB_NAME);

interface questionJSONStructure {
  userAnswerCorrect: boolean;
  finished: boolean;
  questionNumber: number;
  learningModuleId: number;
  questionId: number;
  qType: number;
  question: string;
  formHorizontal: boolean;
  radio_props: any;
}
interface questionJSONArray extends Array<questionJSONStructure> {}

class User {
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
    questionAnswer: boolean,
    question: string,
    answer: string
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        let parameters = [
          learningModuleId,
          qType,
          questionLabel,
          questionStatement,
          questionAnswer,
        ];
        let questionField = "questionStatement", answerField = "questionAnswer"; //prettier-ignore
        if (qType == Constants.QTYPE_MULTIPLE_CHOICE) {
          parameters = [
            learningModuleId,
            qType,
            questionLabel,
            question,
            answer,
          ];
          questionField = "question";
          answerField = "answer";
        }

        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO " +
              " questions(learningModuleId, qType, questionLabel, " + questionField + ", " + answerField + ") " +
              " VALUES(?,?,?,?,?)",
            parameters,
          (tx, success) => { console.log("insertQuestion SUCCESS!") /* success */}, // prettier-ignore
            (tx, error) => {
              console.log("error insertConditionRecord = " + error);
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
            (tx, error) => {console.log("learningModules checkForLearningModuleData does NOT EXIST!."); resolve(false); return false;} // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  grabLearningModuleById(learningModuleId: number): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM learningModules WHERE learningModuleId = ? ;",
            [learningModuleId],
            (trans, rs) => { resolve(rs); }, // prettier-ignore
            (tx, error) => { console.log("learningModules grabLearningModuleById does NOT EXIST!."); return false;} // prettier-ignore
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
            "SELECT * FROM learningModules ORDER by learningModuleId DESC;",
            [],
            (trans, rs) => { resolve(rs); }, // prettier-ignore
            (tx, error) => {console.log("learningModules grabAllLearningModulesData does NOT EXIST!."); return false;} // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  grabLearningModuleQuestionItemsAsArray(
    learningModuleId: number,
    finished: boolean
  ): Promise<questionJSONArray> {
    return new Promise(async (resolve, reject) => {
      try {
        let questionItemsArr = [], existingRecord = true; //prettier-ignore

        let rs = await this.grabExistingLearningModuleQuestionsById(learningModuleId); //prettier-ignore
        if (rs == null) {
          //If no existing learning module questions, we then just grab all questions without any answers yet.
          rs = await this.grabLearningModuleQuestionsById(learningModuleId); //prettier-ignore
          existingRecord = false;
        }

        //Start for Loop
        //Firstly check for existing learning module questions that already has some user answers.
        for (let x = 0; x < rs.rows.length; x++) {
          let item: any = rs.rows.item(x);
          let question = "", choices = [{}], questionNumber = -1, qTypeInt = parseInt(item.qType); //prettier-ignore

          if (existingRecord) {
            if (qTypeInt == Constants.QTYPE_TRUE_OR_FALSE) {
              questionNumber = item.questionNumber;
              question = item.questionStatement;
              choices = [
                { label: "True", value: 1 },
                { label: "False", value: 0 },
              ];
            } else {
              question = item.question;
              let rsAnswers = await this.grabQuestionAnswersByIdAndQType(item.questionId, qTypeInt); //prettier-ignore
              if (rsAnswers != null && rsAnswers.rows.length > 0) {
                for (let y = 0; y < rsAnswers.rows.length; y++) {
                  let answerItem = rsAnswers.rows.item(y);
                  if (item.userAnswer == answerItem.answer) {
                    questionNumber = y;
                  }
                  choices[y] = { label: answerItem.answer, value: answerItem.answer }; //prettier-ignore
                }
              }
            }
          } else {
            let rsUserAnswer = await this.grabUserAnswerByIdAndQId( learningModuleId, item.questionId ); //prettier-ignore
            if (qTypeInt == Constants.QTYPE_TRUE_OR_FALSE) {
              if (rsUserAnswer.rows.length > 0) {
                questionNumber = Helper.ctb(rsUserAnswer.rows.item(0).questionNumber); //prettier-ignore
              }
              question = item.questionStatement;
              choices = [
                { label: "True", value: 1 },
                { label: "False", value: 0 },
              ];
            } else {
              question = item.question;
              let rsAnswers = await this.grabQuestionAnswersByIdAndQType(item.questionId, qTypeInt); //prettier-ignore
              if (rsAnswers != null && rsAnswers.rows.length > 0) {
                for (let y = 0; y < rsAnswers.rows.length; y++) {
                  let answerItem = rsAnswers.rows.item(y);
                  if (rsUserAnswer.rows.length > 0 && rsUserAnswer.rows.item(0).questionNumber == y) {
                  questionNumber = rsUserAnswer.rows.item(0).questionNumber;
                } //prettier-ignore
                  choices[y] = { label: answerItem.answer, value: answerItem.answer, }; //prettier-ignore
                }
              }
            }
          }

          questionItemsArr.push({
            userAnswerCorrect: item.userAnswerCorrect,
            finished: finished,
            questionNumber: questionNumber,
            learningModuleId: item.learningModuleId,
            questionId: item.questionId,
            qType: qTypeInt,
            question: question,
            formHorizontal: qTypeInt == Constants.QTYPE_TRUE_OR_FALSE,
            radio_props: choices,
          });
        } //End for Loop

        resolve(questionItemsArr);
      } catch (err) {}
    });
  }

  grabExistingLearningModuleQuestionsById(
    learningModuleId: number
  ): Promise<SQLResultSet> {
    return new Promise(async (resolve, reject) => {
      try {
        let rsUserAnswer = await this.grabUserAnswerById(learningModuleId);
        let rsQuestions = await this.grabQuestionsById(learningModuleId);
        if (rsUserAnswer.rows.length > 0 && (rsUserAnswer.rows.length == rsQuestions.rows.length)) {
          let existingLMQWUA = await this.grabExistingLearningModuleQuestionsWithUserAnswers(learningModuleId);
          resolve(existingLMQWUA);
        } else {
          resolve(null);
        } //prettier-ignore
      } catch (error) {}
    });
  }

  grabLearningModuleQuestionsById(
    learningModuleId: number
  ): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT lm.learningModuleId, q.questionId, q.questionStatement, q.questionAnswer, q.question, q.answer, q.qType " +
            "FROM learningModules lm JOIN questions q " +
            "ON lm.learningModuleId = q.learningModuleId " +
            "WHERE lm.learningModuleId = ? ;",
          [learningModuleId],
          (trans, rs) => {
            resolve(rs);
          },
          (tx, error) => {console.log("either learningModules or questions does NOT EXIST!. " + error); return false;} // prettier-ignore
        );
      });
    });
  }

  grabExistingLearningModuleQuestionsWithUserAnswers(
    learningModuleId: number
  ): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT lm.learningModuleId, q.questionId, q.questionStatement, q.questionAnswer, q.question, q.answer, q.qType, ua.userAnswer, ua.questionNumber, ua.userAnswerCorrect " +
              "FROM learningModules lm JOIN questions q " +
              "ON lm.learningModuleId = q.learningModuleId " +
              "JOIN userAnswer ua ON ua.questionId = q.questionId " +
              "WHERE lm.learningModuleId = ? ORDER BY q.questionId ASC;",
            [learningModuleId],
            (trans, rs) => {
              resolve(rs);
            },
            (tx, error) => {console.log("either learningModules or questions does NOT EXIST!. " + error); return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
  }

  grabExistingLearningModuleQuestionsWithUserAnswersSingle(
    learningModuleId: number,
    qId: number
  ): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT lm.learningModuleId, q.questionId, q.questionStatement, q.questionAnswer, q.question, q.answer, q.qType, ua.userAnswer, ua.questionNumber, ua.userAnswerCorrect " +
              "FROM learningModules lm JOIN questions q " +
              "ON lm.learningModuleId = q.learningModuleId " +
              "JOIN userAnswer ua ON ua.questionId = q.questionId " +
              "WHERE lm.learningModuleId = ? AND q.questionId = ? ;",
            [learningModuleId, qId],
            (trans, rs) => {
              resolve(rs);
            },
            (tx, error) => {console.log("either learningModules or questions does NOT EXIST!. " + error); return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
  }

  grabQuestionsById(learningModuleId: number): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM questions WHERE learningModuleId = ? ;",
            [learningModuleId],
            (trans, rs) => { resolve(rs); }, // prettier-ignore
            (tx, error) => {console.log("answers table does NOT EXIST!. " + error); return false;} // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  grabQuestionsByLMIDAndQID(
    learningModuleId: number,
    questionId: number
  ): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM questions WHERE learningModuleId = ? AND questionId = ? ORDER BY questionId ASC;",
            [learningModuleId, questionId],
            (trans, rs) => { resolve(rs); }, // prettier-ignore
            (tx, error) => { console.log("answers table does NOT EXIST!. " + error); return false;} // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  grabQuestionAnswersByIdAndQType(
    questionId: number,
    qType: number
  ): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * " +
              "FROM answers " +
              "WHERE questionId = ? AND qType = ? ;",
            [questionId, qType],
            (trans, rs) => { resolve(rs); }, // prettier-ignore
            (tx, error) => {console.log("answers table does NOT EXIST!. " + error); return false;} // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  async fetchLearningModulesData() {
    try {
      console.log("---- No learning modules data found. ----") //prettier-ignore
      let rsUser = await this.grabUserType();
      let userTypeId = rsUser.rows.item(0).userTypeId;
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
          let x = 0;
          res.items.forEach(async (element) => {
            let item = element.fields;

            let isAParent = userTypeId == Constants.USER_TYPE_PARENT_GUARDIAN;
            let isOther =
              userTypeId == Constants.USER_TYPE_AVO_HOLDER ||
              userTypeId == Constants.USER_TYPE_LEARNING;

            let isAModuleQuiz = typeof item.moduleQuiz !== "undefined";
            let isAParentGuardianContentType =
              element.sys.contentType.sys.id ==
              "learningModuleForParentAndGuardian";

            if (isAModuleQuiz && isAParentGuardianContentType && isAParent) {
              // we found a module.
              // we can only use these => moduleTitle,moduleSummary
              let quizzesArr = await this.questionBuilder(
                item.moduleQuiz.fields.quizQuestions
              );
              jsonObj = {
                moduleTitle: item.moduleTitle,
                moduleSummary: item.moduleSummary,
                moduleContent: item.moduleContent.content[0].content[0].value,
                quizTopic: item.moduleQuiz.fields.quizTopic,
                quizzes: quizzesArr,
              };
              jsonArr.push(jsonObj);
            } else if (
              isAModuleQuiz &&
              isOther &&
              !isAParent &&
              !isAParentGuardianContentType
            ) {
              // we found a module.
              // we can only use these => moduleTitle,moduleSummary
              let quizzesArr = await this.questionBuilder(
                item.moduleQuiz.fields.quizQuestions
              );
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

  questionBuilder(quizQuestions: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        // BUILD QUESTIONS
        let quizzesArr = [];
        quizQuestions.forEach((qe) => {
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
        resolve(quizzesArr);
      } catch (err) {}
    });
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
            if (qs[y].qType == Constants.QTYPE_TRUE_OR_FALSE) {
              //T or F question type
              questionId = await this.insertQuestion(
                learningModuleId,
                qs[y].qType,
                qs[y].questionLable,
                qs[y].questionStatement,
                qs[y].questionAnswer,
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
                null,
                qs[y].question,
                qs[y].answer
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

  /****************************************************************************************************************************************************/
  getCurrentTime(): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT strftime('%Y','now') as year, strftime( '%m','now' ) as month;",
            [],
            (trans, rs) => { resolve(rs)}, // prettier-ignore
            (tx, error) => { return false;} // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }
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
            (tx, error) => { console.log("checkUserSetUp FAIL = " + error); resolve(false); return false;} // prettier-ignore
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
  grabUserCondition(): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM user u JOIN condition c ON u.userId = c.userId WHERE c.conditionSelected = 1; ",
            [],
            (trans, rs) => {
              // console.log(rs);
              resolve(rs);
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
  createUser(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS user (" +
              "userId INTEGER PRIMARY KEY NOT NULL, " +
              "initials TEXT DEFAULT 'XX', " +
              "dob TEXT DEFAULT (datetime('now')), " +
              "userTypeId INT DEFAULT 0, " +
              "userSetUp BOOLEAN DEFAULT 0, " +
              "completeOnboarding BOOLEAN DEFAULT 0 " +
              ");",
            [],
            (tx, success) => { console.log("createUser SUCCESS! = " + success); resolve(true); /* success */}, // prettier-ignore
            (tx, error) => { console.log("createUser ERROR! = " + error); resolve(false); return false; } // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Create Table 'condition'. No return;
  createCondition(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS condition (" +
              "conditionId INTEGER PRIMARY KEY NOT NULL, " +
              "userId INT NULL DEFAULT 1, " +
              "conditionNumber INT DEFAULT 0, " +
              "conditionSummary TEXT DEFAULT '', " +
              "conditionText TEXT DEFAULT '', " +
              "conditionSelected BOOLEAN DEFAULT 0, " +
              "conditionMandatory BOOLEAN DEFAULT 0, " +
              "FOREIGN KEY(userId) REFERENCES user(userId) " +
              ");",
            [],
            (tx, success) => {console.log("SUCCESS createCondition! = " + success); resolve(true); /* success */}, // prettier-ignore
            (tx, error) => { console.log("error createCondition = " + error); resolve(false); return false; } // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Drops table 'user'. No return;
  dropUser(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        console.log("1.1");
        db.transaction((tx) => {
          tx.executeSql(
            "DROP TABLE IF EXISTS user",
            [],
            (tx, success) => { resolve(true); /* success */}, // prettier-ignore
            (tx, error) => {
              console.log("error insertUserDefaultRecord = " + error);
              resolve(false);
              return false;
            }
          );
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Drops table 'condition'. No return;
  dropCondtion(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "DROP TABLE IF EXISTS condition",
            [],
            (tx, success) => { resolve(true); /* success */}, // prettier-ignore
            (tx, error) => {
              console.log("error insertUserDefaultRecord = " + error);
              resolve(false);
              return false;
            }
          );
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Inserts a new record into 'user' table. No return;
  insertUserDefaultRecord(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO " +
              " user(initials, dob, userTypeId) " +
              " VALUES('','','')",
            [],
            (tx, success) => { resolve(true); /* success */}, // prettier-ignore
            (tx, error) => {
              console.log("error insertUserDefaultRecord = " + error);
              resolve(false);
              return false;
            }
          );
        });
      } catch (err) {}
    });
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
          (tx, success) => {/* success */}, // prettier-ignore
          (tx, error) => {
            console.log("error insertConditionRecord = " + error);
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
          }),
            (tx, error) => {
              console.log("getConditionRecordCount FAIL = " + error);
            };
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Sets up the 'user' table for first timers.
  setUpUserTable(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((txn) => {
          txn.executeSql(
            "SELECT * FROM user",
            [],
            async (tx, rs) => {
              //console.log("item:", rs.rows.length);
              if (rs.rows.length == 0) {
                // No rows found on the 'user' table. We then drop if user table exist, create user table then insert a default record.
                await this.dropUser();
                await this.createUser();
                await this.insertUserDefaultRecord();
                resolve(true);
              } else {
                //I think there is an sql bug where it duplicates records hence having more than 1 row. We delete them here.
                txn.executeSql("DELETE FROM user WHERE id > 1;", []);
                resolve(true);
              }
            },
            () => {
              //This is 100% the error: => "no such table: user (code 1 SQLITE_ERROR[1]): , while compiling: SELECT * FROM user"
              //So to overcome this problem we'll have to create a "user" table then insert a default record.
              this.createUser();
              this.insertUserDefaultRecord();
              resolve(false);
              return false;
            }
          );
        });
      } catch (error) {}
    });
  }

  /****************************************************************************************************************************************************/
  //Sets up the 'condition' table after doing an api call.
  setUpConditionTable(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((txn) => {
          txn.executeSql(
            "SELECT * FROM condition",
            [],
            async (tx, rs) => {
              if (rs.rows.length == 0) {
                await this.dropCondtion();
                await this.createCondition();
              }
              resolve(true);
            },
            (tx, err) => {
              // console.log(err);
              //This is 100% the error: => "no such table: user (code 1 SQLITE_ERROR[1]): , while compiling: SELECT * FROM user"
              //So to overcome this problem we'll have to create a "user" table then insert a default record.
              this.createCondition();
              resolve(false);
              return false;
            }
          );
        });
      } catch (error) {}
    });
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
    await this.dropUserAnswers();
    await this.dropUserPerformance();

    await this.createLearningModules();
    await this.createQuestions();
    await this.createQuestionType();
    await this.createAnswers();
    await this.createUserAnswer();
    await this.createUserPerformance();

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
              "questionAnswer BOOLEAN DEFAULT '', " +
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

  createUserAnswer() {
    return new Promise((resolve, reject) => {
      try {
        // db.transaction((tx) => {
        //   tx.executeSql("DROP TABLE IF EXISTS learningModules");
        // });
        db.transaction((tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS userAnswer (" +
              "userAnswerId INTEGER PRIMARY KEY NOT NULL, " +
              "learningModuleId INT DEFAULT 0, " +
              "questionId INT DEFAULT 0, " +
              "qType INT DEFAULT 0, " +
              "userAnswer TEXT DEFAULT '', " +
              "questionNumber INT DEFAULT -1, " +
              "userAnswerCorrect BOOLEAN DEFAULT 0, " +
              "FOREIGN KEY(learningModuleId) REFERENCES learningModules(learningModuleId), " +
              "FOREIGN KEY(questionId) REFERENCES questions(questionId) " +
              ");",
            [],
            (tx, success) => {console.log("createUserAnswer SUCCESS!"); resolve(true);/* success */}, // prettier-ignore
            (tx, error) => { console.log("error createUserAnswer = " + error); return false; } // prettier-ignore
          );
        });
      } catch (error) {}
    });
  }

  createUserPerformance() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS userPerformance (" +
              "userPerformanceId INTEGER PRIMARY KEY NOT NULL, " +
              "learningModuleId INT DEFAULT 0, " +
              "userScoreNume INT DEFAULT 0, " +
              "userScoreDeno INT DEFAULT 0, " +
              "userScoreValue DOUBLE DEFAULT 0, " +
              "FOREIGN KEY(learningModuleId) REFERENCES learningModules(learningModuleId) " +
              ");",
            [],
            (tx, success) => {console.log("createUserPerformance SUCCESS!"); resolve(true);/* success */}, // prettier-ignore
            (tx, error) => { console.log("error createUserPerformance = " + error); return false; } // prettier-ignore
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

  dropUserAnswers() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "DROP TABLE IF EXISTS userAnswer",
            [],
            (t, s) => {
              console.log("drop userAnswer");
              resolve(true);
            },
            (t, e) => {
              console.log("fail drop userAnswer: " + e);
              return false;
            }
          );
        });
      } catch (error) {}
    });
  }

  dropUserPerformance() {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "DROP TABLE IF EXISTS userPerformance",
            [],
            (t, s) => {
              console.log("drop userPerformance");
              resolve(true);
            },
            (t, e) => {
              console.log("fail drop userPerformance: " + e);
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
        tx.executeSql("UPDATE USER SET initials = ? WHERE userId = 1;", [v]);
      });
    } catch (error) {}
  }
  // update 'user' dob, no return;
  updateUserDOB(v: String) {
    try {
      db.transaction((tx) => {
        tx.executeSql("UPDATE USER SET dob = ? WHERE userId = 1;", [v]);
      });
    } catch (error) {}
  }
  // update 'user' userTypeId, no return;
  updateUserType(v: number) {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE USER SET userTypeId = ? WHERE userId = 1;",
          [v],
          (t, r) => {
            console.log("WORKING UPDATE?");
            tx.executeSql(
              "SELECT * FROM user;",
              [],
              (t, r) => {
                console.log("SELECT USER");
                console.log(r);
              },
              (t, e) => {
                console.log("SELECT USER FAIL");
                return false;
              }
            );
          },
          (t, e) => {
            console.log("ERROR UPDATE!");
            return false;
          }
        );
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
          //(tx, success) => {console.log("updateUserConditions success: " + success);}, // prettier-ignore
          // (tx, error) => {console.log("updateUserConditions error: " + error);/* fail */ return false;} // prettier-ignore
        );
      });
    } catch (error) {}
  }

  // update 'user' userSetUp, no return;
  updateUserSetUp() {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE USER SET userSetUp = 1 WHERE userId = 1;",
          [],
          (tx, success) => {/* success */}, // prettier-ignore
          (tx, error) => {/* fail */ console.log("updateUserSetUp FAIL!" + error); return false;} // prettier-ignore
        );
      });
    } catch (error) {}
  }

  // update 'user' completeOnboarding, no return;
  updateUserOnboarding() {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE USER SET completeOnboarding = 1 WHERE userId = 1;",
          [],
          (tx, success) => {
            /* success */
            console.log(success);
            return true;
          },
          (tx, error) => {
            /* fail */
            console.log(error);
            return false;
          }
        );
      });
    } catch (error) {}
  }

  grabUserAnswerById(learningModuleId: number): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * from userAnswer WHERE learningModuleId = ?;",
            [learningModuleId],
            (trans, rs) => {
              resolve(rs);
            },
            (tx, error) => {console.log("grabUserAnswerById error: " + error);/* fail */ return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
  }

  grabUserAnswerByIdAndQId(
    learningModuleId: number,
    questionId: number
  ): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * from userAnswer WHERE learningModuleId = ? AND questionId = ? ORDER BY questionId ASC;",
            [learningModuleId, questionId],
            (trans, rs) => {
              resolve(rs);
            },
            (tx, error) => {console.log("grabUserAnswerById error: " + error);/* fail */ return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
  }

  deleteUserAnswerById(learningModuleId: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.deleteUserPerformanceById(learningModuleId);
        db.transaction((tx) => {
          tx.executeSql(
            "DELETE from userAnswer WHERE learningModuleId = ? ;",
            [learningModuleId],
            (trans, rs) => {
              resolve(true);
            },
            (tx, error) => {console.log("deleteUserAnswerById error: " + error);/* fail */ return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
  }

  deleteCondition(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "DELETE from condition ;",
            [],
            (trans, rs) => {
              resolve(true);
            },
            (tx, error) => {console.log("deleteCondition error: " + error);/* fail */ return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
  }

  deleteUserPerformanceById(learningModuleId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "DELETE from userPerformance WHERE learningModuleId = ? ;",
            [learningModuleId],
            (trans, rs) => {
              resolve(true);
            },
            (tx, error) => {console.log("deleteUserPerformanceById error: " + error);/* fail */ return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
  }

  updateUserAnswer(
    userAnswer: any,
    lmId: number,
    qId: number,
    qType: number,
    qNum: number
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let thisUserAnswer: any;
        if (typeof userAnswer == "number") {
          thisUserAnswer = Helper.ctb(userAnswer).toString(); //boolean value for T or F
        } else {
          thisUserAnswer = userAnswer; //string value for Multiple choice
        }

        let isSameAnswer = await this.comparePrevAndCurrentAnswers(thisUserAnswer, lmId, qId, qType); //prettier-ignore
        if (isSameAnswer) {
          resolve(false);
          return false;
        }

        //we'll update the user's answer if there is an existing record of their answer based on a specific learning module and question.
        db.transaction((tx) => {
          tx.executeSql(
            "UPDATE userAnswer SET userAnswer = ?, questionNumber = ? " +
              "WHERE learningModuleId = ? AND questionId = ? AND qType = ? ;",
            [thisUserAnswer, qNum, lmId, qId, qType],
            (tx, success) => {},
            (tx, error) => {console.log("updateUserAnswer ERROR!: " + error);/* fail */ return false;} // prettier-ignore
          );

          //Above code will somehow always execute even if there are no existing record(s),
          //so we do a select statement and see if it actually exists.
          //If it returns null or nothing then we will insert this as a new record.
          tx.executeSql(
            "SELECT * from userAnswer WHERE learningModuleId = ? AND questionId = ? AND qType = ? ;",
            [lmId, qId, qType],
            async (trans, rs) => {
              if (rs == null || rs.rows.length == 0) {
                let insertUserAnswer = await this.insertUserAnswer(userAnswer, lmId, qId, qType, qNum); // prettier-ignore
              }
              let isAnswerCorrect = await this.checkUserAnswersV2(lmId, qId);
              let updateUserAnswer = await this.updateUserAnswerV2(isAnswerCorrect, lmId, qId, qType); // prettier-ignore

              await this.markingQuizScoreProcess(lmId, false);
              resolve(true);
            },
            (tx, error) => {console.log("updateUserAnswer select ERROR: " + error);/* fail */ return false;} // prettier-ignore
          );
        }, null);
      } catch (error) {}
    });
  }

  updateUserAnswerV2(
    userAnswerCorrect: boolean,
    lmId: number,
    qId: number,
    qType: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "UPDATE userAnswer SET userAnswerCorrect = ? " +
              "WHERE learningModuleId = ? AND questionId = ? AND qType = ? ;",
            [userAnswerCorrect, lmId, qId, qType],
            (tx, success) => {
              resolve(true);
            },
            (tx, error) => {console.log("updateUserAnswer ERROR!: " + error);/* fail */ return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
  }

  insertUserAnswer(
    userAnswer: any,
    lmId: number,
    qId: number,
    qType: number,
    qNum: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO userAnswer(userAnswer, learningModuleId, questionId, qType, questionNumber) " +
              "VALUES(?,?,?,?,?); ",
            [userAnswer, lmId, qId, qType, qNum],
            (trans, rs) => {
              resolve(true);
            },
            (trans, err) => {
              console.log("updateUserAnswer insert ERROR!: " + err);
              return false;
            }
          );
        });
      } catch (err) {}
    });
  }

  comparePrevAndCurrentAnswers(
    userAnswer: any,
    learningModuleId: number,
    questionId: number,
    qType: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * from userAnswer WHERE learningModuleId = ? AND questionId = ? AND qType = ? ;",
            [learningModuleId, questionId, qType],
            (trans, rs) => {
              if (rs.rows.length > 0) {
                for (let x = 0; x < rs.rows.length; x++) {
                  let item = rs.rows.item(x);
                  let thisUserAnswer: any;
                  if (item.qType == Constants.QTYPE_TRUE_OR_FALSE) {
                    thisUserAnswer = Helper.ctb(userAnswer).toString(); //boolean value for T or F
                  } else {
                    thisUserAnswer = userAnswer; //string value for Multiple choice
                  }
                  resolve(thisUserAnswer == item.userAnswer);
                }
              }

              resolve(false);
            },
            (tx, error) => {console.log("updateUserAnswer select ERROR: " + error);/* fail */ return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
  }

  //compare the total number of questions the user has answered vs the total number of questions of the module
  checkIfAllQuestionsAreAnswered(learningModuleId: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let rsUA = await this.grabUserAnswerByLeaningModuleId(learningModuleId); //prettier-ignore
        let rsLMQ = await this.grabLearningModuleQuestionsById(learningModuleId); //prettier-ignore

        resolve(rsUA.rows.length == rsLMQ.rows.length);
      } catch (err) {}
    });
  }

  grabUserAnswerByLeaningModuleId(
    learningModuleId: number
  ): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * from userAnswer WHERE learningModuleId = ? ;",
            [learningModuleId],
            (trans, rs) => {
              resolve(rs);
            },
            (tx, error) => {console.log("updateUserAnswer error: " + error);/* fail */ return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
  }

  grabLearningModuleProgress(learningModuleId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT userScoreValue from userPerformance WHERE learningModuleId = ? ;",
            [learningModuleId],
            (tx, rs) => {
              if (rs.rows.length > 0) {
                if (parseInt(rs.rows.item(0).userScoreValue) > 0.0) {
                  resolve(parseInt(rs.rows.item(0).userScoreValue));
                } else {
                  resolve(0);
                }
              } else {
                resolve(0);
              }
            },
            (tx, error) => {
              return false;
            }
          );
        });
      } catch (err) {}
    });
  }

  markingQuizScoreProcess(
    learningModuleId: number,
    userFullyCompleteAllQuiz: boolean
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let rsUserAnswers = await this.grabExistingLearningModuleQuestionsWithUserAnswers( learningModuleId ); //prettier-ignore
        let rsQuestions = await this.grabQuestionsById( learningModuleId ); //prettier-ignore
        if (rsUserAnswers != null && rsUserAnswers.rows.length > 0) {
          //Firstly, we want to know if the user has either fully or partially completed the module questions.
          let userScore = rsQuestions.rows.length - rsUserAnswers.rows.length;
          if (userScore == 0) {
            //this means the user has fully completed the module's questions.
            userScore = rsQuestions.rows.length;

            //User request to complete the form, we now check if the user got all of their answer(s) correct.
            if (userFullyCompleteAllQuiz) {
              //We now calculate & check each of user's answer(s) vs the question's correct answer(s)
              await this.checkUserAnswers(
                learningModuleId,
                rsUserAnswers,
                rsQuestions
              );
              //We now check if the user's answer are all correct.
              if (userScore == rsQuestions.rows.length) {
                //if all are correct we then set the module to finished.
                await this.updateLearningModuleCompletion(true, learningModuleId); //prettier-ignore
                resolve(true);
              }
            } else {
              await this.checkUserAnswers(
                learningModuleId,
                rsUserAnswers,
                rsQuestions
              );
              await this.updateLearningModuleCompletion(false, learningModuleId); //prettier-ignore
              resolve(true);
            }
          } else {
            //this means the user has partially completed the module's questions.
            await this.checkUserAnswers(
              learningModuleId,
              rsUserAnswers,
              rsQuestions
            );
            resolve(true);
          }
        }
      } catch (err) {}
    });
  }

  checkUserAnswers(
    learningModuleId: number,
    rsUserAnswers: SQLResultSet,
    rsQuestions: SQLResultSet
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("Checking Answers");
        let userScore = 0;
        for (let x = 0; x < rsUserAnswers.rows.length; x++) {
          let item = rsUserAnswers.rows.item(x);
          let answerIsCorrect = false;

          if (item.qType == Constants.QTYPE_TRUE_OR_FALSE) {
            //True or False
            if (Helper.ctb(item.userAnswer) == Helper.ctb(item.questionAnswer)){
              answerIsCorrect = true;
              userScore++;
            } //prettier-ignore
          } else {
            //Multiple Choice
            if (item.userAnswer == item.answer) {
              answerIsCorrect = true;
              userScore++;
            }
          }

          // Save into userPerformance
          let scoringComplete = await this.updateUserPerformance(
            learningModuleId,
            userScore,
            rsQuestions.rows.length
            // answerIsCorrect
          );
        }

        resolve(true);
      } catch (err) {}
    });
  }

  checkUserAnswersV2(lmId: number, qId: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        let rsUserAnswers = await this.grabExistingLearningModuleQuestionsWithUserAnswersSingle( lmId, qId ); //prettier-ignore
        if (rsUserAnswers.rows.length > 0) {
          let item = rsUserAnswers.rows.item(0);
          let isAnswerCorrect = false;
          if (item.qType == Constants.QTYPE_TRUE_OR_FALSE) {
            //True or False
            if (Helper.ctb(item.userAnswer) == Helper.ctb(item.questionAnswer)){
              isAnswerCorrect = true;
            } //prettier-ignore
          } else {
            //Multiple Choice
            if (item.userAnswer == item.answer) {
              isAnswerCorrect = true;
            }
          }

          resolve(isAnswerCorrect);
        } else {
          resolve(false);
        }
      } catch (err) {}
    });
  }

  updateLearningModuleCompletion(
    finished: boolean,
    learningModuleId: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        console.log("updateLearningModuleCompletion finished = " + finished);
        db.transaction((tx) => {
          tx.executeSql(
            "UPDATE learningModules SET finished = ? " +
              "WHERE learningModuleId = ? ;",
            [finished, learningModuleId],
            (tx, success) => {
              resolve(true);
            },
            (tx, error) => {console.log("updateLearningModuleCompletion ERROR!: " + error);/* fail */ return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
  }

  updateUserPerformance(
    learningModuleId: number,
    userScoreNume: number,
    userScoreDeno: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          let userScoreValue = (userScoreNume / userScoreDeno) * 100;
          tx.executeSql(
            "UPDATE userPerformance SET userScoreNume = ?, userScoreDeno = ?, userScoreValue = ? " +
              "WHERE learningModuleId = ? ;",
            [userScoreNume, userScoreDeno, userScoreValue, learningModuleId],
            (tx, success) => {
              console.log(
                "updateUserPerformance SUCCESS!: " + success.rows.length
              );
            },
            (tx, error) => {console.log("updateUserPerformance ERROR!: " + error);/* fail */ return false;} // prettier-ignore
          );

          tx.executeSql(
            "SELECT * from userPerformance WHERE learningModuleId = ? ;",
            [learningModuleId],
            (trans, rs) => {
              if (rs == null || rs.rows.length == 0) {
                console.log(
                  "EITHER EMPTY or NO RECORD FOUND ON userPerformance."
                );
                db.transaction((tx) => {
                  tx.executeSql(
                    "INSERT INTO " +
                      " userPerformance(learningModuleId, userScoreNume, userScoreDeno, userScoreValue) " +
                      " VALUES(?,?,?,?)",
                    [
                      learningModuleId,
                      userScoreNume,
                      userScoreDeno,
                      userScoreValue,
                    ],
                    (tx, success) => { resolve(true);}, // prettier-ignore
                    (tx, error) => { console.log("updateUserAnswer insert ERROR!"); return false; } // prettier-ignore
                  );
                });
              } else {
                // console.log(rs);
                resolve(true);
              }
            },
            (tx, error) => {console.log("updateUserPerformance select ERROR: " + error);/* fail */ return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
  }

  grabUserPerformance(learningModuleId: number): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * from userPerformance WHERE learningModuleId = ? ;",
            [learningModuleId],
            (trans, rs) => {
              resolve(rs);
            },
            (tx, error) => {console.log("grabUserPerformance select ERROR: " + error);/* fail */ return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
  }

  grabUserType(): Promise<SQLResultSet> {
    return new Promise((resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * from user ;",
            [],
            (trans, rs) => {
              console.log(
                "rs.rows.item(0).userTypeId= " + rs.rows.item(0).userTypeId
              );
              console.log(rs);
              resolve(rs);
            },
            (tx, error) => {console.log("grabUserPerformance select ERROR: " + error);/* fail */ return false;} // prettier-ignore
          );
        });
      } catch (err) {}
    });
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
