const vscode = require('vscode');
const path = require('path')
const LocaleManager = require('./localemanager')

var _panel = null;
var _localeManager;

function activate(context) {
	let disposable = vscode.commands.registerCommand('extension.open', function () {
		const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
		if (_panel) {
			_panel.reveal(column);
			return;
		}
		const panel = vscode.window.createWebviewPanel('flutter-internationalize', 'Flutter Internationalize', vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
				localResourceRoots: [
					vscode.Uri.file(path.join(context.extensionPath, 'dist'))
				]
			});
		_panel = panel;
		_panel.onDidDispose(() => {
			_panel = undefined;
		});
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
					break;
				}
				case 'import': {
					vscode.window.showOpenDialog({ canSelectFiles: true, canSelectFolders: false, filters: { 'Spreadsheet': ['xls', 'xlsx'] }, canSelectMany: false })
						.then(v => {
							if (v && v.length === 1) {
								_localeManager.importExcel(path.join(context.extensionPath, 'locales'), v[0].path)
							}
						})
					break;
				}
				case 'export': {
					vscode.window.showSaveDialog({ filters: { 'Spreadsheet': ['xls', 'xlsx'] }, saveLabel: "Export" })
						.then(v => {
							_localeManager.saveExport(v.path);
						})
					break;
				}
				case 'generate': {
					_localeManager.generate();
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
function deactivate() {
	console.log('ASD')
}

module.exports = {
	activate,
	deactivate
}
