import type { LintingError, Message, Question } from "./Types";
import QuestionComponent from "./QuestionComponent";
import { useEffect, useState } from "react";
export default function SideBar() {
  // import {a} from '../../src/Solutions'
  // import {searchForSolution} from '../../src/solutions'
  let data: { error: LintingError; found?: Question[] } | null = null;
  useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data as Message;
      switch (message.command) {
        case "search": {
          console.log("got msg", message);
          data = { error: message.value.errorMessage as LintingError };

          // searchForSolution(data.error).then(res=>{
          //     console.log('%cSidebar.svelte line:21 res', 'color: #007acc;', res);
          //     data = {error:data!.error,found:res}
          // })
          break;
        }
      }
    });
  }, []);

  return <></>;
}
