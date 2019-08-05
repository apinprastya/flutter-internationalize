const vscode = require('vscode');
const langPack = require('./languagepack')
const XLSX = require('xlsx')

const { workspace } = vscode;

class LocaleManager {

    constructor(loadedCallback) {
        this.packs = []
        this.groups = []
        this.langs = []
        this.description = {}
        this.data = {};
        this.loadedCallback = loadedCallback;
        this.cols = ['_id'];
        this.count = 0;
        this.totalCount = 0;
        this.init.bind(this)
        this.load.bind(this)
        this.readLocaleFile.bind(this)
        this.getData.bind(this)
    }

    getData() {
        return {
            groups: this.groups,
            langs: this.langs,
            cols: this.cols,
            data: this.data,
        }
    }

    async init() {
        const folders = workspace.workspaceFolders;
        //TODO: check multiple folders
        if (folders.length == 1) {
            const rootPath = folders[0].uri.path;
            const a = await workspace.findFiles('**/locales/text_desc.json', null, 5)
            if (a.length === 0) {
                vscode.window.showErrorMessage('No locales/text_desc.json found')
            } else {
                this.readLocaleFile(a[0]);
            }
        }
    }

    async readLocaleFile(descFileUri) {
        this.description = await langPack.LanguagePack.load(descFileUri);
        this.load(this.description, true)
        const allLocFiles = await workspace.findFiles('**/locales/text_*.json', null, 50)
        this.totalCount = allLocFiles.length - 1;
        allLocFiles.forEach(v => {
            if (!v.path.endsWith('_desc.json'))
                langPack.LanguagePack.load(v).then(pack => {
                    this.load(pack)
                });
        });
    }

    load(pack, init = false) {
        this.packs.push(pack)
        this.cols.push(pack.lang)
        this.langs.push(pack.lang)
        for (let key in pack.json) {
            if (init) {
                this.groups.push(key)
                this.data[key] = []
            }
            let i = 0;
            pack.json[key].forEach(e => {
                if (init) {
                    this.data[key].push({ _key: `${i}`, _id: e.id, desc: e.text })
                } else {
                    let d = this.data[key].find(v => v._id === e.id);
                    d[pack.lang] = e.text;
                }
                i++
            });
        }
        if (!init) {
            this.count++;
            if (this.count == this.totalCount) this.loadedCallback();
        }
    }

    async save(data) {
        this.data = data;
        for (let i = 0; i < this.packs.length; i++) {
            await this.packs[i].save(this.data)
        }
    }

    async saveExport(path) {
        const wb = XLSX.utils.book_new();
        for (let k in this.data) {
            let wsdata = [['key', ...this.langs]];
            this.data[k].forEach(v => {
                let arr = [];
                arr.push(v._id)
                this.langs.forEach(l => {
                    arr.push(v[l])
                })
                wsdata.push(arr)
            })
            let ws = XLSX.utils.aoa_to_sheet(wsdata);
            XLSX.utils.book_append_sheet(wb, ws, k)
        }
        XLSX.writeFile(wb, path);
    }

    async importExcel(dir, excelPath) {
        const wb = XLSX.readFile(excelPath);
        let data = {}
        for (let k in wb.Sheets) {
            const s = wb.Sheets[k]
            console.log(wb.Sheets[k])
        }
    }
}

module.exports.LocaleManager = LocaleManager;