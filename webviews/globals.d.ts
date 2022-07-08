import type { type } from "os";
import * as _vscode from "vscode";
import { Message } from "../globals";
declare global {
  const tsvscode: {
    postMessage: (message: Message) => void;
  };
}
