import * as Constants from "constants/Constants";
const contentful = require("contentful/dist/contentful.browser.min.js");
const client = contentful.createClient({
  space: Constants.AUTH_PENTECH_SPACE_ID,
  accessToken: Constants.AUTH_PENTECH_ACCESS_TOKEN_DELIVERY,
});
import {
  insertSupportLink,
  insertFrequentlyAskedQuestion,
} from "db/InsertScripts";
import { grabSingleSupportLinkByUrl } from "db/SelectScripts";

/****************************************************************************************************************************************************/
// START API CALLS
// grabUserConditionsAPI() {
//   // This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token. ie. the Conditions.
//   // We then start building our own custom json object array.
// usage => https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/
export const fetchAVOConditions = (apiKey: String): Promise<any> => {
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
};

export const fetchPDF = (apiKey: String): Promise<any> => {
  return new Promise((resolve, reject) => {
    client
      .getEntry(apiKey)
      .then((entry: any) => {
        resolve(entry.fields.avoPdfFileUpload.fields.file.url);
      })
      .catch((err: Error) => {
        resolve(err);
      });
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
  let x = 0;
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
