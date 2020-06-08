import * as Constants from "constants/Constants";
const contentful = require("contentful/dist/contentful.browser.min.js");
const client = contentful.createClient({
  space: Constants.AUTH_PENTECH_SPACE_ID,
  accessToken: Constants.AUTH_PENTECH_ACCESS_TOKEN_DELIVERY,
});
import {
  insertConditionRecord,
  insertSupportLink,
  insertFrequentlyAskedQuestion,
} from "db/InsertScripts";
import { grabSingleSupportLinkByUrl } from "db/SelectScripts";

/****************************************************************************************************************************************************/
// START API CALLS
interface conditionJSONObjStructure {
  conditionNumber: number;
  title: string;
  conditionSummary: string;
  conditionText: string;
  alreadySelected: boolean; // 1st condition is always true
  mandatory: boolean; // 1st condition is always mandatory
}
export const fetchAVOConditionsV2 = (): Promise<
  conditionJSONObjStructure[]
> => {
  return new Promise(async (resolve, reject) => {
    await client
      .getEntries({
        // HTTP Headers
        content_type: "avoCondition",
        order: "sys.createdAt",
      }) //grab all of the entries
      .then(function (entries) {
        // var conditionsArr = {};

        let conditionArr: conditionJSONObjStructure[] = [];
        entries.items.forEach((entry, i) => {
          // Save into database
          insertConditionRecord(
            entry.fields.conditionNumber,
            entry.fields.conditionSummary,
            entry.fields.conditionText,
            i == 0, // 1st condition is always true
            i == 0 // 1st condition is always mandatory
          );

          //make use of the raw data and build an array of objects to return rather than reading from db.
          let condSum = entry.fields.conditionSummary;
          if (condSum.length > 18) condSum = condSum.slice(0, 15) + "...";
          conditionArr.push({
            conditionNumber: entry.fields.conditionNumber,
            title:
              "\tCondition " +
              entry.fields.conditionNumber +
              " ( " +
              condSum +
              " )",
            conditionSummary: condSum,
            conditionText: entry.fields.conditionText,
            alreadySelected: i == 0, // 1st condition is always true
            mandatory: i == 0, // 1st condition is always mandatory
          });
        });
        resolve(conditionArr);
      })
      .catch(console.error);
  });
};

export const fetchPDF = (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    await client
      .getEntries({
        // HTTP Headers
        content_type: "avoPdfFile",
        order: "-sys.createdAt", //order by latest one.
        sys: {
          // Link types that are located on Asset only.
          type: "Link",
          linkType: "Asset",
        },
      }) //grab all of the entries
      .then((entries) => {
        entries.items.forEach(async (entry, i) => {
          if (
            typeof entry.fields.avoPdfFileUpload.fields.file.url !== "undefined"
          ) {
            resolve(entry.fields.avoPdfFileUpload.fields.file.url);
          } else if (
            typeof entries.includes.Asset[i].fields.file.url !== "undefined"
          )
            resolve(entries.includes.Asset[i].fields.file.url);
        });
        // resolve(res);
      })
      .catch(console.error);
  });
};

export const fetchArticleOfTheDay = (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    await client
      .getEntries() //grab all of the entries
      .then((res) => {
        resolve(res);
      })
      .catch(console.error);
  });
};

/**
 * Fetches Contentful API for content type "supportLinks" then saves the data into our table "supportLink"
 */
export const fetchSupportLinksAndSave = (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    await client
      .getEntries({
        // HTTP Headers
        content_type: "supportLinks",
        order: "-sys.createdAt", //order by
        sys: {
          // Link types that are located on Asset only.
          type: "Link",
          linkType: "Asset",
        },
      }) //grab all of the entries
      .then((entries) => {
        let isSuccess = false;
        entries.items.forEach(async (entry, i) => {
          // prettier-ignore
          let isAlreadyExist = await grabSingleSupportLinkByUrl(entry.fields.supportLinkUrl);
          if (!isAlreadyExist) {
            isSuccess = await insertSupportLink(
              entry.fields.supportLinkUrl,
              entry.fields.supportLinkNumber,
              entry.fields.supportLinkImage.fields.title,
              entry.fields.supportLinkImage.fields.description,
              typeof entry.fields.supportLinkAdditionalUrl === "undefined"
                ? ""
                : entry.fields.supportLinkAdditionalUrl,
              typeof entry.fields.supportLinkAdditionalHeading === "undefined"
                ? ""
                : entry.fields.supportLinkAdditionalHeading,
              entry.fields.supportLinkImage.fields.file.url,
              entry.fields.supportLinkImage.fields.file.fileName
            );
          }
        });
        return isSuccess;
      })
      .catch(console.error);
    resolve(true);
  });
};

/**
 * Fetches Contentful API for content type "supportLinks" then saves the data into our table "supportLink"
 */
export const fetchFrequentlyAskedQuestionsAndSave = (): Promise<boolean> => {
  let x = 0;
  return new Promise(async (resolve, reject) => {
    await client
      .getEntries({
        // HTTP Headers
        content_type: "frequentlyAskedQuestions",
        order: "sys.createdAt",
      }) //grab all of the entries
      .then(function (entries) {
        let success = false;
        entries.items.forEach(async (entry, i) => {
          // prettier-ignore
          let builtFAQAnswer = "";
          entry.fields.questionAnswer.content.forEach((entry2, i2) => {
            builtFAQAnswer += entry2.content[0].value + "\n";
          });

          success = await insertFrequentlyAskedQuestion(
            entry.fields.questionTitle,
            builtFAQAnswer
          );
        });

        resolve(success);
      })
      .catch(console.error);
  });
};

// END API CALLS
/****************************************************************************************************************************************************/
