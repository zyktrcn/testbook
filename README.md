Ionic 2 App Base
=====================

This is the base template for Ionic 2 starter apps.

## Using this project

You'll need the Ionic CLI with support for v2 apps:

```bash
$ npm install -g ionic
```

Then run:

```bash
$ ionic start myApp
```

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/docs/v2/getting-started/) page.


2.10
project file -> npm install wilddog --save
'src/declarations.d.ts' -> declare module 'wilddog'
'*.ts' -> import wilddog from 'wilddog'

var config = {
	authDomain : 'plant-book.wilddog.com',
	syncURL : 'https://plant-book.wilddog.com'
}
wilddog.initializeApp(config)