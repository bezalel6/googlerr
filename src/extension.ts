import * as vscode from "vscode";
import { ViewProvider } from "./ViewProvider";
import { LintingError } from "./types";

export function activate(context: vscode.ExtensionContext) {
  const provider = new ViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("*", new ActionProvider(), {
      providedCodeActionKinds: ActionProvider.providedCodeActionKinds,
    })
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ViewProvider.viewType, provider)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("googlerr.searchErr", (e) => {
      provider.searchError(e);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("googlerr.searchSelected", (e) => {
      // get selection

      provider.searchSelected();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("googlerr.sayHello", (e) => {
      vscode.window.showInformationMessage("hello");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("googlerr.clear", () => {
      provider.clear();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("googlerr.wrapping", () => {
      provider.wrapping();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND, () =>
      vscode.env.openExternal(
        vscode.Uri.parse(
          "https://unicode.org/emoji/charts-12.0/full-emoji-list.html"
        )
      )
    )
  );
}
export class ActionProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    const errs = vscode.languages
      .getDiagnostics(document.uri)
      .filter(
        (err) =>
          /*err.severity === 0&&*/ err.range.contains(range) ||
          err.range.contains(vscode.window.activeTextEditor!.selection.active)
      );

    if (!errs.length) {
      return;
    }
    const ret = new Array<vscode.CodeAction>();
    errs.forEach((e) => {
      const err: LintingError = {
        error: e.message,
        origin: document.getText(e.range),
        fullError: e,
      };
      ret.push(this.createFix(err));
    });
    // const replaceWithSmileyCatFix = this.createFix(document, range, "😺");

    // const replaceWithSmileyFix = this.createFix(document, range, "😀");
    // Marking a single fix as `preferred` means that users can apply it with a
    // single keyboard shortcut using the `Auto Fix` command.
    // replaceWithSmileyFix.isPreferred = true;

    // const replaceWithSmileyHankyFix = this.createFix(document, range, "💩");

    // const commandAction = this.createCommand();

    // return [...ret, commandAction];
    return ret;
  }

  private createFix(err: LintingError): vscode.CodeAction {
    // get error message and if its too long, truncate it
    const errorMsg =
      err.error.length > 50 ? err.error.slice(0, 50) + "..." : err.error;
    const fix = new vscode.CodeAction(
      "Googlerr: " + errorMsg,
      vscode.CodeActionKind.QuickFix
    );
    fix.command = {
      command: "googlerr.searchErr",
      arguments: [err],
      title: "fff",
    };
    return fix;
  }

  private createCommand(): vscode.CodeAction {
    const action = new vscode.CodeAction(
      "Learn more...",
      vscode.CodeActionKind.QuickFix
    );
    action.command = {
      command: COMMAND,
      title: "Learn more about emojis",
      tooltip: "This will open the unicode emoji page.",
    };
    return action;
  }
}
export function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
const COMMAND = "code-actions-sample.command";
