export interface LintingError {
  errorMessage: string;
  problematic: string;
}

export interface Message {
  command: string;
  value: any;
}
export interface Answer {
  dateCreated: string;
  text: string;
  upvoteCount: string;
}
export interface Question {
  title: string;
  htmlTitle: string;
  link: string;
  answers: Answer[];
}
