# Flutter internationalize

Will help you to create json locale files

## Features

Better editor for localization.

Grouping text for easier managing text


![Screenshot](https://user-images.githubusercontent.com/1171479/62695170-fcc3cc00-b9ff-11e9-8491-ee7ac3a84650.png)


## Requirements

Open command palette (Ctrl + Shift + P) and run "Flutter Internationalize: Open"

This extension will search files json in **locales** folder in your project root folder. And search for **desc.json** as the entry point.
If file not exist, the extension will create it.

If you want to add new language just add new [lang].json

### Import from excel file

For excel structure, please do export first to see the structure. **Import will remove all json files inside the "locales" folder**

### Generate dart file and load to application

For easier access from dart side, it can generate the code by click on "Generate dart code" button. The it will create a file called **locale_base** in **lib/generated** folder.

Here example of the files :

```dart
import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

class LocaleBase {
  Map<String, dynamic> _data;    
  Future<void> load(String path) async {
    final strJson = await rootBundle.loadString(path);
    _data = jsonDecode(strJson);
    initAll();
  }

  Localemain _main;
  Localemain get main => _main;

  void initAll() {
    _main = Localemain(Map<String, String>.from(_data['main']));
  }
}

class Localemain {
  final Map<String, String> _data;
  Localemain(this._data);

  String get sample => _data["sample"];
  String get save => _data["save"];
}

```

To load it on the app, you will need to add it on pubspec.yaml first :

```yaml
  assets:
    - locales/EN_US.json
```

And you can load to your app by import the dart code generated above :

```dart
final LocaleBase lBase = LocaleBase;
lBase.load('locales/EN_US.json').then((v) {
  //to read on group main and key sample:
  print(lBase.main.sample);
  //to read on group main and key save:
  print(lBase.main.save);
});

```

Use it on **LocalizationsDelegate**

```dart
class LocDelegate extends LocalizationsDelegate<LocaleBase> {
  const LocDelegate();
  final idMap = const {'en': 'locales/EN.json', 'id': 'locales/ID.json'};

  @override
  bool isSupported(Locale locale) => ['en', 'id'].contains(locale.languageCode);

  @override
  Future<LocaleBase> load(Locale locale) async {
    var lang = 'en';
    if (isSupported(locale)) lang = locale.languageCode;
    final loc = LocaleBase();
    await loc.load(idMap[lang]);
    return loc;
  }

  @override
  bool shouldReload(LocDelegate old) => false;
}
```

Then add delegate to MaterialApp:

```dart
  localizationsDelegates: [
    const LocDelegate(),
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ],
```

And we can get loc text on any widget:
```dart
Widget build(BuildContext context) {
  final loc = Localizations.of<LocaleBase>(context, LocaleBase);
  print(loc.main.save);
  print(loc.main.cancel);
}
```

**This extension is still on development, some changes may happen**

**Any help is appreciated**


**Enjoy!**
