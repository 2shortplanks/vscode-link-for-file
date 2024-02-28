import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('vscode-url-for-line.copyURLForLine', () => {
			let ed = getEditorOrDisplayError();
			if (!ed) {
				return;
			}

			copyToClipboard(getLink(getInfo(ed)), "URL copied to clipboard");
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('vscode-url-for-line.copyMarkdownLinkForLine', () => {
			let ed = getEditorOrDisplayError();
			if (!ed) {
				return;
			}

			let info = getInfo(ed);
			copyToClipboard(
				markdownLink(getName(info),getLink(info)),
				"Markdown link copied to clipboard"
			);
		})
	);
}

interface Info {
	filename: string,
	relativeFilename: string | null,
	line: number,
	col: number,
}

function getEditorOrDisplayError() : vscode.TextEditor | null {
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active editor');
		return null;
	}
	return editor;
}

function copyToClipboard(text: string, message: string) {
	vscode.env.clipboard.writeText(text).then(() => {
		vscode.window.showInformationMessage(message);
	}, err => {
		vscode.window.showErrorMessage('Unable to copy to clipboard');
	});
}

function getInfo(editor: vscode.TextEditor) : Info {
	let wf = vscode.workspace.workspaceFolders;
	let relativeFilename = (wf && wf.length > 0) ? path.relative(wf[0].uri.path, editor.document.fileName) : null;

	return {
		filename: editor.document.fileName,
		relativeFilename: relativeFilename,
		line: editor.selection.active.line,
		col: editor.selection.active.character
	};
}

function getName(info: Info) : string {
	let filename = info.relativeFilename ? info.relativeFilename : info.filename;
	if (info.col === 0) {
		if (info.line === 0) {
			return filename;
		}
		return `${filename} line ${info.line + 1}`;
	}
	return `${filename} line ${info.line + 1} column ${info.col + 1}`;
}

function getLink(info: Info) : string {
	return `vscode://file/${encodeURIComponent(info.filename)}:${info.line + 1}:${info.col + 1}`;
}

function markdownLink(text: string, url: string) : string {
	// why aren't we escaping the funny characters in the URL?  Because,
	// (1) we've URL encoded it so there are no funny chars in there that will
	//     break the URL, and
	// (2) Not everything that uses URL will allow you to, say, escape "." etc
	//     even though the commonmark standard implies you can.  Obsidian, for
	//     example will treat a \. as a literal backslash and a literal ., and
	//     then the link won't work.
	// However, we do need to escape ( and ) to stop breaking the closing link
	// bracket (we need to escape "(" because markdown has a weird concept
	// of "balanced" open and closed brackets, meaning oh-no unintended side
	// effects of letting "(" be there)
	return '[' + markdownEscape(text) + '](' + encodeURIbrackets(url) + ')';
}

function markdownEscape(text: string) : string {
	return text.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&');
}

function encodeURIbrackets(text: string) : string {
	return text.replaceAll("(", '%28').replaceAll(")", '%29');
}
