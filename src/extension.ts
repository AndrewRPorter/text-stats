import * as vscode from "vscode";
import * as config from "./config";

let statusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
    // display text statistics in pop-up to user
	let disposable = vscode.commands.registerCommand("extension.textStats", () => {
        vscode.window.showInformationMessage(getTextStatistics(vscode.window.activeTextEditor));
	});

    // create a new status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = "extension.textStats";

    // register events
    subscriptions.push(disposable);
    subscriptions.push(statusBarItem);
    subscriptions.push(vscode.workspace.onDidChangeTextDocument(updateStatusBarItem));
    subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
}
 
/**
 * Updates the text statistics in the status bar
 */
function updateStatusBarItem(): void {
    let num_words = getNumberOfWords(vscode.window.activeTextEditor);
    let num_selected = getNumberOfSelectedWords(vscode.window.activeTextEditor);

    if (num_words > 0) {
        if (num_words === 1) {
            statusBarItem.text = "1 word";
        } else {
            statusBarItem.text = `${num_words} words`;
        }

        // display selected words if enabled in configuration
        if (config.showSelected() && num_selected > 0) {
            if (config.showPercentageSelected()) {
                let percent_selected = getPercentageOfSelectedWords(num_words, num_selected);
                statusBarItem.text = statusBarItem.text + ` (${num_selected} selected ${percent_selected}%)`;
            } else {
                statusBarItem.text = statusBarItem.text + ` (${num_selected} selected)`;
            }
        }        

        statusBarItem.show();
		
	} else {
		statusBarItem.hide();
	}
}

/**
 * Returns the number of words in the editor
 * @param editor Current active text editor
 */
function getNumberOfWords(editor: vscode.TextEditor | undefined): number {
    let text = "";

	if (editor) {
        text = editor.document.getText().trim();
    }

	return countWords(text);
}

/**
 * Returns the number of selected words in the editor
 * @param editor Current active text editor
 */
function getNumberOfSelectedWords(editor: vscode.TextEditor | undefined): number {
    let text = "";

	if (editor) {
        text = editor.document.getText(editor.selection).trim();
    }
    
	return countWords(text);
}

/**
 * Calculates the percentage of words in the document that are selected
 * @param num_total Total number of words in a document
 * @param num_selected Total number of selected words
 */
function getPercentageOfSelectedWords(num_total: number, num_selected: number): number {
    let percent_selected = (num_selected/num_total)*100;
    return Number(percent_selected.toFixed(config.getRoundedDigits()));
}

/**
 * Returns document text statistics
 * 
 * @param editor Current active text editor
 */
function getTextStatistics(editor: vscode.TextEditor | undefined): string {
    let total_words = getNumberOfWords(vscode.window.activeTextEditor);
    let total_selected = getNumberOfSelectedWords(vscode.window.activeTextEditor);
    let percent_selected = getPercentageOfSelectedWords(total_words, total_selected);

    let stats = `Total Words: ${total_words}, Selected Words: ${total_selected}, Selected Percentage: ${percent_selected}%`;

    return stats;
}

/**
 * Counts the number of words in a document
 * @param text Input text from document
 */
export function countWords(text: string): number {
    let num_words = 0;

    if (text === "") {
        return 0;
    }

    text = text.replace(/ +(?= )/g, "");  // remove mutli-space spaces
    text = text.replace(/[^\w\s]/g, "");  // remove all non word characters from string
    
    // exclude numbers from text if disabled in config
    if (!config.includeNumbers()) {
        text = text.replace(/\d+/g, "");  // remove all digits from text
        console.log(text);
    }

    text = text.trim()
    
    num_words = text.split(/\s+/).length;
    return num_words;
}

export function deactivate() {}