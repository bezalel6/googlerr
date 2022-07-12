# Googlerr — Search for error solutions on Stack Overflow

Demonstrates VS Code's proposed [webview view API](https://github.com/microsoft/vscode/issues/46585). This includes:

- Contributing a webview based view to the explorer.
- Posting messages from an extension to a webview view
- Posting message from a webview to an extension
- Persisting state in the view.
- Contributing commands to the view title.

## VS Code API

### `vscode` module

- [`window.registerWebviewViewProvider`](https://code.visualstudio.com/api/references/vscode-api#window.registerWebviewViewProvider)

## Running the example

- Open this example in VS Code 1.49+
- `npm install`
- `npm run watch` or `npm run compile`
- `F5` to start debugging

Select the quick fix on any error to google it. you can also select any text and google similar questions from the context menu.
