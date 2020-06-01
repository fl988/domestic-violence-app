import * as Constants from "constants/Constants";
import { openDatabase } from "expo-sqlite";
const db = openDatabase(Constants.DB_NAME);

import { fetchArticleOfTheDay } from "contentful-api/ContentfulData";
import { createArticles } from "db/CreateScripts";
import { insertArticles } from "db/InsertScripts";

export const fetchArticlesAndSave = (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      let success = await createArticles();
      if (success) {
        let res = await fetchArticleOfTheDay();

        //we'll loop through each entry
        res.items.forEach(async (element) => {
          let item = element.fields;
          if (typeof item.url !== "undefined") {
            let articleImage = "";
            if (typeof item.articleImage !== "undefined") {
              articleImage = item.articleImage.fields.file.url;
            }

            let insert = await insertArticles(
              item.url,
              item.articleTitle,
              articleImage
            );
          }
        });

        resolve(true);
      } else {
        console.log("FAILED TO CREATE A TABLE ARTICLES");
      }
    } catch (error) {}
  });
};
