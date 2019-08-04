// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path')
const LocaleManager = require('./localemanager')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

var _panel;
var _localeManager;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('extension.open', function () {
		const panel = vscode.window.createWebviewPanel('flutter-internationalize', 'Flutter Internationalize', vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.file(path.join(context.extensionPath, 'dist'))
				]
			});
		_panel = panel;
		updatePanel(context);
		_localeManager = new LocaleManager.LocaleManager(() => {
			_panel.webview.postMessage({ type: 'initialLoaded', data: _localeManager.getData() })
		});
		_localeManager.init();
		_panel.webview.onDidReceiveMessage(msg => {
			switch (msg.type) {
				case 'save': {
					_localeManager.save(msg.payload).then(v => {
						_panel.webview.postMessage({ type: 'saved' })
					})
				}
			}
		});
	});

	context.subscriptions.push(disposable);
}

function updatePanel(context) {
	const scriptPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'dist', 'bundle.js'));
	const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
	const nonce = getNonce();
	_panel.webview.html = getWebviewContent(scriptUri, nonce);
}

function getWebviewContent(scriptUri, nonce) {
	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Flutter Internationalize</title>
  </head>
  <body>
	  <div id="app"></div>
	  <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
  </html>`;
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
