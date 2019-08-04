# Flutter internationalize

Will help you to create json locale files

## Features

Better editor for localization.

![Screenshot](https://user-images.githubusercontent.com/1171479/62425540-fdf5b000-b704-11e9-9e7b-e64964d61118.png)


## Requirements

You will need to create a file calls text_desc.json and also the text_[lang].json for the entry point.
The files must be at locales folder on your root project folder.

Example text_desc.json :
```javascript
{
  "global": [
    {
      "id": "save",
      "text": "Use to indicate save document"
    },
    {
      "id": "cancel",
      "text": "Use to indicate cancel action"
    }
  ],
  "mainmenu": [
    {
      "id": "open",
      "text": "Use to indicate open document"
    }
  ]
}
```

example of text_en.json
```javascript
{
  "global": [
    {
      "id": "save",
      "text": "Save"
    },
    {
      "id": "cancel",
      "text": "Cancel"
    }
  ],
  "mainmenu": [
    {
      "id": "open",
      "text": "Open"
    }
  ]
}
```

Open command (Ctrl + Shift + P) and run "Flutter Internationalize: Open"

If you want to add new language just add new text_[lang].json

**This extension is still on very early development, a lot of thing still be able to improved**


## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

- Initial release

-----------------------------------------------------------------------------------------------------------


## Todo

- [ ] Auto generate required files
- [ ] Write flutter plugin to load files generated from this extension
- [ ] Mapping key from string to int for save memory

**Enjoy!**
