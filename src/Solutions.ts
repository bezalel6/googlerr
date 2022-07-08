// // // get api key using dot-env
// // // import { load } from "ts-dotenv";
// // // const env = load({
// // //   GOOGLE_API_KEY: String,
// // // });
// // // import { config } from "dotenv";
// // import { URLSearchParams } from "url";
// var { URLSearchParams } = require("url");
// var fetch = require("node-fetch");

// // var { Answer } = require("E:\\SharedCo\\googlerr\\webviews\\types\\Types");
// // import type { Answer, LintingError, Question } from "../webviews/types/Types";
// // var { Answer, LintingError, Question } = require("../webviews/types/Types");
// // import fetch from "node-fetch";

// interface LintingError {
//   errorMessage: string;
//   problematic: string;
// }

// interface Message {
//   command: string;
//   value: any;
// }
// interface Answer {
//   dateCreated: string;
//   text: string;
//   upvoteCount: string;
// }
// interface Question {
//   title: string;
//   htmlTitle: string;
//   link: string;
//   answers: Answer[];
// }

// // // const confd = config({ path: "E:\\SharedCo\\googlerr\\src\\.env" });
// // // console.log("%csolutions.ts line:10 confd", "color: #007acc;", confd);
// // // const KEY = confd.parsed!.GOOGLE_API_KEY;
// const GOOGLE_API_KEY = "AIzaSyDJlLqzounlGfh2Yh-dg_3L8v732ETR4uA";
// const KEY = GOOGLE_API_KEY;

// const search = (query: string) => {
//   const url =
//     "https://www.googleapis.com/customsearch/v1/siterestrict?" +
//     new URLSearchParams({
//       key: KEY,
//       cx: "905ca5f933d95c2cb",
//       q: query,
//       num: "3",
//     });
//   return fetch(url)
//     .then((res: any) => res.json())
//     .then((results: any) => {
//       // console.log("%ctest.ts line:54 results", "color: #007acc;", { results });
//       const questions: Question[] = results.items.map((obj: any) => {
//         const { title, htmlTitle, link, pagemap } = obj;
//         return {
//           title,
//           htmlTitle,
//           link,
//           answers: convertAnswers(pagemap.answer),
//         };
//       });
//       // console.log("%ctest.ts line:58 questions", "color: #007acc;", questions);
//       return questions;
//     });
// };
// function convertAnswers(answers: any): Answer[] {
//   const ret: Answer[] = [];
//   answers.forEach((a: any) => {
//     ret.push({
//       dateCreated: a.datecreated,
//       text: a.text,
//       upvoteCount: a.upvotecount,
//     });
//   });
//   return ret;
// }
export function searchForSolution(error: any): Promise<any[]> {
  // return search(error.errorMessage);
  return Promise.resolve([]);
}
