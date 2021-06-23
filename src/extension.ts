// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tree-state" is now active!');
	const eventer = new vscode.EventEmitter<Message>();

	const sample = new Sample(eventer);
	const treeview = vscode.window.createTreeView<GenericNode>('sample', { treeDataProvider: sample });
	vscode.window.registerTreeDataProvider('sample', sample);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposables = [vscode.commands.registerCommand('tree-state.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from tree-state!');
	}), vscode.commands.registerCommand('event.expand', () => {
		eventer.fire({ type: 'EXPAND' });
	})];


	disposables.forEach(disposable => context.subscriptions.push(disposable));
}

interface Message {
	type: 'EXPAND';
}

class Sample implements vscode.TreeDataProvider<GenericNode> {
	trigger = new vscode.EventEmitter<GenericNode|undefined>();
	onDidChangeTreeData = this.trigger.event;
	expand = false;

	constructor(eventer: vscode.EventEmitter<Message>) {
		eventer.event(message => {
			if (message.type === 'EXPAND') {
				this.expand = true;
			}
			this.trigger.fire(undefined);
		});
	}

	getTreeItem(element: One): vscode.TreeItem {
    return element.getTreeItem();
  }

	getChildren(element?: One) {
		if (element) {
			return element.getChildren();
		}
		return [
			new One('hello', this.expand),
			new One('hello-2', this.expand)
		];
	}
}

class One implements GenericNode {
	constructor(readonly name: string, readonly expand: boolean) {}
	getChildren() {
		return [new Two('hello-child')];
	}
	getTreeItem() {
		const item = new vscode.TreeItem(this.name);
		item.collapsibleState = this.expand ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None;
		return item;
	}
}

class Two implements GenericNode {
	constructor(readonly name: string) {}
	getChildren() {
		return [];
	}
	getTreeItem() {
		return new vscode.TreeItem(this.name);
	}
}

interface GenericNode extends vscode.TreeItem {
	getChildren(): vscode.ProviderResult<GenericNode[]>;
  getTreeItem(): vscode.TreeItem | Thenable<vscode.TreeItem>;
}

// this method is called when your extension is deactivated
export function deactivate() {}
