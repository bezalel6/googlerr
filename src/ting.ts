import type { Answer, LintingError, Question } from "./types";

// console.log(process.env);

// remove this after you've confirmed it working
let topHeader: HTMLElement, contentDiv: HTMLElement;
let wrapping = false;
(function () {
  const vscode = acquireVsCodeApi();
  topHeader = document.createElement("h2");
  topHeader.className = "big-bottom-divide";
  contentDiv = document.createElement("div");
  document.body.appendChild(topHeader);
  document.body.appendChild(contentDiv);

  resetDoc();
  resetHeader();
  // Handle messages sent from the extension to the webview
  window.addEventListener("message", (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case "clear": {
        resetDoc();
        resetHeader();
        break;
      }
      case "wrapping": {
        wrapping = !wrapping;
        refreshWrap();
        break;
      }
      case "search": {
        const error: LintingError = message.error;
        const div = document.createElement("div");
        // const header = document.createElement("h2");
        resetDoc();
        setHeader("Searching for questions related to: " + error.error);
        // header.style.textDecoration = "underline";
        // header.innerText = "Searching: " + error.error;
        // div.appendChild(header);
        contentDiv.appendChild(div);
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

        // div.appendChild(e);
        refreshWrap();
        break;
      }
    }
  });
})();

/**
 * Header
 * ______
 *
 */
function resetHeader() {
  setHeader("Select a quick fix to google an error");
}
function resetDoc() {
  contentDiv!.childNodes.forEach((node) => node.remove());
}
function setHeader(text: string) {
  topHeader.innerText = text;
}
function refreshWrap() {
  console.log(wrapping);
  document.querySelectorAll("code").forEach((element) => {
    if (wrapping) element.setAttribute("wrapping", "true");
    else element.removeAttribute("wrapping");
  });
}
function questionComponent(question: Question) {
  const component = create({ className: "question" });
  const questionTitle = create({
    className: "collapse-parent title secondary",
    t: "h6",
  });
  questionTitle.setAttribute("collapsed", "true");
  // a.href = question.link;
  questionTitle.innerText = question.title;
  component.appendChild(questionTitle);
  // add the answers to the li
  const answers = question.answers;
  const answersList = create({ className: "answers collapse-child" });
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
      questionTitle.removeAttribute("collapsed");
    } else {
      questionTitle.setAttribute("collapsed", "true");
      answersList.style.display = "none";
    }
  });
  component.appendChild(answersList);
  const e = document.createElement("div");
  e.className = "bottom-divide";
  component.appendChild(e);
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
      key: "AIzaSyAU6qyQPUcoDXlJ4yx7XzmolKmlQT9-0qQ",
      cx: "4389765c85adc6f42",
      q: query,
      num: "3",
    });
  return fetch(url)
    .then((res: any) => res.json())
    .then((results: any) => {
      console.log("%ctest.ts line:54 results", "color: #007acc;", { results });
      return results.items.map(async (obj: any) => {
        const { title, htmlTitle, link } = obj;
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
