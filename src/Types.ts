import { Diagnostic } from "vscode";

export type LintingError = {
  error: string;
  origin?: string;
  fullError?: Diagnostic;
};
export interface Message {
  command: string;
  value: any;
}
export interface Answer {
  dateCreated: string;
  html: string;
  upvoteCount: string;
  isAccepted: boolean;
}
export interface Question {
  title: string;
  htmlTitle: string;
  link: string;
  answers: Answer[];
}
