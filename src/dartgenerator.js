const fs = require('fs')
const path = require('path')

const generate = (rootPath, data) => {
  let strGroupClass = [];
  let groups = [];
  let groupInit = [];
  const re = /{{\w+}}/;

  for (let k in data) {
    const d = data[k];
    const _def = data._default;
    const clsName = `Locale${k}`;
    groups.push(`${clsName} _${k};\n  ${clsName} get ${k} => _${k};`);
    groupInit.push(`_${k} = ${clsName}(Map<String, String>.from(_data['${k}']));`);

    const getter = d.map(v => {
      if (re.test(v[_def])) {
        //TODO: check params
      }
      return `String get ${v._id} => _data["${v._id}"];`
    })

    let strGroup = `class ${clsName} {
  final Map<String, String> _data;
  ${clsName}(this._data);

  ${getter.join('\n  ')}
}`;
    strGroupClass.push(strGroup);
  }

  let classStr = `import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

class LocaleBase {
  Map<String, dynamic> _data;    
  Future<void> load(String path) async {
    final strJson = await rootBundle.loadString(path);
    _data = jsonDecode(strJson);
    initAll();
  }
  
  Map<String, String> getData(String key) {
    return Map<String, String>.from(_data[key]);
  }

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