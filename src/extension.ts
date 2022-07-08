// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { subscribeToDocumentChanges, EMOJI_MENTION } from "./diagnostics";
import { SidebarProvider } from "./SidebarProvider";



// import './Solutions.ts'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "googlerr" is now active!');

  // // The command has been defined in the package.json file
  // // Now provide the implementation of the command with registerCommand
  // // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand(
  //   "googlerr.helloWorld",
  //   () => {
  //     //   // The code you place here will be executed every time your command is executed
  //     //   // Display a message box to the user
  //     //   vscode.window.showInformationMessage("Hello World from Googlerr!");
  //     HelloWorldPanel.createOrShow(context.extensionUri);
  //   }
  // );

  // context.subscriptions.push(disposable);


  

  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "googlerr-sidebar",
      sidebarProvider
    )
  );




  context.subscriptions.push(
    vscode.commands.registerCommand("googlerr.askQuestion", async () => {
      const ans = await vscode.window.showInformationMessage(
        "how was your day?",
        "good",
        "bad",
        "shit"
      );
      console.log(ans);
      if (ans === "shit") {
        vscode.window.showInformationMessage("damn");
      }
    })
  );  context.subscriptions.push(
    vscode.commands.registerCommand("googlerr.searchErr", async (e) => {
      console.log('search err',e)
      sidebarProvider._view?.webview.postMessage({
        command:'search',value:e
      });
    })
  );
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("*", new Emojizer(), {
      providedCodeActionKinds: Emojizer.providedCodeActionKinds,
    })
  );

  const emojiDiagnostics = vscode.languages.createDiagnosticCollection("emoji");
  context.subscriptions.push(emojiDiagnostics);

  subscribeToDocumentChanges(context, emojiDiagnostics);

  //   context.subscriptions.push(
  //     vscode.languages.registerCodeActionsProvider("*", new Emojinfo(), {
  //       providedCodeActionKinds: Emojinfo.providedCodeActionKinds,
  //     })
  //   );

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

// this method is called when your extension is deactivated
export function deactivate() {}
const COMMAND = "code-actions-sample.command";

/**
 * Provides code actions for converting :) to a smiley emoji.
 */
export class Emojizer implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.Refactor,
  ];
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    // if (!this.isAtStartOfSmiley(document, range)) {
    //   return;
    // }


    // let activeEditor = vscode.window.activeTextEditor;
    // let curPos = activeEditor!.selection.active;
    // let offset = document.offsetAt(curPos);

    let errs = vscode.languages
      .getDiagnostics(document.uri)
      .filter((err) => err.severity === 0&&(err.range.contains(range)||err.range.contains(vscode.window.activeTextEditor!.selection.active)));

    if (!errs.length) {
      return;
    }
	// errs = [errs[0]];
    errs.forEach((e) => console.log(e.message));
    // range = errs[0].range;
    
    // console.log(document.getText(range));
    const ret = new Array<vscode.CodeAction>;
    errs.forEach((e) => {
      const err = {errorMessage:e.message,problematic:document.getText(e.range),ogErr:e}
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

  private isAtStartOfSmiley(
    document: vscode.TextDocument,
    range: vscode.Range
  ) {
    const start = range.start;
    const line = document.lineAt(start.line);
    return (
      line.text[start.character] === ":" &&
      line.text[start.character + 1] === ")"
    );
  }

  private createFix(
    err:any
  ): vscode.CodeAction {
    const fix = new vscode.CodeAction(
      //   `Convert to ${emoji}`,
      err.errorMessage,
      vscode.CodeActionKind.QuickFix
    );
    fix.command = { command: "googlerr.searchErr",arguments:[err] ,title: "fff" };
    // fix.edit = new vscode.WorkspaceEdit();
    // fix.edit.replace(
    //   document.uri,
    //   //   new vscode.Range(range.start, range.start.translate(0, 2)),
    //   range,
    //   emoji
    // );
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

// /**
//  * Provides code actions corresponding to diagnostic problems.
//  */
// export class Emojinfo implements vscode.CodeActionProvider {
//   public static readonly providedCodeActionKinds = [
//     vscode.CodeActionKind.QuickFix,
//   ];

//   provideCodeActions(
//     document: vscode.TextDocument,
//     range: vscode.Range | vscode.Selection,
//     context: vscode.CodeActionContext,
//     token: vscode.CancellationToken
//   ): vscode.CodeAction[] {
//     // for each diagnostic entry that has the matching `code`, create a code action command
//     return context.diagnostics
//       .filter((diagnostic) => diagnostic.code === EMOJI_MENTION)
//       .map((diagnostic) => this.createCommandCodeAction(diagnostic));
//   }

//   private createCommandCodeAction(
//     diagnostic: vscode.Diagnostic
//   ): vscode.CodeAction {
//     const action = new vscode.CodeAction(
//       "Learn more...",
//       vscode.CodeActionKind.QuickFix
//     );
//     action.command = {
//       command: COMMAND,
//       title: "Learn more about emojis",
//       tooltip: "This will open the unicode emoji page.",
//     };
//     action.diagnostics = [diagnostic];
//     action.isPreferred = true;
//     return action;
//   }
// }
