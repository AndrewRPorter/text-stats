import * as vscode from 'vscode';

/**
 * Checks configuration settings for showing selected words in status bar
 */
export function showSelected(): boolean {
    return vscode.workspace.getConfiguration("text-stats").showSelected === "on";
}

/**
 * Checks configuration settings for showing percentage of selected words in status bar
 */
export function showPercentageSelected(): boolean {
    return vscode.workspace.getConfiguration("text-stats").showPercentageSelected === "on";
}

/**
 * Checks the configuration settings for number of rounded digits when displaying selected word percentage
 */
export function getRoundedDigits(): number {
    return vscode.workspace.getConfiguration("text-stats").numDigits;
}