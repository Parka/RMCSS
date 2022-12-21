import * as assert from 'assert';
import * as vscode from 'vscode';

const SAMPLE = `
<div className="lala">LALA</div>
<div className = 'lele'>LELE</div>
<div className= "lili">LILI</div>
<div something="whatever" className ="lulu">LULU</div>
`;

const EXPECTED = `
<div className={styles.lala}>LALA</div>
<div className={styles.lele}>LELE</div>
<div className={styles.lili}>LILI</div>
<div something="whatever" className={styles.lulu}>LULU</div>
`;

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Simple test', async () => {
		// Create a new document with SAMPLE content
		const document = await vscode.workspace.openTextDocument({
			content: SAMPLE
		});

		// Set document text editor as active
		await vscode.window.showTextDocument(document);

		// Put cursor on each className prop, value or =
		if(!vscode.window.activeTextEditor) { return; };
		vscode.window.activeTextEditor.selections = [
			new vscode.Selection(1, 10, 1, 11),
			new vscode.Selection(2, 19, 2, 19),
			new vscode.Selection(3, 15, 3, 16),
			new vscode.Selection(4, 30, 4, 30),
		];

		// Run command
		await vscode.commands.executeCommand('rmcss.modularize');
		
		// Assert modular version is now the current text
		assert.equal(document.getText(), EXPECTED);
	});
});
