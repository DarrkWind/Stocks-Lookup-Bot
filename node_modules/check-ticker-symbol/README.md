check-ticker-symbol
===================

Introduction
------------

check-ticker-symbol is a simple Node.js module that checks whether a ticker (stock) symbol's format is valid or not. This module does not perform any lookup, it only checks the symbol's format.

Quick Start
-----------

	$ npm install check-ticker-symbol --save


Usage
-----

	var cts = require('check-ticker-symbol');
	...
	if(cts.valid('GOOG')) { // returns TRUE
	...
	}

	var symbolObject = cts.disassemble('GOOG.BY');
	console.log(symbolObject.search);               // GOOG.BY
	console.log(symbolObject.prefixedExchangeCode); // undefined
	console.log(symbolObject.stock);                // GOOG
	console.log(symbolObject.suffixedExchangeCode); // BY

Author
------
Marius <[marius@twostairs.com](mailto:marius@twostairs.com)>
Twitter: [@devilx](https://twitter.com/devilx)

License
-------

May be freely distributed under the [MIT license](https://raw.githubusercontent.com/twostairs/node-check-ticker-symbol/master/LICENSE).

Copyright (c) 2015 twostairs
