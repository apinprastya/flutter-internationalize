const vscode = require('vscode');
const fs = require('fs')
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

    async save(data) {
        let toSave = {};
        for (let k in data) {
            toSave[k] = data[k].map(v => {
                return {
                    'id': v._id,
                    'text': v[this.lang]
                }
            })
        }
        const str = JSON.stringify(toSave, null, 2);
        fs.writeFileSync(this.uri.path, str)
    }
}

module.exports.LanguagePack = LanguagePack;