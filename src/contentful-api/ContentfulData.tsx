import * as Constants from "constants/Constants";
const contentful = require("contentful/dist/contentful.browser.min.js");
const client = contentful.createClient({
  space: Constants.AUTH_PENTECH_SPACE_ID,
  accessToken: Constants.AUTH_PENTECH_ACCESS_TOKEN_DELIVERY,
});

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
        console.log("startings");
        //we'll loop through each entry
        // let x = 0;
        // res.items.forEach(async (element) => {
        //   let item = element.fields;
        //   let isAnArticle = typeof item.url !== "undefined";
        //   if (item.url) {
        //     x++;
        //     console.log("TEST == " + x);
        //     console.log(item.articleTitle);
        //     // resolve(true);
        //     // return;
        //   }
        //   // res.items.forEach(async (element) => {
        // });
        // });
      })
      .catch(console.error);
  });
};

// END API CALLS
/****************************************************************************************************************************************************/
