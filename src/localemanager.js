const vscode = require('vscode');
const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')
const dartGen = require('./dartgenerator')

const { workspace } = vscode;

class LocaleManager {

    constructor(loadedCallback) {
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
        this.rootPath = '';
        this.rootFsPath = '';
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
            this.rootPath = folders[0].uri.path;
            this.rootFsPath = folders[0].uri.fsPath;
            const a = await workspace.findFiles('**/locales/desc.json', '**/flutter_assets/locales/*.json', 5)
            if (a.length === 0) {
                if (!fs.existsSync(path.join(this.rootFsPath, 'locales')))
                    fs.mkdirSync(path.join(this.rootFsPath, 'locales'))
                const desc = {
                    main: { sample: 'This is sample description', save: 'Use to save document' }
                }
                fs.writeFileSync(path.join(this.rootFsPath, 'locales', 'desc.json'), JSON.stringify(desc, null, 2))
                const EN_US = {
                    main: { sample: 'Example', save: 'Save' }
                }
                fs.writeFileSync(path.join(this.rootFsPath, 'locales', 'EN_US.json'), JSON.stringify(EN_US, null, 2))
                vscode.window.showInformationMessage("We have created desc.json and EN.json files for initial text")
                this.init()
            } else {
                this.readLocaleFile(a[0]);
            }
        }
    }

    async loadText(uri) {
        const text = await workspace.openTextDocument(uri);
        try {
            const json = JSON.parse(text.getText());
            return { json: json, lang: path.basename(uri.path, '.json') }
        } catch (e) {
            vscode.window.showErrorMessage(`Failed to load ${path.basename(uri.path)}. It will uses empty object`)
            return { json: {}, lang: path.basename(uri.path, '.json') }
        }
    }

    async readLocaleFile(descFileUri) {
        this.description = await this.loadText(descFileUri);
        this.load(this.description, true)
        const allLocFiles = (await workspace.findFiles('**/locales/*.json', '**/flutter_assets/locales/*.json', 50)).
            filter(v => !v.path.endsWith('desc.json') && !path.basename(v.path).startsWith('text_'))
        this.totalCount = allLocFiles.length;
        allLocFiles.forEach(v => {
            this.loadText(v).then(v1 => this.load(v1))
        });
    }

    load(pack, init = false) {
        this.cols.push(pack.lang)
        this.langs.push(pack.lang)
        for (let key in pack.json) {
            if (init) {
                this.groups.push(key)
                this.data[key] = []
            }
            let i = 0;
            for (let k in pack.json[key]) {
                if (init) {
                    this.data[key].push({ _key: `${i}`, _id: k, desc: pack.json[key][k] })
                } else {
                    let d = this.data[key].find(v => v._id === k);
                    d[pack.lang] = pack.json[key][k];
                }
                i++
            }
        }
        if (!init) {
            this.count++;
            if (this.count == this.totalCount) this.loadedCallback();
        }
    }

    async save(data, clear = false) {
        this.data = data;
        if (clear) {
            const files = fs.readdirSync(path.join(this.rootFsPath, 'locales'))
            files.filter(v => v.endsWith('.json')).forEach(v => fs.unlinkSync(path.join(this.rootFsPath, 'locales', v)));
        }
        for (let i = 0; i < this.langs.length; i++) {
            let toSave = {};
            for (let k in data) {
                let g = {};
                data[k].forEach(v => g[v._id] = v[this.langs[i]])
                toSave[k] = g;
            }
            const str = JSON.stringify(toSave, null, 2);
            fs.writeFileSync(path.join(this.rootFsPath, 'locales', `${this.langs[i]}.json`), str)
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
        const re = /[a-zA-Z]\w+$/
        let data = {}
        let langs = []
        let langInited = false;
        for (let k in wb.Sheets) {
            const s = wb.Sheets[k]
            let arr = []
            let r = 2;
            let idMap = {}
            const maxCell = s['!ref'].split(':')[1]
            const maxCol = maxCell.substring(0, 1).charCodeAt(0);
            const maxRow = parseInt(maxCell.substring(1));
            for (let i = 66; i <= maxCol; i++) {
                idMap[i] = s[`${String.fromCharCode(i)}1`]['v']
                if (!langInited) {
                    langs.push(s[`${String.fromCharCode(i)}1`]['v'])
                }
            }
            langInited = true;
            for (r = 2; r <= maxRow; r++) {
                const o = s[`A${r}`]
                if (!o) continue;
                const _id = s[`A${r}`]['v'];
                if (!re.test(_id)) {
                    vscode.window.showErrorMessage(`ID "${_id}" not allowed, only alpha, digit and _ are allowed`)
                    return;
                }
                let obj = { '_id': s[`A${r}`]['v'], '_key': r }
                for (let c = 66; c <= maxCol; c++) {
                    const o1 = s[`${String.fromCharCode(c)}${r}`]
                    if (o1)
                        obj[idMap[c]] = s[`${String.fromCharCode(c)}${r}`]['v']
                    else obj[idMap[c]] = ''
                }
                arr.push(obj)
            }
            data[k] = arr;
        }
        this.data = data;
        this.langs = langs
        this.cols = ['_id', ...langs]
        this.save(data, true);
        this.loadedCallback();
    }

    async generate() {
        dartGen.generate(this.rootFsPath, this.data);
    }
}

module.exports.LocaleManager = LocaleManager;