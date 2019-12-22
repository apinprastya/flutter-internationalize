# Flutter internationalize

Will help you to create json locale files

## Features

Better editor for localization.

Grouping text for easier managing text


![Screenshot](https://user-images.githubusercontent.com/1171479/62834791-5dab0880-bc7b-11e9-8672-8d0fa250b688.png)


## Requirements

Open command palette (Ctrl + Shift + P) and run "Flutter Internationalize: Open"

This extension will search files json in **locales** folder in your project root folder. And search for **desc.json** as the entry point.
If file not exist, the extension will create it (and also will create 1 json file called EN_US.json).

If you want to add new language just add new [lang].json

### Import from excel file

For excel structure, please do export first to see the structure. **Important: Import will remove all json files inside the "locales" folder**

### Generate dart file and load to application

For easier access from dart side, it can generate the code by click on "Generate dart code" button. The it will create a file called **locale_base.dart** in **lib/generated** folder.

Here example of the generated file :

```dart
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

  Localemain _main;
  Localemain get main => _main;
  Localesetting _setting;
  Localesetting get setting => _setting;

  void initAll() {
    _main = Localemain(Map<String, String>.from(_data['main']));
    _setting = Localesetting(Map<String, String>.from(_data['setting']));
  }
}

class Localemain {
  final Map<String, String> _data;
  Localemain(this._data);

  String get sample => _data["sample"];
  String get save => _data["save"];
  String get cancel => _data["cancel"];
}

class Localesetting {
  final Map<String, String> _data;
  Localesetting(this._data);

  String get global => _data["global"];
  String get labelUsername => _data["labelUsername"];
}

```

To load it on the app, you will need to add it on pubspec.yaml first :

```yaml
  assets:
    - locales/EN_US.json
    - locales/IN_ID.json
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
  final idMap = const {'en': 'locales/EN_US.json', 'id': 'locales/IN_ID.json'};

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

### Example of flutter project

Example can be found at [here](https://github.com/apinprastya/flutter-internationalize/tree/master/example)

**Any contribution are welcome**

**Terima kasih**
