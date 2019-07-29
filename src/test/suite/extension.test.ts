import * as assert from 'assert';
import { before } from 'mocha';

import * as vscode from 'vscode';
import * as extension from "../../extension";

suite("Extension Test Suite", () => {
	before(() => {
		vscode.window.showInformationMessage("Starting all tests...");
	});

	test("testWordCount", () => {
		assert.equal(extension.countWords(""), 0);
	});
});
