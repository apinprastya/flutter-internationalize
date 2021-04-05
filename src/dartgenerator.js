const fs = require('fs')
const path = require('path');

const generate = (rootPath, data) => {
  let strGroupClass = [];
  let groups = [];
  let groupInit = [];
  const re = /{{\w+}}/;

  for (let k in data) {
    const d = data[k];
    const _def = data._default;
    const clsName = `Locale${k}`;
    groups.push(`late ${clsName} _${k};\n  ${clsName} get ${k} => _${k};`);
    groupInit.push(`_${k} = ${clsName}(Map<String, String>.from(_data['${k}']));`);

    const getter = d.map(v => {
      if (re.test(v[_def])) {
        //TODO: check params
      }
      return `String get ${v._id} => _data["${v._id}"]!;`
    })

    let strGroup = `class ${clsName} {
  late final Map<String, String> _data;
  ${clsName}(this._data);

  String getByKey(String key) {
    return _data[key]!;
  }

  ${getter.join('\n  ')}
}\n`;
    strGroupClass.push(strGroup);
  }

  let classStr = `import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

class LocaleBase {
  late Map<String, dynamic> _data;
  late String _path;
  Future<void> load(String path) async {
    _path = path;
    final strJson = await rootBundle.loadString(path);
    _data = jsonDecode(strJson);
    initAll();
  }
  
  Map<String, String> getData(String group) {
    return Map<String, String>.from(_data[group]);
  }

  String getPath() => _path;

  ${groups.join('\n  ')}

  void initAll() {
    ${groupInit.join('\n    ')}
  }
}

${strGroupClass.join('\n')}
`
  if (!fs.existsSync(path.join(rootPath, 'lib', 'generated')))
    fs.mkdirSync(path.join(rootPath, 'lib', 'generated'))
  fs.writeFileSync(path.join(rootPath, 'lib', 'generated', 'locale_base.dart'), classStr);
}

module.exports.generate = generate;