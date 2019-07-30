import * as vscode from 'vscode';

/**
 * Checks configuration settings for showning selected words in status bar
 */
export function showSelected(): boolean {
    return vscode.workspace.getConfiguration("text-stats").showSelected === "on";
}