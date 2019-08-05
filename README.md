# Flutter internationalize

Will help you to create json locale files

## Features

Better editor for localization.

![Screenshot](https://user-images.githubusercontent.com/1171479/62425540-fdf5b000-b704-11e9-9e7b-e64964d61118.png)


## Requirements

You will need to create a file called desc.json and also the [lang].json for the entry point in locales folders on root project folder.

Example desc.json :
```javascript
{
  "global": {
    "save": "Use to indicate save document",
    "cancel": "Use to indicate cancel action",
  },
  "mainmenu": {
    "open": "Use to indicate open document"
  }
}

```

example of EN_US.json
```javascript
{
  "global": {
    "save": "Save",
    "cancel": "Cancel",
  },
  "mainmenu": {
    "open": "Open"
  }
}
```

Open command palette (Ctrl + Shift + P) and run "Flutter Internationalize: Open"

If you want to add new language just add new [lang].json

**This extension is still on very early development, a lot of thing still be able to improved**


## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.2

- Break json format using new format

### 0.0.1

- Initial release

-----------------------------------------------------------------------------------------------------------


## Todo

- [ ] Auto generate required files
- [ ] Auto generate dart code to read files
- [ ] Mapping key from string to int for save memory

**Enjoy!**
