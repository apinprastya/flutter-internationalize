import 'package:example/generated/locale_base.dart';
import 'package:example/localedelegate.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      localizationsDelegates: [
        const LocDelegate(),
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ],
      home: PageHome(),
    );
  }
}

class PageHome extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final loc = Localizations.of<LocaleBase>(context, LocaleBase)!;
    return Scaffold(
      appBar: AppBar(
        title: Text(loc.main.title),
      ),
      body: Padding(
        padding: EdgeInsets.all(8.0),
        child: Column(
          children: <Widget>[
            RaisedButton(
              child: Text(loc.main.save),
              onPressed: () {},
            ),
            RaisedButton(
              child: Text(loc.main.sample),
              onPressed: () {},
            ),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(loc.main.info),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
