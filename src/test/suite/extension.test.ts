import * as assert from "assert";
import { afterEach } from "mocha";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  afterEach(async () => {
    await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
  });

  test("Simple test", async () => {
    const SAMPLE =
`
<div className="lala">LALA</div>
<div className = 'lele'>LELE</div>
<div className= "lili">LILI</div>
<div something="whatever" className ="lulu">LULU</div>
`;

    const EXPECTED =
`
<div className={styles.lala}>LALA</div>
<div className={styles.lele}>LELE</div>
<div className={styles.lili}>LILI</div>
<div something="whatever" className={styles.lulu}>LULU</div>
`;
    // Create a new document with SAMPLE content
    const document = await vscode.workspace.openTextDocument({
      content: SAMPLE,
    });

    // Set document text editor as active
    await vscode.window.showTextDocument(document);

    // Put cursor on each className prop, value or =
    if (!vscode.window.activeTextEditor) {
      throw new Error();
    }
    vscode.window.activeTextEditor.selections = [
      new vscode.Selection(1, 10, 1, 11),
      new vscode.Selection(2, 19, 2, 19),
      new vscode.Selection(3, 15, 3, 16),
      new vscode.Selection(4, 30, 4, 30),
    ];

    // Run command
    await vscode.commands.executeCommand("rmcss.modularize");

    // Assert modular version is now the current text
    assert.equal(document.getText(), EXPECTED);
  });

  test("Same line, single replace", async () => {
    const SAMPLE =
			`<div className="lala"> <div className = 'lele'>LELE</div> </div>`;

    const EXPECTED =
			`<div className={styles.lala}> <div className = 'lele'>LELE</div> </div>`;

    // Create a new document with SAMPLE content
    const document = await vscode.workspace.openTextDocument({
      content: SAMPLE,
    });

    // Set document text editor as active
    await vscode.window.showTextDocument(document);

    // Put cursor on each className prop, value or =
    if (!vscode.window.activeTextEditor) {
      throw new Error();
    }
    vscode.window.activeTextEditor.selections = [
      new vscode.Selection(0, 10, 0, 11),
    ];

    // Run command
    await vscode.commands.executeCommand("rmcss.modularize");

    // Assert modular version is now the current text
    assert.equal(document.getText(), EXPECTED);
  });

  test("Same line, multiple replaces", async () => {
    const SAMPLE =
			`<div className="lala"> <div className = 'lele'>LELE</div> </div>`;

    const EXPECTED =
			`<div className={styles.lala}> <div className={styles.lele}>LELE</div> </div>`;

    // Create a new document with SAMPLE content
    const document = await vscode.workspace.openTextDocument({
      content: SAMPLE,
    });

    // Set document text editor as active
    await vscode.window.showTextDocument(document);

    // Put cursor on each className prop, value or =
    if (!vscode.window.activeTextEditor) {
      throw new Error();
    }
    vscode.window.activeTextEditor.selections = [
      new vscode.Selection(0, 10, 0, 11),
      new vscode.Selection(0, 33, 0, 33),
    ];

    // Run command
    await vscode.commands.executeCommand("rmcss.modularize");

    // Assert modular version is now the current text
    assert.equal(document.getText(), EXPECTED);
  });
});
