import * as vscode from "vscode";
import dotenv from "dotenv";
import path from "path"; 

//For local development, uncomment the following lines to load .env file
const envPath = path.resolve(__dirname, '../.env'); 

console.log(`Loading .env from: ${envPath}`);

dotenv.config({ path: envPath });

console.log('GROQ_API_KEY loaded:', process.env.GROQ_API_KEY ? 'Yes' : 'No'); 

import { runAndMerge } from "./tools/index";

export function activate(context) {
  console.log("Accessibility AI Agent extension is active!");

  let disposable = vscode.commands.registerCommand("extension.checkAccessibility", async () => {
    const editor = vscode.window.activeTextEditor;
    console.log("Active editor:", editor);
    if (!editor) {
      vscode.window.showInformationMessage("Please open a code file first.");
      return;
    }

    const originalCode = editor.document.getText();
    const languageId = editor.document.languageId;

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Improving accessibility with AI...",
        cancellable: false,
      },
      async () => {
        try {
          console.log("Calling runAndMerge..."); 
          const improvedCode = await runAndMerge(originalCode);
          console.log("runAndMerge returned."); 
          if (!improvedCode || improvedCode === originalCode) {
            vscode.window.showInformationMessage("No accessibility improvements suggested.");
            return;
          }

          const fullRange = new vscode.Range(
            editor.document.positionAt(0),
            editor.document.positionAt(originalCode.length)
          );

          await editor.edit(editBuilder => {
            editBuilder.replace(fullRange, improvedCode);
          });

          vscode.window.showInformationMessage("Accessibility improvements applied!");

          // const doc = await vscode.workspace.openTextDocument({
          //   content: improvedCode,
          //   language: editor.document.languageId,
          // });
          // await vscode.window.showTextDocument(doc);
          console.log("Improved code displayed."); // Add this
        } catch (err) {
          vscode.window.showErrorMessage(`Error: ${err.message || err}`);
          console.error("Error during accessibility check:", err); // Add this
        }
      }
    );
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
