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

  let classStr = `// DO NOT EDIT. This is code generated via flutter-internationalize
// This is a library that provides messages for a locales. All the
// messages from the main program should be duplicated here with the same
// function name.

// Ignore issues from commonly used lints in this file.
// ignore_for_file:unnecessary_brace_in_string_interps, unnecessary_new
// ignore_for_file:prefer_single_quotes,comment_references, directives_ordering
// ignore_for_file:annotate_overrides,prefer_generic_function_type_aliases
// ignore_for_file:unused_import, file_names

import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

class LocaleBase {
  Map<String, dynamic> _data;
  String _path;
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
