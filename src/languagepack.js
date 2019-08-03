const vscode = require('vscode');
const { workspace } = vscode;

class LanguagePack {

    static async load(uri) {
        const lang = new LanguagePack(uri);
        await lang.reload();
        return lang;
    }

    constructor(uri) {
        this.uri = uri;
    }

    async reload() {
        const text = await workspace.openTextDocument(this.uri);
        this.json = JSON.parse(text.getText());
        const splitted = this.uri.path.split('/');
        const fname = splitted[splitted.length - 1]
        this.lang = fname.split('_')[1].split('.')[0];
    }

    async save() {

    }
}

module.exports.LanguagePack = LanguagePack;