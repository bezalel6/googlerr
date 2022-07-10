import type { Answer, LintingError, Question } from "./types";

// console.log(process.env);

// remove this after you've confirmed it working
let wrapping = false;
(function () {
  const vscode = acquireVsCodeApi();

  // Handle messages sent from the extension to the webview
  window.addEventListener("message", (event) => {
    const message = event.data; // The json data that the extension sent
    console.log("%cting.ts line:7 event", "color: #007acc;", event);
    console.log("%cting.ts line:28 message", "color: #007acc;", message);
    switch (message.type) {
      case "clear": {
        document.body.innerHTML = "";
        break;
      }
      case "wrapping": {
        wrapping = !wrapping;
        refreshCode();
        break;
      }
      case "search": {
        const error: LintingError = message.error;
        const div = document.createElement("div");
        const header = document.createElement("h2");
        // header.style.textDecoration = "underline";
        header.innerText = "Searching: " + error.error;
        div.appendChild(header);
        document.body.appendChild(div);
        search(error.error).then(async (res) => {
          // console.log("%cting.ts line:25 res", "color: #007acc;", res);
          // list of questions
          //   const questions = Array<Question>();
          const questions = await Promise.all(res);
          const ul = create({ className: "questions" });
          questions.forEach((question) => {
            ul.appendChild(questionComponent(question));
          });
          div.appendChild(ul);
          //   header.innerText = JSON.stringify(res);
        });
        refreshCode();
        break;
      }
    }
  });
})();
function refreshCode() {
  console.log(wrapping);
  document.querySelectorAll("code").forEach((element) => {
    if (wrapping) element.setAttribute("wrapping", "true");
    else element.removeAttribute("wrapping");
  });
}
function questionComponent(question: Question) {
  const component = create({ className: "question" });
  const questionTitle = create({ className: "title secondary", t: "h6" });
  // a.href = question.link;
  questionTitle.innerText = question.title;
  component.appendChild(questionTitle);
  // add the answers to the li
  const answers = question.answers;
  const answersList = create({ className: "answers" });
  answers.forEach((answer) => {
    const answerComponent = create({ className: "answer" });
    answerComponent.innerHTML = answer.html;
    //   add the upvote count to the li
    answersList.appendChild(answerComponent);
    //   add a link to the answer
    const answerLink = document.createElement("a");
    answerLink.href = question.link;
    answerLink.innerText = "upvotes: " + answer.upvoteCount;
    answerComponent.appendChild(answerLink);
  });
  // make answerList togglable
  answersList.style.display = "none";
  questionTitle.style.cursor = "pointer";
  questionTitle.addEventListener("click", () => {
    if (answersList.style.display === "none") {
      answersList.style.display = "block";
    } else {
      answersList.style.display = "none";
    }
  });
  component.appendChild(answersList);
  return component;
  //   ul.appendChild(li);
}
function create({ className, t = "div" }: { className?: string; t?: string }) {
  const e = document.createElement(t);
  if (className) {
    e.className = className;
  }
  return e;
}

function search(query: string): Promise<Promise<Question>[]> {
  const url =
    "https://www.googleapis.com/customsearch/v1/siterestrict?" +
    new URLSearchParams({
      key: "AIzaSyDJlLqzounlGfh2Yh-dg_3L8v732ETR4uA",
      cx: "905ca5f933d95c2cb",
      q: query,
      num: "3",
    });
  return fetch(url)
    .then((res: any) => res.json())
    .then((results: any) => {
      console.log("%ctest.ts line:54 results", "color: #007acc;", { results });
      return results.items.map(async (obj: any) => {
        const { title, htmlTitle, link, pagemap } = obj;
        const answers: Answer[] = await getAcceptedAnswer(
          link.split("questions/")[1].split("/")[0]
        );
        return {
          title,
          htmlTitle,
          link,
          answers,
        };
      });
    });

  //   console.log("%ctest.ts line:58 questions", "color: #007acc;", questions);
  //   return questions;
  // });
}
const FILTER =
  "!*SU8CGYZitCB.D*(BDVIficKj7nFMLLDij64nVID)N9aK3GmR9kT4IzT*5iO_1y3iZ)6W.G*";
// get accepted answer from stackoverflow question id
const getAcceptedAnswer = async (questionId: string) => {
  const url =
    "https://api.stackexchange.com/2.2/questions/" +
    questionId +
    "?order=desc&sort=activity&site=stackoverflow&filter=" +
    FILTER;
  try {
    const res = await fetch(url);
    const res_1 = await res.json();
    // console.log(res_1);
    return res_1.items[0].answers.map((ans: any) => {
      return {
        dateCreated: ans.creation_date,
        html: ans.body,
        upvoteCount: ans.score,
        isAccepted: ans.is_accepted,
      };
    });
  } catch (e) {
    return e;
  }
};
