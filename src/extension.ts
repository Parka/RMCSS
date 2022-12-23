// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const CLASSNAME_REGEX = new RegExp(/className\s?=\s?['"]([^'"]*)['"]/);
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('rmcss.modularize', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const { activeTextEditor } = vscode.window;
		const { selections, document } = activeTextEditor || {};
		const { className } = vscode.workspace.getConfiguration('rmcss');
		
		if (!activeTextEditor) { return; };
		if(!selections?.length) { return; };
		
		await activeTextEditor?.edit(editor => 
			selections.forEach(selection => {
				const finalSelection = document?.getWordRangeAtPosition(
					selection.start,
					CLASSNAME_REGEX
				);

				if (!finalSelection) { return; };

				const text = activeTextEditor?.document.getText(finalSelection);
				editor.replace(finalSelection, `className={${className}.${text.replace(CLASSNAME_REGEX, '$1')}}`);
			})
		);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
